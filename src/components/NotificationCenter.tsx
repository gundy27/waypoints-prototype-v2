import { X, FileText, Sparkles, Clock, Flag, CheckCircle2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AppNotification } from './NotificationBell'

interface NotificationCenterProps {
  notifications: AppNotification[]
  onNotificationClick: (n: AppNotification) => void
  onClose: () => void
}

const KIND_ICON: Record<string, LucideIcon> = {
  policy: FileText,
  ai: Sparkles,
  accountability: CheckCircle2,
  countdown: Clock,
  milestone: Flag,
}

const TYPES = [
  { label: 'Policy alerts', desc: 'MARADMINs and changes that affect you' },
  { label: 'AI summaries', desc: "What changed for you this week" },
  { label: 'Accountability', desc: 'Reminders for what you committed to' },
  { label: 'Countdown reminders', desc: 'Tests and deadlines approaching' },
  { label: 'Objective milestones', desc: 'When you clear a waypoint' },
]

export default function NotificationCenter({ notifications, onNotificationClick, onClose }: NotificationCenterProps) {
  return (
    <div className="absolute inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-[90%] max-w-[380px] bg-wp-bg flex flex-col" style={{ boxShadow: '-8px 0 24px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-wp-tan-light bg-white/90">
          <h3 className="font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>Notifications</h3>
          <button type="button" onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full text-wp-tan-dark">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notifications.length === 0 && (
            <p className="px-1 font-body text-wp-tan-dark" style={{ fontSize: 13 }}>You're all caught up.</p>
          )}
          {notifications.map(n => {
            const Icon = KIND_ICON[n.kind ?? 'policy'] ?? FileText
            return (
              <button key={n.id} type="button" onClick={() => onNotificationClick(n)} className="w-full text-left rounded-xl p-3 flex items-start gap-3 border bg-white" style={{ borderColor: n.read ? '#E8D5B7' : 'var(--color-wp-accent)' }}>
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full" style={{ background: 'color-mix(in srgb, var(--color-wp-accent) 12%, white)' }}>
                  <Icon size={15} className="text-wp-accent" strokeWidth={1.9} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-semibold text-wp-black" style={{ fontSize: 13 }}>{n.title}</span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-wp-accent shrink-0" />}
                  </div>
                  <p className="mt-0.5 font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.45 }}>{n.description}</p>
                </div>
              </button>
            )
          })}

          <p className="px-1 pt-4 pb-1 font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark" style={{ fontSize: 11 }}>What you'll be notified about</p>
          {TYPES.map(t => (
            <div key={t.label} className="rounded-xl p-3 bg-white/70 border border-wp-tan-light">
              <span className="font-body font-semibold text-wp-black block" style={{ fontSize: 13 }}>{t.label}</span>
              <span className="font-body text-wp-tan-dark block" style={{ fontSize: 12 }}>{t.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
