import { ArrowLeft } from 'lucide-react'
import type { ScoreGap } from '../data/scoring'
import ScoreWheel from './ScoreWheel'

interface GapDetailOverlayProps {
  gap: ScoreGap
  objectiveLabel: string
  projectionNote?: string
  onClose: () => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }

export default function GapDetailOverlay({ gap, objectiveLabel, projectionNote, onClose }: GapDetailOverlayProps) {
  return (
    <div className="absolute inset-0 z-[92] bg-black">
      <div className="relative h-full w-full flex flex-col overflow-hidden bg-wp-bg">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'url(/tan-contours.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />

        <header className="shrink-0 relative z-10 bg-white/90 backdrop-blur-sm px-4 flex items-center border-b border-wp-tan-light" style={{ height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h1 className="font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>{gap.unitLabel}</h1>
        </header>

        <main className="flex-1 overflow-y-auto relative z-10 px-4 pt-5 pb-8">
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 mb-5">
            <ArrowLeft size={18} className="text-wp-accent" />
            <span className="font-body font-medium text-wp-accent" style={{ fontSize: 14 }}>Back</span>
          </button>

          <div className="bg-wp-surface rounded-xl p-5 border border-wp-contour/50 flex items-center gap-4" style={cardShadow}>
            <ScoreWheel score={gap.current} cutTarget={gap.target} label={gap.unitLabel} size={120} />
            <div className="flex-1">
              <p className="font-body text-wp-tan-dark" style={{ fontSize: 12 }}>{objectiveLabel}</p>
              <p className="mt-1 font-body text-wp-black" style={{ fontSize: 14, lineHeight: 1.5 }}>
                {gap.gap === 0
                  ? `You're at or above the ${gap.target} target.`
                  : `${gap.gap} points to the ${gap.target} target.`}
              </p>
            </div>
          </div>

          <h2 className="mt-8 mb-4 font-heading font-bold text-wp-black" style={{ fontSize: 18 }}>Breakdown</h2>
          <div className="space-y-3">
            {gap.components.map(c => {
              const pct = Math.min(100, (c.value / c.max) * 100)
              const maxed = c.value >= c.max
              return (
                <div key={c.label} className="bg-wp-surface rounded-xl p-4 border border-wp-contour/50" style={cardShadow}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-body font-semibold text-wp-black" style={{ fontSize: 14 }}>{c.label}</span>
                    <span className="font-mono text-wp-tan-dark" style={{ fontSize: 13 }}>{c.value}<span style={{ opacity: 0.6 }}>/{c.max}</span></span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-wp-tan-light overflow-hidden">
                    <div className={`h-full rounded-full ${maxed ? 'bg-wp-success' : 'bg-wp-accent'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {projectionNote && (
            <div className="mt-4 bg-wp-surface rounded-xl p-4 border-l-[3px] border-wp-accent" style={cardShadow}>
              <p className="font-body text-wp-black" style={{ fontSize: 13, lineHeight: 1.5 }}>{projectionNote}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
