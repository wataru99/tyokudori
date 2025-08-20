import express from 'express'
import { PrismaClient } from '@prisma/client'
import pino from 'pino'

const router = express.Router()
const prisma = new PrismaClient()
const logger = pino()

// Create new offer application
router.post('/', async (req, res) => {
  try {
    const { offerId, publisherId, message } = req.body

    if (!offerId || !publisherId || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: offerId, publisherId, message' 
      })
    }

    // Check if offer exists
    const offer = await prisma.offer.findUnique({
      where: { id: offerId }
    })

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' })
    }

    // Check if publisher exists
    const publisher = await prisma.publisher.findUnique({
      where: { id: publisherId }
    })

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' })
    }

    // Check if application already exists
    const existingApplication = await prisma.offerApplication.findFirst({
      where: {
        offerId,
        publisherId
      }
    })

    if (existingApplication) {
      return res.status(409).json({ 
        error: 'Application already exists for this offer and publisher' 
      })
    }

    // Create new application
    const application = await prisma.offerApplication.create({
      data: {
        offerId,
        publisherId,
        message,
        status: 'PENDING'
      },
      include: {
        offer: {
          select: {
            name: true,
            advertiser: {
              select: {
                name: true
              }
            }
          }
        },
        publisher: {
          select: {
            name: true,
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    })

    logger.info(`New offer application created: ${application.id}`)

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    })

  } catch (error) {
    logger.error('Error creating offer application:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get applications for a specific offer (admin/advertiser use)
router.get('/by-offer/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params
    const { status } = req.query

    const whereClause: any = { offerId }
    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase()
    }

    const applications = await prisma.offerApplication.findMany({
      where: whereClause,
      include: {
        publisher: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ applications })

  } catch (error) {
    logger.error('Error fetching applications by offer:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get applications for a specific publisher
router.get('/by-publisher/:publisherId', async (req, res) => {
  try {
    const { publisherId } = req.params
    const { status } = req.query

    const whereClause: any = { publisherId }
    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase()
    }

    const applications = await prisma.offerApplication.findMany({
      where: whereClause,
      include: {
        offer: {
          include: {
            advertiser: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ applications })

  } catch (error) {
    logger.error('Error fetching applications by publisher:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update application status (approve/reject)
router.patch('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params
    const { status, rejectionReason } = req.body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be APPROVED or REJECTED' 
      })
    }

    const application = await prisma.offerApplication.findUnique({
      where: { id: applicationId },
      include: {
        offer: true,
        publisher: {
          include: {
            user: true
          }
        }
      }
    })

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({ 
        error: 'Can only update pending applications' 
      })
    }

    const updatedApplication = await prisma.offerApplication.update({
      where: { id: applicationId },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        reviewedAt: new Date()
      },
      include: {
        offer: {
          include: {
            advertiser: true
          }
        },
        publisher: {
          include: {
            user: true
          }
        }
      }
    })

    // If approved, optionally create an affiliate link automatically
    if (status === 'APPROVED') {
      try {
        const affiliateLink = await prisma.click.create({
          data: {
            offerId: application.offerId,
            publisherId: application.publisherId,
            trackingCode: `TRK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            isActive: true
          }
        })
        
        logger.info(`Affiliate link created for approved application: ${affiliateLink.id}`)
      } catch (linkError) {
        logger.error('Failed to create affiliate link:', linkError)
        // Continue with the response even if link creation fails
      }
    }

    logger.info(`Application ${applicationId} status updated to ${status}`)

    res.json({
      message: `Application ${status.toLowerCase()} successfully`,
      application: updatedApplication
    })

  } catch (error) {
    logger.error('Error updating application status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all applications (admin use)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit
    const { status, offerId, publisherId } = req.query

    const whereClause: any = {}
    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase()
    }
    if (offerId && typeof offerId === 'string') {
      whereClause.offerId = offerId
    }
    if (publisherId && typeof publisherId === 'string') {
      whereClause.publisherId = publisherId
    }

    const [applications, total] = await Promise.all([
      prisma.offerApplication.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          offer: {
            include: {
              advertiser: {
                select: {
                  name: true
                }
              }
            }
          },
          publisher: {
            include: {
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.offerApplication.count({ where: whereClause })
    ])

    res.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    logger.error('Error fetching applications:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router