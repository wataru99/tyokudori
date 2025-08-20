import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import pino from 'pino'
import rateLimit from 'express-rate-limit'
import { PrismaClient } from '@prisma/client'

// Import routes
import healthRoutes from './routes/health'
import offersRoutes from './routes/offers'
import reportsRoutes from './routes/reports'
import linksRoutes from './routes/links'
import postbackRoutes from './routes/postback'
import usersRoutes from './routes/users'
import offerApplicationsRoutes from './routes/offer-applications'

// Import Socket.IO handlers
import { setupSocketHandlers } from './ws/handlers'

// Initialize
const app = express()
const httpServer = createServer(app)
const prisma = new PrismaClient()

// Logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
    credentials: true,
  },
})

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// API Routes
app.use('/api/health', healthRoutes)
app.use('/api/offers', offersRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/links', linksRoutes)
app.use('/api/postback', postbackRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/offer-applications', offerApplicationsRoutes)

// Socket.IO handlers
setupSocketHandlers(io)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
})

// Start server
const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    logger.info('HTTP server closed')
  })
  await prisma.$disconnect()
})