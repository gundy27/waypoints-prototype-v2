import { useState } from 'react'
import { Plane, MapPin } from 'lucide-react'
import type { ServiceLocation } from '../data/serviceHistory'
import { fmtMonthYear } from '../data/serviceHistory'

// Simplified continental-US silhouette (viewBox 0 0 1000 600, W→E / N→S).
// Faceted on purpose — reads as a tactical/topographic map outline.
const US_OUTLINE =
  '60,62 250,52 430,58 560,66 590,118 648,150 700,108 770,86 900,86 944,66 ' +
  '910,158 880,210 858,262 838,322 846,360 872,470 840,512 818,432 760,410 ' +
  '700,430 620,430 560,470 520,500 470,452 400,442 330,432 250,402 140,400 ' +
  '110,360 122,318 90,250 70,180 50,110'

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }

function kindColor(kind: ServiceLocation['kind']): string {
  if (kind === 'deployment') return 'var(--color-wp-accent-dark)'
  if (kind === 'training') return 'var(--color-wp-tan-dark)'
  return 'var(--color-wp-accent)'
}

export default function ServiceMap({ locations }: { locations: ServiceLocation[] }) {
  const ordered = [...locations].sort((a, b) => (a.arrival < b.arrival ? -1 : 1))
  const [selectedId, setSelectedId] = useState<string>(ordered[ordered.length - 1]?.id ?? '')
  const selected = ordered.find(l => l.id === selectedId) ?? ordered[0]

  return (
    <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-wp-accent" />
        <span className="font-body font-medium uppercase tracking-[0.04em] text-wp-tan-dark" style={{ fontSize: 11 }}>
          Stations & Deployments
        </span>
      </div>

      {/* Map */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '5 / 3', background: 'var(--color-wp-bg)' }}>
        {/* US silhouette */}
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
          <polygon
            points={US_OUTLINE}
            fill="var(--color-wp-tan-light)"
            stroke="var(--color-wp-tan-dark)"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </svg>

        {/* Route line (own coordinate space, 0–100 on both axes) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
          <polyline
            points={ordered.map(l => `${l.coords.x},${l.coords.y}`).join(' ')}
            fill="none"
            stroke="var(--color-wp-accent)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.75}
          />
        </svg>

        {/* Pins */}
        {ordered.map((l, i) => {
          const isSel = l.id === selected?.id
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelectedId(l.id)}
              className="absolute flex items-center justify-center rounded-full font-heading font-bold text-white"
              style={{
                left: `${l.coords.x}%`,
                top: `${l.coords.y}%`,
                transform: 'translate(-50%, -50%)',
                width: isSel ? 26 : 20,
                height: isSel ? 26 : 20,
                fontSize: isSel ? 12 : 10,
                background: kindColor(l.kind),
                border: '2px solid white',
                boxShadow: isSel ? '0 0 0 3px color-mix(in srgb, var(--color-wp-accent) 35%, transparent)' : '0 1px 2px rgba(0,0,0,0.3)',
                zIndex: isSel ? 20 : 10,
              }}
              aria-label={l.name}
            >
              {l.kind === 'deployment' ? <Plane size={isSel ? 13 : 11} strokeWidth={2.4} /> : i + 1}
            </button>
          )
        })}
      </div>

      {/* Selected-location callout */}
      {selected && (
        <div className="mt-3 flex items-start gap-3 rounded-lg p-3" style={{ background: 'var(--color-wp-bg)' }}>
          <span
            className="shrink-0 flex items-center justify-center rounded-full text-white font-heading font-bold mt-0.5"
            style={{ width: 22, height: 22, fontSize: 11, background: kindColor(selected.kind) }}
          >
            {selected.kind === 'deployment' ? <Plane size={12} strokeWidth={2.4} /> : ordered.indexOf(selected) + 1}
          </span>
          <div className="min-w-0">
            <p className="font-body font-semibold text-wp-black" style={{ fontSize: 14, lineHeight: 1.3 }}>{selected.name}</p>
            <p className="font-body text-wp-tan-dark" style={{ fontSize: 12 }}>{selected.detail} · {selected.place}</p>
            <p className="font-body text-wp-tan-dark" style={{ fontSize: 11, marginTop: 2 }}>
              {fmtMonthYear(selected.arrival)} – {selected.departure ? fmtMonthYear(selected.departure) : 'Present'}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <LegendDot color="var(--color-wp-tan-dark)" label="Training" />
        <LegendDot color="var(--color-wp-accent)" label="Duty station" />
        <LegendDot color="var(--color-wp-accent-dark)" label="Deployment" />
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="rounded-full" style={{ width: 10, height: 10, background: color, border: '1.5px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }} />
      <span className="font-body text-wp-tan-dark" style={{ fontSize: 11 }}>{label}</span>
    </div>
  )
}
