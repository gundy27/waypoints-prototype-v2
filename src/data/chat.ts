// Client-side chat plumbing. Talks to the /api/chat proxy (Vite middleware
// in dev, Vercel function in prod) — the Anthropic key never reaches here.

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatContext {
  branch?: string
  rank?: string
  mos?: string
  objective?: string
  gap?: string
  countdown?: string
  recentLogs?: string[]
}

export async function sendChat(messages: ChatMessage[], context: ChatContext): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  })
  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const j = await res.json()
      if (j?.error) msg = j.error
    } catch {
      // ignore
    }
    throw new Error(msg)
  }
  const data = await res.json()
  return (data.reply as string) ?? ''
}
