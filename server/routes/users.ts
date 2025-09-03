import express from 'express'
import { PrismaClient } from '@prisma/client'
import pino from 'pino'

const router = express.Router()
const prisma = new PrismaClient()
const logger = pino()

// Get all users with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          firstName: true,
          lastName: true,
          companyName: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ])

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error: error.message }, 'Error fetching users')
    } else {
      logger.error({ error }, 'Error fetching users')
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        publishers: true,
        advertisers: true,
        adminActions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error: error.message }, 'Error fetching user')
    } else {
      logger.error({ error }, 'Error fetching user')
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router