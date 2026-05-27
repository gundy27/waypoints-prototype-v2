import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Waypoint } from '../data/waypoints'
import { WAYPOINT_ICONS } from './waypointIcons'

interface WaypointDetailOverlayProps {
  waypoint: Waypoint
  onComplete: (id: string) => void
  onClose: () => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }

const COMPLETION_HINT: Record<Waypoint['completionLogic'], string> = {
  manual: 'Mark this complete here once you’ve finished it.',
  log: 'This clears automatically when you log a qualifying score from the "+" button.',
  event: 'This clears when the qualifying event is recorded.',
}

const CONFETTI = [
  { id: 'c1', x: -90, y: -130, delayMs: 0, rot: -40, color: 'var(--color-wp-accent)' },
  { id: 'c2', x: -120, y: -40, delayMs: 30, rot: 25, color: '#D4940A' },
  { id: 'c3', x: -70, y: 40, delayMs: 60, rot: 10, color: '#2D8A4E' },
  { id: 'c4', x: -30, y: -160, delayMs: 90, rot: 65, color: '#1A6BAD' },
  { id: 'c5', x: 10, y: -140, delayMs: 10, rot: -15, color: '#2D8A4E' },
  { id: 'c6', x: 30, y: -95, delayMs: 40, rot: 35, color: 'var(--color-wp-accent)' },
  { id: 'c7', x: 60, y: -150, delayMs: 70, rot: -55, color: '#D4940A' },
  { id: 'c8', x: 95, y: -110, delayMs: 100, rot: 20, color: '#1A6BAD' },
  { id: 'c9', x: 120, y: -30, delayMs: 20, rot: -25, color: '#2D8A4E' },
  { id: 'c10', x: 85, y: 30, delayMs: 50, rot: 45, color: 'var(--color-wp-accent)' },
]

