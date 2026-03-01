import { ChevronLeft } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import type { UserProfile, ScoreBreakdown } from '../data/mockData'

interface ScoreDetailOverlayProps {
  profile: UserProfile
  breakdown: ScoreBreakdown[]
  compositeHistory: { month: string; score: number }[]
  onClose: () => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }

function CompositeChart({ history, cuttingScore }: { history: { month: string; score: number }[]; cuttingScore: number }) {
  const scores = history.map(h => h.score)
  const minScore = Math.min(...scores, cuttingScore)
  const maxScore = Math.max(...scores, cuttingScore)
  const padding = 40
  const yMin = Math.floor((minScore - padding) / 50) * 50
  const yMax = Math.ceil((maxScore + padding) / 50) * 50

  return (
    <div className="bg-wp-surface rounded-xl p-4 pt-5" style={cardShadow}>
      <p className="font-body font-medium text-wp-tan-dark uppercase mb-4" style={{ fontSize: 11, letterSpacing: '0.02em' }}>
        Composite Score Over Time
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#A08060', fontFamily: 'Inter' }}
            axisLine={{ stroke: '#E8D5B7' }}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: '#A08060', fontFamily: 'Inter' }}
            axisLine={{ stroke: '#E8D5B7' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E8D5B7',
              borderRadius: 8,
              fontSize: 13,
              fontFamily: 'JetBrains Mono',
            }}
          />
          <ReferenceLine
            y={cuttingScore}
            stroke="#CC3333"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: `Cut: ${cuttingScore}`,
              position: 'right',
              fill: '#CC3333',
              fontSize: 11,
              fontFamily: 'Inter',
              fontWeight: 600,
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#FF5522"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#FF5522', stroke: '#FFFFFF', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#FF5522', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function BreakdownSection({ breakdown }: { breakdown: ScoreBreakdown[] }) {
  return (
    <div className="mt-5">
      <p className="font-body font-medium text-wp-tan-dark uppercase mb-3" style={{ fontSize: 11, letterSpacing: '0.02em' }}>
        Score Breakdown
      </p>
      <div className="bg-wp-surface rounded-xl p-4" style={cardShadow}>
        <div className="space-y-4">
          {breakdown.map(item => {
            const pct = Math.min(100, (item.value / item.max) * 100)
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-body text-wp-black" style={{ fontSize: 14, fontWeight: 500 }}>
                    {item.label}
                  </span>
                  <span className="font-mono font-semibold text-wp-black" style={{ fontSize: 14 }}>
                    {item.value}
                    <span className="text-wp-tan-dark font-body font-normal" style={{ fontSize: 12 }}>
                      /{item.max}
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 bg-wp-tan-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-wp-accent rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ScoreDetailOverlay({ profile, breakdown, compositeHistory, onClose }: ScoreDetailOverlayProps) {
  const gap = profile.cuttingScore - profile.compositeScore

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black">
      <div
        className="relative h-full w-full max-w-[428px] flex flex-col overflow-hidden"
        style={{
          backgroundImage: 'url(/tan-contours.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <header className="shrink-0 bg-wp-bg/90 backdrop-blur-sm px-4 flex items-center border-b border-wp-tan-light/50" style={{ height: 56 }}>
          <button
            onClick={onClose}
            className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 -ml-1"
          >
            <ChevronLeft size={22} className="text-wp-accent" />
            <span className="font-body font-medium text-wp-accent" style={{ fontSize: 15 }}>Back</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pt-5 pb-8">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 12, letterSpacing: '0.02em' }}>
              Composite Score
            </span>
            <span className="font-body font-semibold text-wp-accent" style={{ fontSize: 14 }}>
              Top {100 - profile.percentile}%
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-mono font-bold text-wp-black" style={{ fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {profile.compositeScore}
            </span>
            <span className="font-mono font-semibold text-wp-tan-dark" style={{ fontSize: 16 }}>
              / {profile.cuttingScore}
            </span>
            {gap > 0 && (
              <span className="font-body text-wp-danger" style={{ fontSize: 13, fontWeight: 500 }}>
                {gap} pts away
              </span>
            )}
          </div>

          <CompositeChart history={compositeHistory} cuttingScore={profile.cuttingScore} />

          <BreakdownSection breakdown={breakdown} />
        </main>
      </div>
    </div>
  )
}
