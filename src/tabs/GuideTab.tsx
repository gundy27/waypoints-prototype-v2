import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Calculator, BookOpen, DollarSign } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { sendChat } from '../data/chat'
import type { ChatContext, ChatMessage } from '../data/chat'

interface GuideTabProps {
  context: ChatContext
  messages: ChatMessage[]
  onMessagesChange: (messages: ChatMessage[]) => void
  smartPrompts: string[]
  seedPrompt?: string
  onSeedConsumed: () => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }

export default function GuideTab({ context, messages, onMessagesChange, smartPrompts, seedPrompt, onSeedConsumed }: GuideTabProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (seedPrompt) {
      setInput(seedPrompt)
      onSeedConsumed()
    }
  }, [seedPrompt, onSeedConsumed])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setError(null)
    setInput('')
    const next = [...messages, { role: 'user' as const, content: trimmed }]
    onMessagesChange(next)
    setLoading(true)
    try {
      const reply = await sendChat(next, context)
      onMessagesChange([...next, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 pb-2">
      {/* Chat input hero */}
      <div className="bg-wp-surface rounded-xl p-3" style={cardShadow}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-wp-accent shrink-0" />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(input) }}
            placeholder="Ask Waypoints anything…"
            className="flex-1 bg-transparent outline-none font-body text-wp-black"
            style={{ fontSize: 14 }}
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-wp-accent text-white disabled:opacity-40"
          >
            <Send size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Smart prompts */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {smartPrompts.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => send(p)}
              className="text-left rounded-full px-3 py-2 border border-wp-tan-light bg-white font-body text-wp-black"
              style={{ fontSize: 12.5 }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Conversation */}
      {messages.map((m, i) => (
        m.role === 'user' ? (
          <div key={i} className="flex justify-end">
            <div className="rounded-2xl rounded-br-md bg-wp-accent text-white px-3 py-2 max-w-[85%]" style={{ fontSize: 14, lineHeight: 1.45 }}>
              {m.content}
            </div>
          </div>
        ) : (
          <div key={i} className="bg-wp-surface rounded-2xl rounded-bl-md px-3 py-2.5" style={{ ...cardShadow, maxWidth: '92%' }}>
            <div className="wp-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
            </div>
          </div>
        )
      ))}

      {loading && (
        <div className="bg-wp-surface rounded-2xl rounded-bl-md px-3 py-2.5 inline-flex items-center gap-2" style={cardShadow}>
          <span className="font-body text-wp-tan-dark" style={{ fontSize: 13 }}>Waypoints is thinking…</span>
        </div>
      )}

      {error && (
        <div className="bg-wp-surface rounded-xl p-3 border-l-[3px]" style={{ ...cardShadow, borderColor: '#CC3333' }}>
          <p className="font-body" style={{ fontSize: 13, color: '#CC3333' }}>{error}</p>
        </div>
      )}

      <div ref={bottomRef} />

      {/* Reference & tools (light) */}
      {messages.length === 0 && (
        <div className="bg-wp-surface rounded-xl p-4 mt-2" style={cardShadow}>
          <p className="font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark mb-3" style={{ fontSize: 11 }}>Reference & tools</p>
          <div className="grid grid-cols-3 gap-2">
            <ToolChip icon={<Calculator size={18} className="text-wp-accent" />} label="Fitness calculators" />
            <ToolChip icon={<DollarSign size={18} className="text-wp-accent" />} label="Pay & TSP" />
            <ToolChip icon={<BookOpen size={18} className="text-wp-accent" />} label="Standards & regs" />
          </div>
        </div>
      )}
    </div>
  )
}

function ToolChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" className="rounded-xl p-3 border border-wp-tan-light bg-white flex flex-col items-center gap-1.5 text-center">
      {icon}
      <span className="font-body text-wp-black" style={{ fontSize: 11, lineHeight: 1.2 }}>{label}</span>
    </button>
  )
}
