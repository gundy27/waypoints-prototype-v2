// Shared chat logic for the Waypoints Guide assistant.
// Imported by both the Vite dev middleware (local) and the Vercel
// serverless function (deploy). The Anthropic API key stays server-side.

import Anthropic from '@anthropic-ai/sdk'

export interface ChatContext {
  branch?: string
  rank?: string
  mos?: string
  objective?: string
  gap?: string
  countdown?: string
  recentLogs?: string[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequestBody {
  messages: ChatMessage[]
  context?: ChatContext
}

const INSTRUCTIONS = `You are Waypoints, an AI career coach inside a mobile app for U.S. military service members.

Your job: help the user reach their current career objective (usually promotion or fitness). You understand promotion mechanics across branches (Marine Corps cutting scores / JEPES, Army promotion points, Air Force & Space Force WAPS, Navy & Coast Guard Final Multiple Score), fitness tests (PFT, CFT, ACFT, PRT, PT Test, PFA), PME, evaluations, and military jargon.

Style:
- Mobile-first: compact, scannable, direct. Short paragraphs and tight bullet lists.
- Use Markdown. Use tables when comparing options or showing breakdowns.
- Lead with the answer, then the why.
- If the request is underspecified, ask one focused follow-up question.
- Be honest about uncertainty. Do NOT invent exact cutting scores, MARADMIN numbers, or policy specifics that you are not given — describe how to find them instead.
- Never give medical, legal, or financial advice beyond general education.`

function buildContextBlock(ctx?: ChatContext): string {
  if (!ctx) return 'No additional user context provided.'
  const lines: string[] = ['Current user context:']
  if (ctx.branch) lines.push(`- Branch: ${ctx.branch}`)
  if (ctx.rank) lines.push(`- Rank: ${ctx.rank}`)
  if (ctx.mos) lines.push(`- Job: ${ctx.mos}`)
  if (ctx.objective) lines.push(`- Objective: ${ctx.objective}`)
  if (ctx.gap) lines.push(`- Gap: ${ctx.gap}`)
  if (ctx.countdown) lines.push(`- Countdown: ${ctx.countdown}`)
  if (ctx.recentLogs && ctx.recentLogs.length) lines.push(`- Recent activity: ${ctx.recentLogs.join('; ')}`)
  return lines.join('\n')
}

export async function generateReply(body: ChatRequestBody, apiKey: string): Promise<string> {
  const client = new Anthropic({ apiKey })

  const system: Anthropic.TextBlockParam[] = [
    { type: 'text', text: INSTRUCTIONS, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: buildContextBlock(body.context) },
  ]

  const messages: Anthropic.MessageParam[] = body.messages
    .filter(m => m.content.trim().length > 0)
    .map(m => ({ role: m.role, content: m.content }))

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    output_config: { effort: 'low' },
    system,
    messages,
  })

  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('\n')
    .trim()
}
