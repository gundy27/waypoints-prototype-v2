// Vercel serverless function — production proxy for the Guide chat.
// Mirrors the Vite dev middleware in vite.config.ts. Reads the key from
// the ANTHROPIC_API_KEY environment variable (set in the Vercel dashboard).

import { generateReply } from './chatHandler'
import type { ChatRequestBody } from './chatHandler'

interface VercelLikeRequest {
  method?: string
  body?: unknown
}
interface VercelLikeResponse {
  status: (code: number) => VercelLikeResponse
  json: (data: unknown) => void
}

export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' })
    return
  }
  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as ChatRequestBody
    const reply = await generateReply(body, apiKey)
    res.status(200).json({ reply })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}
