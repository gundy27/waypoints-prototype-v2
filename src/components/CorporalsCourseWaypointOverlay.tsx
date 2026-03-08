import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, CheckCircle2 } from 'lucide-react'

type WeeklyActionId = 'modules' | 'studyBlocks' | 'discuss'

const ACTIONS: { id: WeeklyActionId; label: string }[] = [
  { id: 'modules', label: 'Complete 2 modules' },
  { id: 'studyBlocks', label: 'Complete 3 study blocks (30 min)' },
  { id: 'discuss', label: 'Discuss what you learned with a team mate' },
]

const WEEKS: { id: string; weekNumber: number }[] = Array.from({ length: 32 }, (_, idx) => ({
  id: `week-${idx + 1}`,
  weekNumber: idx + 1,
}))

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function getWeekColor(completedCount: number): { bg: string; border: string } {
  const c = clamp(completedCount, 0, 3)
  if (c === 0) return { bg: '#E8D5B7', border: '#D2C4A8' } // neutral
  if (c === 1) return { bg: 'rgba(45,138,78,0.28)', border: 'rgba(45,138,78,0.35)' }
  if (c === 2) return { bg: 'rgba(45,138,78,0.55)', border: 'rgba(45,138,78,0.65)' }
  return { bg: '#2D8A4E', border: '#2D8A4E' }
}

interface CorporalsCourseWaypointOverlayProps {
  completed: boolean
  onMarkCompleted: () => void
  onClose: () => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }

const CONFETTI = [
  { id: 'c1', x: -90, y: -130, delayMs: 0, rot: -40, color: '#FF5522' },
  { id: 'c2', x: -120, y: -40, delayMs: 30, rot: 25, color: '#D4940A' },
  { id: 'c3', x: -70, y: 40, delayMs: 60, rot: 10, color: '#2D8A4E' },
  { id: 'c4', x: -30, y: -160, delayMs: 90, rot: 65, color: '#1A6BAD' },
  { id: 'c5', x: 10, y: -140, delayMs: 10, rot: -15, color: '#2D8A4E' },
  { id: 'c6', x: 30, y: -95, delayMs: 40, rot: 35, color: '#FF5522' },
  { id: 'c7', x: 60, y: -150, delayMs: 70, rot: -55, color: '#D4940A' },
  { id: 'c8', x: 95, y: -110, delayMs: 100, rot: 20, color: '#1A6BAD' },
  { id: 'c9', x: 120, y: -30, delayMs: 20, rot: -25, color: '#2D8A4E' },
  { id: 'c10', x: 85, y: 30, delayMs: 50, rot: 45, color: '#FF5522' },
  { id: 'c11', x: 45, y: 85, delayMs: 80, rot: -10, color: '#D4940A' },
  { id: 'c12', x: -20, y: 95, delayMs: 110, rot: 15, color: '#2D8A4E' },
]

