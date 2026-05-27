import { Flag, ChevronRight, Check, Sparkles, Trophy } from 'lucide-react'
import type { Objective, Countdown } from '../data/objectives'
import type { ScoreGap } from '../data/scoring'
import type { Waypoint } from '../data/waypoints'
import type { LogEntry } from '../data/logs'
import ScoreWheel from '../components/ScoreWheel'
import CountdownRing from '../components/CountdownRing'
import { WAYPOINT_ICONS } from '../components/waypointIcons'

interface ObjectiveTabProps {
  objective: Objective
  countdown: Countdown | null
  gap: ScoreGap | null
  wpProgress: { completed: number; total: number }
  completedWaypointBonus: number
  branchName: string
  waypoints: Waypoint[]
  recentActivity: LogEntry[]
  onSwitchObjective: () => void
  onOpenWaypoint: (waypoint: Waypoint) => void
  onOpenGapDetail: () => void
  onAskAI: () => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }

function fmtDate(iso: string): string {
  const parts = iso.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return iso
  const d = new Date(parts[0], parts[1] - 1, parts[2])
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ObjectiveTab({
  objective, countdown, gap, wpProgress, completedWaypointBonus, branchName,
  waypoints, recentActivity, onSwitchObjective, onOpenWaypoint, onOpenGapDetail, onAskAI,
}: ObjectiveTabProps) {
  const orderedWaypoints = [...waypoints].sort((a, b) => {
    if (a.status === b.status) return a.order - b.order
    return a.status === 'open' ? -1 : 1
  })
  const objectiveMet = gap ? gap.gap === 0 : wpProgress.total > 0 && wpProgress.completed === wpProgress.total

  return (
    <div className="space-y-3">
      {/* Hero — tap to switch */}
      <button type="button" onClick={onSwitchObjective} className="w-full text-left bg-wp-surface rounded-xl p-5" style={cardShadow}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag size={16} strokeWidth={2} className="text-wp-accent" />
            <span className="font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark" style={{ fontSize: 11 }}>Current Objective</span>
          </div>
          <ChevronRight size={18} className="text-wp-tan-dark" />
        </div>
        <h2 className="mt-2 font-heading font-bold text-wp-black" style={{ fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.02em' }}>{objective.label}</h2>
        <p className="mt-1 font-body text-wp-tan-dark" style={{ fontSize: 12 }}>{branchName} · tap to change</p>
      </button>

      {objectiveMet && (
        <div className="bg-wp-surface rounded-xl p-4 border-l-[3px] border-wp-success flex items-start gap-3" style={cardShadow}>
          <Trophy size={20} className="shrink-0" style={{ color: '#2D8A4E' }} />
          <div>
            <p className="font-body font-semibold text-wp-black" style={{ fontSize: 14 }}>You're tracking ahead</p>
            <p className="mt-0.5 font-body text-wp-tan-dark" style={{ fontSize: 13 }}>Tap your objective to set what's next.</p>
          </div>
        </div>
      )}

      {/* Gap + Countdown row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Gap */}
        {gap ? (
          <button type="button" onClick={onOpenGapDetail} className="text-left bg-wp-surface rounded-xl p-4 flex flex-col items-center" style={cardShadow}>
            <ScoreWheel score={gap.current} cutTarget={gap.target} label={gap.unitLabel} size={104} strokeWidth={8} />
            <p className="mt-2 font-body text-wp-tan-dark text-center" style={{ fontSize: 12 }}>
              {gap.gap === 0 ? `Target ${gap.target} met` : `${gap.gap} to ${gap.target}`}
            </p>
          </button>
        ) : (
          <div className="bg-wp-surface rounded-xl p-4 flex flex-col justify-center" style={cardShadow}>
            <span className="font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark" style={{ fontSize: 11 }}>Progress</span>
            <div className="mt-1 font-mono font-bold text-wp-black" style={{ fontSize: 32, lineHeight: 1 }}>
              {wpProgress.completed}<span className="text-wp-tan-dark" style={{ fontSize: 18 }}>/{wpProgress.total}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-wp-tan-light overflow-hidden">
              <div className="h-full rounded-full bg-wp-accent" style={{ width: `${wpProgress.total ? (wpProgress.completed / wpProgress.total) * 100 : 0}%` }} />
            </div>
            <p className="mt-2 font-body text-wp-tan-dark" style={{ fontSize: 12 }}>waypoints complete</p>
          </div>
        )}

        {/* Countdown */}
        {countdown && (
          <div className="bg-wp-surface rounded-xl p-4 flex flex-col items-center justify-center" style={cardShadow}>
            <CountdownRing daysRemaining={countdown.daysRemaining} elapsedDays={countdown.elapsedDays} totalDays={countdown.totalDays} size={104} strokeWidth={8} />
            <p className="mt-2 font-body text-wp-tan-dark text-center" style={{ fontSize: 12 }}>{countdown.label}</p>
          </div>
        )}
      </div>

      {completedWaypointBonus > 0 && gap && (
        <p className="px-1 font-body font-medium" style={{ fontSize: 12, color: '#2D8A4E' }}>
          +{completedWaypointBonus} from completed waypoints
        </p>
      )}

      {/* Waypoints */}
      <div className="flex items-baseline justify-between pt-5">
        <h3 className="font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>Waypoints</h3>
        <span className="font-mono text-wp-tan-dark" style={{ fontSize: 13 }}>{wpProgress.completed}/{wpProgress.total}</span>
      </div>
      <div className="space-y-2">
        {orderedWaypoints.slice(0, 6).map(w => {
          const Icon = WAYPOINT_ICONS[w.icon]
          const done = w.status === 'completed'
          return (
            <button key={w.id} type="button" onClick={() => onOpenWaypoint(w)} className="w-full text-left bg-wp-surface rounded-xl p-3 flex items-center gap-3" style={cardShadow}>
              <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full" style={{ background: done ? 'rgba(45,138,78,0.12)' : 'color-mix(in srgb, var(--color-wp-accent) 12%, white)' }}>
                {done ? <Check size={18} style={{ color: '#2D8A4E' }} strokeWidth={2.5} /> : <Icon size={18} className="text-wp-accent" strokeWidth={1.9} />}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-body font-semibold block truncate" style={{ fontSize: 14, color: done ? '#A08060' : '#1A1A1A', textDecoration: done ? 'line-through' : 'none' }}>{w.title}</span>
                {!done && w.pointValue ? <span className="font-mono text-wp-tan-dark" style={{ fontSize: 11 }}>+{w.pointValue} pts</span> : null}
              </div>
              <ChevronRight size={18} className="text-wp-tan-dark shrink-0" />
            </button>
          )
        })}
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <>
          <h3 className="pt-5 font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>Recent activity</h3>
          <div className="space-y-2">
            {recentActivity.map(log => {
              const Icon = WAYPOINT_ICONS[log.icon]
              return (
                <div key={log.id} className="bg-wp-surface rounded-xl p-3 flex items-center gap-3" style={cardShadow}>
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-wp-tan-light">
                    <Icon size={16} className="text-wp-tan-dark" strokeWidth={1.9} />
                  </div>
                  <span className="flex-1 font-body text-wp-black truncate" style={{ fontSize: 14 }}>{log.title}</span>
                  <span className="font-body text-wp-tan-dark shrink-0" style={{ fontSize: 12 }}>{fmtDate(log.date)}</span>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* AI prompt entry */}
      <button type="button" onClick={onAskAI} className="w-full text-left bg-wp-surface rounded-xl p-4 flex items-center gap-3 mt-5" style={{ ...cardShadow, borderLeft: '3px solid var(--color-wp-accent)' }}>
        <Sparkles size={20} className="text-wp-accent shrink-0" />
        <span className="font-body text-wp-black" style={{ fontSize: 14 }}>Ask Waypoints anything about your objective</span>
      </button>
    </div>
  )
}
