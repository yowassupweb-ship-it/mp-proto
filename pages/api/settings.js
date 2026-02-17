// Simple in-memory storage for settings
// In production, this should be replaced with a database
let settingsStorage = {}

export default function handler(req, res) {
  const { method } = req
  const userId = req.headers['x-user-id'] || 'default-user' // Simple user identification

  if (method === 'GET') {
    // Load settings for user
    const settings = settingsStorage[userId] || null
    
    if (settings) {
      console.log(`[API] Loading settings for user ${userId}:`, settings)
      res.status(200).json(settings)
    } else {
      console.log(`[API] No settings found for user ${userId}`)
      res.status(404).json({ error: 'Settings not found' })
    }
  } else if (method === 'POST') {
    // Save settings for user
    const settings = req.body
    
    settingsStorage[userId] = {
      ...settings,
      updatedAt: new Date().toISOString()
    }
    
    console.log(`[API] Saving settings for user ${userId}:`, settingsStorage[userId])
    res.status(200).json({ success: true, settings: settingsStorage[userId] })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