export default function CorporalsCourseWaypointOverlay({
  completed,
  onMarkCompleted,
  onClose,
}: CorporalsCourseWaypointOverlayProps) {
  const [checked, setChecked] = useState<Record<WeeklyActionId, boolean>>({
    modules: false,
    studyBlocks: false,
    discuss: false,
  })
  const [celebrating, setCelebrating] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const completedCount = useMemo(
    () => ACTIONS.reduce((acc, a) => acc + (checked[a.id] ? 1 : 0), 0),
    [checked],
  )

  const week1Color = useMemo(() => getWeekColor(completedCount), [completedCount])

  function toggle(id: WeeklyActionId) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleMarkCompleted() {
    if (celebrating || completed) return
    setCelebrating(true)
    onMarkCompleted()
    closeTimerRef.current = setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div className="absolute inset-0 z-[92] bg-black">
      <div className="relative h-full w-full flex flex-col overflow-hidden bg-wp-bg">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/tan-contours.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25,
          }}
        />

        <header
          className="shrink-0 relative z-10 bg-white/90 backdrop-blur-sm px-4 flex items-center border-b border-wp-tan-light"
          style={{ height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <h1 className="font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>
            Complete Corporals Course
          </h1>
        </header>

        {celebrating && (
          <div className="absolute inset-0 z-[11] pointer-events-none">
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.10)' }} />
            <div className="absolute left-1/2 top-[210px]" style={{ transform: 'translateX(-50%)' }}>
              <div className="relative" style={{ width: 1, height: 1 }}>
                {CONFETTI.map(p => (
                  (() => {
                    const cssVars = {
                      '--wp-x': `${p.x}px`,
                      '--wp-y': `${p.y}px`,
                      '--wp-r': `${p.rot}deg`,
                    } as React.CSSProperties

                    return (
                      <span
                        key={p.id}
                        className="absolute"
                        style={{
                          width: 10,
                          height: 6,
                          borderRadius: 2,
                          background: p.color,
                          left: 0,
                          top: 0,
                          transform: 'translate(-50%, -50%)',
                          animation: `wpConfetti 820ms cubic-bezier(0.2, 0.9, 0.2, 1) ${p.delayMs}ms forwards`,
                          boxShadow: '0 6px 12px rgba(0,0,0,0.10)',
                          ...cssVars,
                        }}
                      />
                    )
                  })()
                ))}
              </div>
            </div>
            <div
              className="absolute left-1/2 top-[180px] flex items-center gap-2 rounded-full"
              style={{
                transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.92)',
                padding: '8px 12px',
                border: '1px solid rgba(210,196,168,0.8)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                animation: 'wpPopIn 420ms ease-out forwards',
              }}
            >
              <CheckCircle2 size={18} style={{ color: '#2D8A4E' }} />
              <span className="font-body font-semibold text-wp-black" style={{ fontSize: 13 }}>
                Waypoint completed
              </span>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto relative z-10 px-4 pt-5 pb-8" style={{ paddingBottom: 116 }}>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 mb-5 -ml-0.5"
          >
            <ArrowLeft size={18} className="text-wp-accent" />
            <span className="font-body font-medium text-wp-accent" style={{ fontSize: 14 }}>Back</span>
          </button>

          <div className="bg-wp-surface rounded-xl p-4 border border-wp-contour/50" style={cardShadow}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-body text-wp-tan-dark" style={{ fontSize: 13, lineHeight: 1.45 }}>
                Earn 50 Mental Agility points by completing the Corporals Course on MarineNet.
              </p>
              <span
                className="shrink-0 font-mono font-bold rounded-full"
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  background: completed ? 'rgba(45,138,78,0.14)' : 'rgba(45,138,78,0.10)',
                  color: '#2D8A4E',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.6,
                }}
              >
                {completed ? 'Completed' : '+50 pts'}
              </span>
            </div>
          </div>

          <div className="mt-4 bg-wp-surface rounded-xl p-4 border border-wp-contour/50" style={cardShadow}>
            <div className="flex items-baseline justify-between">
              <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.02em' }}>
                Weekly Progress
              </p>
              <span className="font-mono font-bold text-wp-black" style={{ fontSize: 12, letterSpacing: '-0.01em' }}>
                Week 1
              </span>
            </div>

            <div className="mt-3">
              <fieldset
                className="grid grid-cols-8 gap-1 border-0 p-0 m-0 min-w-0"
                aria-label="32-week progress grid"
              >
                {WEEKS.map(week => {
                  const isWeek1 = week.weekNumber === 1
                  const color = isWeek1 ? week1Color : { bg: '#F2E7D6', border: '#E8D5B7' }
                  return (
                    <div
                      key={week.id}
                      role="img"
                      aria-label={`Week ${week.weekNumber} ${isWeek1 ? `(${completedCount} actions complete)` : ''}`}
                      className="rounded-[3px]"
                      style={{
                        width: 14,
                        height: 14,
                        background: color.bg,
                        border: `1px solid ${color.border}`,
                        transition: isWeek1 ? 'background 200ms ease-out, border-color 200ms ease-out' : undefined,
                      }}
                    />
                  )
                })}
              </fieldset>
              <p className="mt-3 font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.45 }}>
                Check off your actions below to fill this week’s square.
              </p>
            </div>
          </div>

          <div className="mt-4 bg-wp-surface rounded-xl p-4 border border-wp-contour/50" style={cardShadow}>
            <h2 className="font-heading font-bold text-wp-black" style={{ fontSize: 16, lineHeight: 1.2 }}>
              Weekly Action Plan
            </h2>

            <ul className="mt-3 space-y-2.5">
              {ACTIONS.map(action => {
                const isChecked = checked[action.id]
                return (
                  <li key={action.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(action.id)}
                      className="shrink-0 rounded-md border-[1.5px] cursor-pointer flex items-center justify-center"
                      aria-pressed={isChecked}
                      aria-label={isChecked ? `Uncheck: ${action.label}` : `Check: ${action.label}`}
                      style={{
                        width: 22,
                        height: 22,
                        borderColor: isChecked ? '#2D8A4E' : '#D2C4A8',
                        background: isChecked ? 'rgba(45,138,78,0.12)' : '#ebe1d1',
                        transition: 'background 160ms ease-out, border-color 160ms ease-out',
                      }}
                    >
                      {isChecked ? <Check size={16} style={{ color: '#2D8A4E' }} strokeWidth={2.5} /> : null}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggle(action.id)}
                      className="flex-1 text-left bg-transparent border-none cursor-pointer p-0"
                      aria-label={isChecked ? `Uncheck: ${action.label}` : `Check: ${action.label}`}
                    >
                      <span
                        className="font-body block"
                        style={{
                          fontSize: 14,
                          lineHeight: 1.35,
                          color: '#1A1A1A',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          opacity: isChecked ? 0.72 : 1,
                        }}
                      >
                        {action.label}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </main>

        <footer
          className="shrink-0 relative z-10 px-4 pt-3 border-t border-wp-tan-light/50"
          style={{
            background: 'rgba(245,241,235,0.94)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          }}
        >
          <button
            type="button"
            onClick={handleMarkCompleted}
            disabled={completed || celebrating}
            className="w-full flex items-center justify-center bg-wp-accent text-white font-body font-semibold rounded-xl border-none cursor-pointer transition-all duration-150 active:opacity-95 disabled:cursor-not-allowed"
            style={{
              height: 54,
              fontSize: 15,
              opacity: completed ? 0.75 : 1,
            }}
          >
            {completed ? 'Waypoint Completed' : 'Mark Waypoint Completed'}
          </button>
        </footer>

        <style>{`
          @keyframes wpConfetti {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.85);
            }
            15% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform:
                translate(calc(-50% + var(--wp-x)), calc(-50% + var(--wp-y)))
                rotate(var(--wp-r))
                scale(0.95);
            }
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
