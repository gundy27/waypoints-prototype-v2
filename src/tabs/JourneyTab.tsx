import { GraduationCap, Share2, Plus, Medal } from 'lucide-react'
import type { LogEntry } from '../data/logs'
import type { UserProfile } from '../data/mockData'
import { WAYPOINT_ICONS } from '../components/waypointIcons'
import ServiceMap from '../components/ServiceMap'
import {
  buildCareerTimeline, fmtMonthYear, timeInService,
} from '../data/serviceHistory'
import type { ServiceHistory, JourneyStats } from '../data/serviceHistory'

interface JourneyTabProps {
  profile: UserProfile
  branchName: string
  history: ServiceHistory
  logs: LogEntry[]
  stats: JourneyStats
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }

const RIBBONS = ['#2D8A4E', '#0A3161', '#A6192E', '#D4940A', '#4B5320', '#6E1020', '#00308F', '#A08060']
const EDUCATION = ['Recruit Training', 'SOI — 0311 Rifleman', 'Leading Marines (MCI)']

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const last = parts[parts.length - 1] ?? ''
  return last.slice(0, 2).toUpperCase()
}

export default function JourneyTab({ profile, branchName, history, logs, stats }: JourneyTabProps) {
  const timeline = buildCareerTimeline(history, logs)

  return (
    <div className="space-y-3 pb-2">
      {/* Hero */}
      <div className="bg-wp-surface rounded-xl p-5 flex items-center gap-4" style={cardShadow}>
        <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-full text-white font-heading font-bold" style={{ background: 'var(--color-wp-accent)', fontSize: 22 }}>
          {initials(profile.name)}
        </div>
        <div className="min-w-0">
          <h2 className="font-heading font-bold text-wp-black truncate" style={{ fontSize: 20 }}>{profile.name}</h2>
          <p className="font-body text-wp-tan-dark truncate" style={{ fontSize: 13 }}>{profile.rank}</p>
          <p className="font-body text-wp-tan-dark truncate" style={{ fontSize: 12 }}>{branchName} · {timeInService(history)} in service</p>
        </div>
      </div>

      {/* Activity stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard value={stats.logs} label="Logs" sub="captured" />
        <StatCard value={stats.objectivesHit} label="Objectives" sub={`${stats.objectivesSwitched} switched`} />
        <StatCard value={stats.waypointsCompleted} label="Waypoints" sub="completed" />
      </div>

      {/* Ribbon rack */}
      <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
        <div className="flex items-center gap-2 mb-3">
          <Medal size={16} className="text-wp-accent" />
          <span className="font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark" style={{ fontSize: 11 }}>Ribbon Rack</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {RIBBONS.map((c, i) => (
            <div key={i} className="h-6 rounded-[3px]" style={{ background: c, boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.12)' }} />
          ))}
        </div>
      </div>

      {/* Service map */}
      <ServiceMap locations={history.locations} />

      {/* Career timeline */}
      <h3 className="pt-3 font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>Career timeline</h3>
      <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
        <ol className="relative">
          {timeline.map((e, i) => {
            const Icon = WAYPOINT_ICONS[e.icon] ?? WAYPOINT_ICONS.flag
            return (
              <li key={e.id} className="flex gap-3 pb-4 last:pb-0 relative">
                {i < timeline.length - 1 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-wp-tan-light" />}
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full" style={{ background: 'color-mix(in srgb, var(--color-wp-accent) 12%, white)' }}>
                  <Icon size={15} className="text-wp-accent" strokeWidth={1.9} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="font-body font-semibold text-wp-black" style={{ fontSize: 14, lineHeight: 1.3 }}>{e.title}</p>
                  {e.subtitle && <p className="font-body text-wp-tan-dark" style={{ fontSize: 12 }}>{e.subtitle}</p>}
                  <p className="font-body text-wp-tan-dark" style={{ fontSize: 12 }}>{fmtMonthYear(e.date)}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Education & quals */}
      <JourneySection icon={<GraduationCap size={16} className="text-wp-accent" />} label="Education & Quals" items={EDUCATION} />

      {/* Export & share */}
      <button type="button" className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg border-[1.5px] border-wp-tan text-wp-black font-body font-medium" style={{ background: '#EBE1D1', minHeight: 48, fontSize: 14 }}>
        <Share2 size={16} /> Share my record
      </button>
    </div>
  )
}

function StatCard({ value, label, sub }: { value: number; label: string; sub: string }) {
  return (
    <div className="bg-wp-surface rounded-xl p-3 flex flex-col items-center text-center" style={cardShadow}>
      <span className="font-heading font-bold text-wp-accent" style={{ fontSize: 26, lineHeight: 1 }}>{value}</span>
      <span className="font-body font-semibold text-wp-black mt-1" style={{ fontSize: 12 }}>{label}</span>
      <span className="font-body text-wp-tan-dark" style={{ fontSize: 10.5 }}>{sub}</span>
    </div>
  )
}

function JourneySection({ icon, label, items }: { icon: React.ReactNode; label: string; items: string[] }) {
  return (
    <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark" style={{ fontSize: 11 }}>{label}</span>
        </div>
        <Plus size={16} className="text-wp-tan-dark" />
      </div>
      <ul className="space-y-1.5">
        {items.map(it => (
          <li key={it} className="font-body text-wp-black" style={{ fontSize: 14 }}>{it}</li>
        ))}
      </ul>
    </div>
  )
}
