import { useMemo, useState } from 'react'
import { UserCircle, RotateCcw, Pencil, Bell, MessageSquare, LogOut, ChevronRight } from 'lucide-react'
import type { UserProfile } from '../data/mockData'
import { RankInsignia, type RankCode } from '../components/RankInsignia'

interface AccountTabProps {
  profile: UserProfile
  onStartOnboarding: () => void
  onResetData: () => void
  onOpenNotifications: () => void
}

type PlaceholderActionId = 'editProfile' | 'notifications' | 'helpFeedback' | 'signOut'

function parseRankCodeFromName(name: string): RankCode | null {
  const maybe = name.trim().split(/\s+/)[0] ?? ''
  if (maybe === 'PVT' || maybe === 'PFC' || maybe === 'LCpl' || maybe === 'Cpl' || maybe === 'Sgt') return maybe
  return null
}

function ActionRow({
  icon,
  title,
  subtitle,
  tone = 'normal',
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  tone?: 'normal' | 'danger'
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left bg-wp-surface border border-wp-contour/50 cursor-pointer transition-colors duration-150 hover:bg-wp-bg disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: tone === 'danger' ? 'rgba(204,51,51,0.12)' : 'rgba(255,85,34,0.10)' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div
            className="font-body font-semibold truncate"
            style={{ fontSize: 14, color: tone === 'danger' ? '#CC3333' : '#1A1A1A' }}
          >
            {title}
          </div>
          <ChevronRight size={18} className="text-wp-tan-dark shrink-0" />
        </div>
        {subtitle && (
          <div className="font-body text-wp-tan-dark mt-0.5" style={{ fontSize: 12 }}>
            {subtitle}
          </div>
        )}
      </div>
    </button>
  )
}

export default function AccountTab({ profile, onStartOnboarding, onResetData, onOpenNotifications }: AccountTabProps) {
  const [lastPlaceholder, setLastPlaceholder] = useState<PlaceholderActionId | null>(null)

  const rankCode = useMemo(() => parseRankCodeFromName(profile.name), [profile.name])

  const placeholderLabel =
    lastPlaceholder === 'editProfile' ? 'Edit Profile' :
    lastPlaceholder === 'notifications' ? 'Notification Preferences' :
    lastPlaceholder === 'helpFeedback' ? 'Help / Feedback' :
    lastPlaceholder === 'signOut' ? 'Sign out' :
    ''

  return (
    <div className="pb-6">
      <div
        className="bg-wp-surface rounded-2xl border border-wp-contour/50 p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center border border-wp-contour/60"
            style={{ background: '#ebe1d1' }}
          >
            {rankCode ? (
              <RankInsignia rank={rankCode} size={56} color="#1A1A1A" />
            ) : (
              <UserCircle size={44} className="text-wp-tan-dark" strokeWidth={1.5} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-heading font-bold text-wp-black truncate" style={{ fontSize: 22, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {profile.name}
            </div>
            <div className="mt-1 font-body text-wp-tan-dark" style={{ fontSize: 13, fontWeight: 600 }}>
              {profile.rank}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-body font-semibold text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
                MOS
              </span>
              <span className="font-body font-medium text-wp-black" style={{ fontSize: 12 }}>
                {profile.mos}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
          Account
        </p>

        <ActionRow
          icon={<UserCircle size={18} className="text-wp-accent" strokeWidth={1.75} />}
          title="Set Up Profile"
          subtitle="Enter your scores and details"
          onClick={() => {
            setLastPlaceholder(null)
            onStartOnboarding()
          }}
        />

        <ActionRow
          icon={<RotateCcw size={18} className="text-wp-tan-dark" strokeWidth={1.75} />}
          title="Reset Demo Data"
          subtitle="Restore the original mock profile"
          onClick={() => {
            setLastPlaceholder(null)
            onResetData()
          }}
        />
      </div>

      <div className="mt-6 space-y-2.5">
        <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
          Preferences
        </p>

        <ActionRow
          icon={<Pencil size={18} className="text-wp-accent" strokeWidth={1.75} />}
          title="Edit Profile"
          subtitle="Coming soon"
          onClick={() => setLastPlaceholder('editProfile')}
        />

        <ActionRow
          icon={<Bell size={18} className="text-wp-accent" strokeWidth={1.75} />}
          title="Notification Preferences"
          subtitle="Topics, tiers, and quiet hours"
          onClick={() => {
            setLastPlaceholder(null)
            onOpenNotifications()
          }}
        />

        <ActionRow
          icon={<MessageSquare size={18} className="text-wp-accent" strokeWidth={1.75} />}
          title="Help / Feedback"
          subtitle="Coming soon"
          onClick={() => setLastPlaceholder('helpFeedback')}
        />
      </div>

      <div className="mt-6 space-y-2.5">
        <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
          Session
        </p>

        <ActionRow
          tone="danger"
          icon={<LogOut size={18} className="text-wp-danger" strokeWidth={1.75} />}
          title="Sign out"
          subtitle="Coming soon"
          onClick={() => setLastPlaceholder('signOut')}
        />
      </div>

      {lastPlaceholder && (
        <div className="mt-5">
          <div
            className="rounded-xl border border-wp-contour/60 bg-wp-bg px-4 py-3"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
          >
            <div className="font-body font-semibold text-wp-black" style={{ fontSize: 13 }}>
              {placeholderLabel}
            </div>
            <div className="mt-0.5 font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.45 }}>
              Placeholder only — we’ll wire this up once account management is implemented.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

