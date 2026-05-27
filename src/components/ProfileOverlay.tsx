import { X, Download } from 'lucide-react'
import type { ReactNode } from 'react'
import type { UserProfile } from '../data/mockData'
import { useNotificationPreferences } from '../data/useNotificationPreferences'
import type { NotificationPreferences } from '../data/useNotificationPreferences'

interface ProfileOverlayProps {
  profile: UserProfile
  branchName: string
  onReset: () => void
  onStartOnboarding: () => void
  onClose: () => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }

export default function ProfileOverlay({ profile, branchName, onReset, onStartOnboarding, onClose }: ProfileOverlayProps) {
  const { prefs, save } = useNotificationPreferences()
  const set = (patch: Partial<NotificationPreferences>) => save({ ...prefs, ...patch })

  return (
    <div className="absolute inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-[90%] max-w-[380px] bg-wp-bg flex flex-col" style={{ boxShadow: '-8px 0 24px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-wp-tan-light bg-white/90">
          <h3 className="font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>Profile</h3>
          <button type="button" onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full text-wp-tan-dark">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Personal info */}
          <Section label="Personal info">
            <Row k="Name" v={profile.name} />
            <Row k="Branch" v={branchName} />
            <Row k="Rank" v={profile.rank} />
            <Row k="Job" v={profile.mos} />
          </Section>

          {/* Notification preferences */}
          <Section label="Notifications">
            <Toggle label="Push notifications" on={prefs.push_enabled} onChange={v => set({ push_enabled: v })} />
            <Toggle label="Only critical alerts" on={prefs.tier === 'critical_only'} onChange={v => set({ tier: v ? 'critical_only' : 'all' })} />
            <Toggle label="MOS cutoff changes" on={prefs.topic_mos_cutoff} onChange={v => set({ topic_mos_cutoff: v })} />
            <Toggle label="Rank requirements" on={prefs.topic_rank_requirements} onChange={v => set({ topic_rank_requirements: v })} />
            <Toggle label="Policy changes" on={prefs.topic_policy_changes} onChange={v => set({ topic_policy_changes: v })} />
            <Toggle label="Weekly summary" on={prefs.weekly_summary} onChange={v => set({ weekly_summary: v })} />
          </Section>

          {/* Privacy & data */}
          <Section label="Privacy & data">
            <button type="button" className="w-full flex items-center gap-2 font-body text-wp-black" style={{ fontSize: 14, minHeight: 40 }}>
              <Download size={16} className="text-wp-accent" /> Download My Journey
            </button>
            <button type="button" className="w-full text-left font-body" style={{ fontSize: 14, minHeight: 40, color: '#CC3333' }}>
              Delete account
            </button>
          </Section>

          <button type="button" onClick={onStartOnboarding} className="w-full rounded-lg bg-wp-accent text-white font-body font-semibold active:bg-wp-accent-dark" style={{ minHeight: 44, fontSize: 14 }}>
            Restart onboarding
          </button>
          <button type="button" onClick={() => { onReset(); onClose() }} className="w-full rounded-lg border-[1.5px] border-wp-tan text-wp-black font-body font-medium" style={{ background: '#EBE1D1', minHeight: 44, fontSize: 14 }}>
            Reset prototype data
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
      <p className="font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark mb-2" style={{ fontSize: 11 }}>{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="font-body text-wp-tan-dark" style={{ fontSize: 13 }}>{k}</span>
      <span className="font-body font-medium text-wp-black truncate ml-3" style={{ fontSize: 13 }}>{v}</span>
    </div>
  )
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="w-full flex items-center justify-between py-1.5">
      <span className="font-body text-wp-black" style={{ fontSize: 14 }}>{label}</span>
      <span className="relative inline-flex items-center rounded-full transition-colors" style={{ width: 42, height: 24, background: on ? 'var(--color-wp-accent)' : '#D2C4A8' }}>
        <span className="absolute rounded-full bg-white" style={{ width: 18, height: 18, top: 3, left: on ? 21 : 3, transition: 'left 150ms ease-out', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
      </span>
    </button>
  )
}
