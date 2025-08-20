import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all offers with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      keyword,
      page = '1',
      limit = '20',
      status = 'active',
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {
      status,
    }

    if (category) {
      where.category = category
    }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword as string, mode: 'insensitive' } },
        { description: { contains: keyword as string, mode: 'insensitive' } },
      ]
    }

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.offer.count({ where }),
    ])

    res.json({
      offers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' })
  }
})

// Create new offer
router.post('/', async (req, res) => {
  try {
    const offer = await prisma.offer.create({
      data: req.body,
    })
    res.status(201).json(offer)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create offer' })
  }
})

// Get offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await prisma.offer.findUnique({
      where: { id: req.params.id },
    })
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' })
    }
    
    res.json(offer)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offer' })
  }
})

// Update offer
router.put('/:id', async (req, res) => {
  try {
    const offer = await prisma.offer.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(offer)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update offer' })
  }
})

// Delete offer
router.delete('/:id', async (req, res) => {
  try {
    await prisma.offer.delete({
      where: { id: req.params.id },
    })
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete offer' })
  }
})

export default router