export default function WaypointDetailOverlay({ waypoint, onComplete, onClose }: WaypointDetailOverlayProps) {
  const [celebrating, setCelebrating] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const Icon = WAYPOINT_ICONS[waypoint.icon]
  const isCompleted = waypoint.status === 'completed'
  const isAutoClear = waypoint.completionLogic !== 'manual'

  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }, [])

  function handleComplete() {
    if (celebrating || isCompleted) return
    setCelebrating(true)
    onComplete(waypoint.id)
    closeTimerRef.current = setTimeout(onClose, 1000)
  }

  return (
    <div className="absolute inset-0 z-[92] bg-black">
      <div className="relative h-full w-full flex flex-col overflow-hidden bg-wp-bg">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ backgroundImage: 'url(/tan-contours.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }}
        />

        <header className="shrink-0 relative z-10 bg-white/90 backdrop-blur-sm px-4 flex items-center border-b border-wp-tan-light" style={{ height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h1 className="font-heading font-bold text-wp-black truncate" style={{ fontSize: 18 }}>{waypoint.title}</h1>
        </header>

        {celebrating && (
          <div className="absolute inset-0 z-[11] pointer-events-none">
            <div className="absolute left-1/2 top-[200px]" style={{ transform: 'translateX(-50%)' }}>
              <div className="relative" style={{ width: 1, height: 1 }}>
                {CONFETTI.map(p => {
                  const cssVars = { '--wp-x': `${p.x}px`, '--wp-y': `${p.y}px`, '--wp-r': `${p.rot}deg` } as CSSProperties & Record<string, string>
                  return (
                    <span key={p.id} className="absolute" style={{ width: 10, height: 6, borderRadius: 2, background: p.color, left: 0, top: 0, transform: 'translate(-50%, -50%)', animation: `wpConfetti 820ms cubic-bezier(0.2,0.9,0.2,1) ${p.delayMs}ms forwards`, ...cssVars }} />
                  )
                })}
              </div>
            </div>
            <div className="absolute left-1/2 top-[170px] flex items-center gap-2 rounded-full" style={{ transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.92)', padding: '8px 12px', border: '1px solid rgba(210,196,168,0.8)', boxShadow: '0 10px 30px rgba(0,0,0,0.18)', animation: 'wpPopIn 420ms ease-out forwards' }}>
              <CheckCircle2 size={18} style={{ color: '#2D8A4E' }} />
              <span className="font-body font-semibold text-wp-black" style={{ fontSize: 13 }}>Waypoint completed</span>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto relative z-10 px-4 pt-5" style={{ paddingBottom: 116 }}>
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 mb-5">
            <ArrowLeft size={18} className="text-wp-accent" />
            <span className="font-body font-medium text-wp-accent" style={{ fontSize: 14 }}>Back</span>
          </button>

          <div className="bg-wp-surface rounded-xl p-4 border border-wp-contour/50" style={cardShadow}>
            <div className="flex items-start gap-3">
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full" style={{ background: 'color-mix(in srgb, var(--color-wp-accent) 12%, white)' }}>
                <Icon size={20} strokeWidth={1.9} className="text-wp-accent" />
              </div>
              <div className="flex-1">
                <p className="font-body text-wp-black" style={{ fontSize: 14, lineHeight: 1.45 }}>{waypoint.description}</p>
                {(waypoint.pointValue || isCompleted) && (
                  <span className="mt-2 inline-block font-mono font-bold rounded-full" style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(45,138,78,0.12)', color: '#2D8A4E' }}>
                    {isCompleted ? 'Completed' : `+${waypoint.pointValue} pts`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-wp-surface rounded-xl p-4 border border-wp-contour/50" style={cardShadow}>
            <h2 className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.02em' }}>Why it matters</h2>
            <p className="mt-2 font-body text-wp-black" style={{ fontSize: 14, lineHeight: 1.5 }}>{waypoint.whyItMatters}</p>
          </div>

          <div className="mt-4 bg-wp-surface rounded-xl p-4 border border-wp-contour/50" style={cardShadow}>
            <h2 className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.02em' }}>How to complete</h2>
            <p className="mt-2 font-body text-wp-black" style={{ fontSize: 14, lineHeight: 1.5 }}>{COMPLETION_HINT[waypoint.completionLogic]}</p>
          </div>

          {waypoint.relatedLinks && waypoint.relatedLinks.length > 0 && (
            <div className="mt-4 bg-wp-surface rounded-xl p-4 border border-wp-contour/50" style={cardShadow}>
              <h2 className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.02em' }}>Related</h2>
              <ul className="mt-2 space-y-2">
                {waypoint.relatedLinks.map(link => (
                  <li key={link.ref} className="flex items-center gap-2">
                    <ExternalLink size={14} className="text-wp-accent shrink-0" />
                    <span className="font-body text-wp-black" style={{ fontSize: 13 }}>{link.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>

        <footer className="shrink-0 relative z-10 px-4 pt-3 border-t border-wp-tan-light/50" style={{ background: 'rgba(245,241,235,0.94)', backdropFilter: 'blur(10px)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleted || celebrating || isAutoClear}
            className="w-full flex items-center justify-center bg-wp-accent text-white font-body font-semibold rounded-xl border-none cursor-pointer transition-all duration-150 active:opacity-95 disabled:cursor-not-allowed"
            style={{ height: 54, fontSize: 15, opacity: isCompleted || isAutoClear ? 0.7 : 1 }}
          >
            {isCompleted ? 'Waypoint Completed' : isAutoClear ? 'Clears when you log it' : 'Mark Waypoint Complete'}
          </button>
        </footer>

        <style>{`
          @keyframes wpConfetti {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
            15% { opacity: 1; }
            100% { opacity: 0; transform: translate(calc(-50% + var(--wp-x)), calc(-50% + var(--wp-y))) rotate(var(--wp-r)) scale(0.95); }
          }
          @keyframes wpPopIn {
            0% { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.98); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
          }
        `}</style>
      </div>
    </div>
  )
}
