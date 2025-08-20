import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// Generate affiliate link
router.post('/generate', async (req, res) => {
  try {
    const { offerId, publisherId, subId, deepLink } = req.body
    
    const clickId = uuidv4()
    const baseUrl = process.env.EXTERNAL_AF_BASE || 'https://markecats.co.jp/product/afad/'
    
    // Build tracking parameters
    const params = new URLSearchParams({
      offer_id: offerId,
      publisher_id: publisherId,
      click_id: clickId,
      ...(subId && { sub_id: subId }),
      ...(deepLink && { url: deepLink }),
    })
    
    const trackingLink = `${baseUrl}?${params.toString()}`
    
    res.json({
      trackingLink,
      clickId,
      shortLink: `${process.env.SHORT_DOMAIN || 'http://localhost:3000'}/c/${clickId}`,
    })
  } catch (error) {
    res.status(400).json({ error: 'Failed to generate link' })
  }
})

// Create invitation link
router.post('/invitation', async (req, res) => {
  try {
    const { role, expiresIn = '7d', maxUses = 1 } = req.body
    
    const inviteCode = uuidv4()
    const inviteLink = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/auth/invite/${inviteCode}`
    
    // TODO: Save invitation to database
    
    res.json({
      inviteLink,
      inviteCode,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxUses,
    })
  } catch (error) {
    res.status(400).json({ error: 'Failed to create invitation' })
  }
})

export default router