import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const router = Router()
const prisma = new PrismaClient()

// S2S Postback endpoint
router.post('/', async (req, res) => {
  try {
    const {
      click_id,
      transaction_id,
      amount,
      quantity = 1,
      status = 'pending',
      signature,
    } = req.body

    // Verify signature if provided
    if (signature && process.env.POSTBACK_SECRET) {
      const payload = JSON.stringify({ click_id, transaction_id, amount })
      const expectedSignature = crypto
        .createHmac('sha256', process.env.POSTBACK_SECRET)
        .update(payload)
        .digest('hex')
      
      if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid signature' })
      }
    }

    // Check for duplicate conversion
    const existingConversion = await prisma.conversion.findFirst({
      where: {
        clickId: click_id,
        transactionId: transaction_id,
      },
    })

    if (existingConversion) {
      return res.status(409).json({ error: 'Duplicate conversion' })
    }

    // Create conversion
    const conversion = await prisma.conversion.create({
      data: {
        clickId: click_id,
        transactionId: transaction_id,
        amount: parseFloat(amount),
        quantity: parseInt(quantity),
        status,
      },
    })

    // TODO: Emit Socket.IO event for real-time notification

    res.json({
      success: true,
      conversionId: conversion.id,
    })
  } catch (error) {
    res.status(400).json({ error: 'Failed to process conversion' })
  }
})

export default router