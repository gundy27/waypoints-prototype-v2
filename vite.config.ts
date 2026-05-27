import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { generateReply } from './api/chatHandler'

// Local dev proxy for the Guide chat — mirrors api/chat.ts (the Vercel
// function used in production). Keeps ANTHROPIC_API_KEY server-side.
function chatApiPlugin(apiKey: string): Plugin {
  return {
    name: 'waypoints-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        let raw = ''
        req.on('data', chunk => { raw += chunk })
        req.on('end', async () => {
          res.setHeader('content-type', 'application/json')
          if (!apiKey) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured in .env' }))
            return
          }
          try {
            const body = JSON.parse(raw || '{}')
            const reply = await generateReply(body, apiKey)
            res.statusCode = 200
            res.end(JSON.stringify({ reply }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      chatApiPlugin(env.ANTHROPIC_API_KEY ?? ''),
    ],
    server: { host: true },
  }
})
