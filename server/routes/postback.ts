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

    // Validate required fields
    if (!click_id || !transaction_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields: click_id, transaction_id, amount' })
    }

    // Find the click to get offer and publisher information
    const click = await prisma.click.findUnique({
      where: { clickId: click_id },
      include: {
        offer: {
          include: {
            advertiser: true
          }
        },
        publisher: true
      }
    })

    if (!click) {
      return res.status(404).json({ error: 'Click not found' })
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

    // Calculate publisher revenue based on offer commission
    const parsedAmount = parseFloat(amount)
    let publisherRevenue = 0
    
    if (click.offer.commissionType === 'CPA') {
      publisherRevenue = click.offer.commissionAmount
    } else if (click.offer.commissionType === 'CPS' && click.offer.commissionPercent) {
      publisherRevenue = (parsedAmount * click.offer.commissionPercent) / 100
    } else {
      publisherRevenue = click.offer.commissionAmount
    }

    // Create conversion with all required fields
    const conversion = await prisma.conversion.create({
      data: {
        clickId: click_id,
        transactionId: transaction_id,
        amount: parsedAmount,
        quantity: parseInt(quantity),
        status: status.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED',
        publisherRevenue,
        offerId: click.offerId,
        publisherId: click.publisherId,
        advertiserId: click.offer.advertiserId,
      },
    })

    // TODO: Emit Socket.IO event for real-time notification

    res.json({
      success: true,
      conversionId: conversion.id,
    })
  } catch (error) {
    console.error('Postback error:', error)
    if (error instanceof Error) {
      res.status(400).json({ error: `Failed to process conversion: ${error.message}` })
    } else {
      res.status(400).json({ error: 'Failed to process conversion' })
    }
  }
})

export default router