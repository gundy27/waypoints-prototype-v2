import { useState, useEffect } from 'react'
import { ChevronLeft, Bell, BellOff, AlertCircle, Info, Clock, BookOpen, TrendingUp, Shield } from 'lucide-react'
import { useNotificationPreferences } from '../data/useNotificationPreferences'
import type { NotificationPreferences, NotificationTier } from '../data/useNotificationPreferences'

interface Props {
  mosCode: string
  onClose: () => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body font-medium text-wp-tan-dark uppercase mb-2" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
      {children}
    </p>
  )
}

function ToggleRow({
  icon,
  title,
  subtitle,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-wp-surface border border-wp-contour/50"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', opacity: disabled ? 0.45 : 1 }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,85,34,0.10)' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-body font-semibold text-wp-black" style={{ fontSize: 14 }}>{title}</div>
        {subtitle && (
          <div className="mt-0.5 font-body" style={{ fontSize: 11, color: '#A08060', lineHeight: 1.4 }}>{subtitle}</div>
        )}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        aria-checked={checked}
        role="switch"
        className="shrink-0 relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none"
        style={{
          width: 44,
          height: 26,
          backgroundColor: checked ? '#FF5522' : '#D2C4A8',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span
          className="inline-block rounded-full bg-white transition-transform duration-200"
          style={{
            width: 20,
            height: 20,
            transform: checked ? 'translateX(20px)' : 'translateX(3px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
          }}
        />
      </button>
    </div>
  )
}

function TimeInput({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div
      className="flex-1 flex flex-col gap-1.5 px-3 py-3 rounded-xl bg-wp-surface border border-wp-contour/50"
      style={{ opacity: disabled ? 0.45 : 1 }}
    >
      <span className="font-body font-medium text-wp-tan-dark" style={{ fontSize: 11, letterSpacing: '0.04em' }}>{label}</span>
      <input
        type="time"
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className="font-body font-semibold text-wp-black bg-transparent border-none outline-none"
        style={{ fontSize: 15 }}
      />
    </div>
  )
}

export default function NotificationPreferencesOverlay({ mosCode, onClose }: Props) {
  const { prefs, loading, saving, savedAt, save } = useNotificationPreferences()
  const [draft, setDraft] = useState<NotificationPreferences | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    if (!loading && draft === null) {
      setDraft({ ...prefs })
    }
  }, [loading, prefs, draft])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 280)
  }

  function update<K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) {
    setDraft(prev => prev ? { ...prev, [key]: value } : prev)
  }

  async function handleSave() {
    if (!draft) return
    await save(draft)
  }

  const d = draft ?? prefs
  const pushDisabled = false
  const subDisabled = !d.push_enabled

  return (
    <div
      className="absolute inset-0 z-[110] flex flex-col bg-wp-bg"
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 280ms cubic-bezier(0.32, 0, 0.15, 1)',
      }}
    >
      <div
        className="sticky top-0 z-10 bg-wp-bg px-4 pt-5 pb-4 flex items-center gap-3 border-b border-wp-tan-light"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
          style={{ background: '#ebe1d1', color: '#1A1A1A' }}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-wp-black" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>
            Notifications
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-wp-accent border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">

            <div>
              <SectionLabel>Push Notifications</SectionLabel>
              <ToggleRow
                icon={<Bell size={16} className="text-wp-accent" strokeWidth={1.75} />}
                title="Enable Push Notifications"
                subtitle="Receive alerts on your device"
                checked={d.push_enabled}
                onChange={v => update('push_enabled', v)}
                disabled={pushDisabled}
              />
            </div>

            <div>
              <SectionLabel>Notification Tier</SectionLabel>
              <div className="space-y-2">
                {(
                  [
                    {
                      value: 'critical_only' as NotificationTier,
                      label: 'Critical Only',
                      desc: 'Cutting score changes, rank eligibility shifts — the signals that affect your score',
                      icon: <AlertCircle size={16} strokeWidth={1.75} style={{ color: '#CC3333' }} />,
                      iconBg: 'rgba(204,51,51,0.10)',
                    },
                    {
                      value: 'all' as NotificationTier,
                      label: 'All Updates',
                      desc: 'Also includes tips, reminders, new MARADMINs, and weekly summaries',
                      icon: <Info size={16} strokeWidth={1.75} style={{ color: '#FF5522' }} />,
                      iconBg: 'rgba(255,85,34,0.10)',
                    },
                  ] as const
                ).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={subDisabled}
                    onClick={() => update('tier', opt.value)}
                    className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-150"
                    style={{
                      background: d.tier === opt.value ? '#FFFFFF' : '#F5F1EB',
                      border: d.tier === opt.value ? '2px solid #FF5522' : '1.5px solid #D2C4A8',
                      boxShadow: d.tier === opt.value ? '0 2px 8px rgba(255,85,34,0.12)' : '0 1px 2px rgba(0,0,0,0.04)',
                      opacity: subDisabled ? 0.45 : 1,
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: opt.iconBg }}>
                      {opt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-body font-semibold text-wp-black" style={{ fontSize: 14 }}>{opt.label}</span>
                        <span
                          className="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: d.tier === opt.value ? '#FF5522' : '#D2C4A8' }}
                        >
                          {d.tier === opt.value && (
                            <span className="w-2 h-2 rounded-full" style={{ background: '#FF5522' }} />
                          )}
                        </span>
                      </div>
                      <p className="mt-0.5 font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.45 }}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 font-body text-wp-tan-dark" style={{ fontSize: 11, lineHeight: 1.5 }}>
                "Critical Only" is the default — you only hear from us when it actually matters.
              </p>
            </div>

            <div>
              <SectionLabel>Subscription Topics</SectionLabel>
              <div className="space-y-2">
                <ToggleRow
                  icon={<TrendingUp size={16} className="text-wp-accent" strokeWidth={1.75} />}
                  title="My MOS Cutoff"
                  subtitle={`e.g. "${mosCode} cutting score changed: 780 → 795"`}
                  checked={d.topic_mos_cutoff}
                  onChange={v => update('topic_mos_cutoff', v)}
                  disabled={subDisabled}
                />
                <ToggleRow
                  icon={<Shield size={16} className="text-wp-accent" strokeWidth={1.75} />}
                  title="My Rank Requirements"
                  subtitle={`e.g. "E-4 TIG requirement updated for ${mosCode}"`}
                  checked={d.topic_rank_requirements}
                  onChange={v => update('topic_rank_requirements', v)}
                  disabled={subDisabled}
                />
                <ToggleRow
                  icon={<BookOpen size={16} className="text-wp-accent" strokeWidth={1.75} />}
                  title="Policy Changes"
                  subtitle="e.g. MCI credit policy revised — affects Mental Agility pillar"
                  checked={d.topic_policy_changes}
                  onChange={v => update('topic_policy_changes', v)}
                  disabled={subDisabled}
                />
              </div>
            </div>

            <div>
              <SectionLabel>Quiet Hours</SectionLabel>
              <ToggleRow
                icon={<Clock size={16} className="text-wp-accent" strokeWidth={1.75} />}
                title="Enable Quiet Hours"
                subtitle="No notifications during your set window — good for field hours"
                checked={d.quiet_hours_enabled}
                onChange={v => update('quiet_hours_enabled', v)}
                disabled={subDisabled}
              />
              {d.quiet_hours_enabled && (
                <div className="mt-2 flex gap-2">
                  <TimeInput
                    label="FROM"
                    value={d.quiet_hours_start}
                    onChange={v => update('quiet_hours_start', v)}
                    disabled={subDisabled}
                  />
                  <TimeInput
                    label="TO"
                    value={d.quiet_hours_end}
                    onChange={v => update('quiet_hours_end', v)}
                    disabled={subDisabled}
                  />
                </div>
              )}
            </div>

            <div>
              <SectionLabel>Other</SectionLabel>
              <div className="space-y-2">
                <ToggleRow
                  icon={<Bell size={16} className="text-wp-accent" strokeWidth={1.75} />}
                  title="In-App Badge"
                  subtitle="Show unread dot on the notification bell"
                  checked={d.badge_enabled}
                  onChange={v => update('badge_enabled', v)}
                />
                <ToggleRow
                  icon={<BookOpen size={16} className="text-wp-accent" strokeWidth={1.75} />}
                  title="Weekly Score Summary"
                  subtitle="A digest of your score movement and upcoming windows"
                  checked={d.weekly_summary}
                  onChange={v => update('weekly_summary', v)}
                  disabled={subDisabled}
                />
                <ToggleRow
                  icon={<BellOff size={16} className="text-wp-accent" strokeWidth={1.75} />}
                  title="Do Not Disturb"
                  subtitle="Pause all notifications temporarily"
                  checked={false}
                  onChange={() => {}}
                  disabled={true}
                />
              </div>
              <p className="mt-2 font-body text-wp-tan-dark" style={{ fontSize: 11, lineHeight: 1.5 }}>
                Do Not Disturb and per-notification snooze controls coming in a future update.
              </p>
            </div>

          </div>
        )}
      </div>

      <div className="px-4 pb-8 pt-3 bg-wp-bg" style={{ borderTop: '1px solid #E8D5B7' }}>
        {savedAt !== null && (
          <p className="text-center font-body mb-2" style={{ fontSize: 12, color: '#2D8A4E' }}>
            Preferences saved
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading || draft === null}
          className="w-full flex items-center justify-center gap-2 bg-wp-accent text-white font-body font-semibold rounded-xl border-none cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ height: 52, fontSize: 15 }}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Saving…
            </span>
          ) : (
            'Save Preferences'
          )}
        </button>
      </div>
    </div>
  )
}
