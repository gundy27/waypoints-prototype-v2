import { ArrowLeft, Shield, Dumbbell, Brain, Star, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea, ResponsiveContainer } from 'recharts'
import type { UserProfile, ScoreBreakdown } from '../data/mockData'
import type { CutScoreProjection } from '../data/cutScoreProjection'
import TabBar from './TabBar'
import type { TabId } from './TabBar'

interface ScoreDetailOverlayProps {
  profile: UserProfile
  breakdown: ScoreBreakdown[]
  compositeHistory: { month: string; score: number }[]
  cutScoreProjection: CutScoreProjection | null
  onClose: () => void
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const cardShadow = { boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }

function CompositeChart({ history, cuttingScore, projection }: { history: { month: string; score: number }[]; cuttingScore: number; projection: CutScoreProjection | null }) {
  const scores = history.map(h => h.score)
  const projHigh = projection?.projectedHigh ?? cuttingScore
  const projLow = projection?.projectedLow ?? cuttingScore
  const minScore = Math.min(...scores, cuttingScore, projLow)
  const maxScore = Math.max(...scores, cuttingScore, projHigh)
  const padding = 40
  const yMin = Math.floor((minScore - padding) / 50) * 50
  const yMax = Math.ceil((maxScore + padding) / 50) * 50

  return (
    <div className="bg-wp-surface rounded-xl p-4 pt-5" style={cardShadow}>
      <p className="font-body font-medium text-wp-tan-dark uppercase mb-4" style={{ fontSize: 11, letterSpacing: '0.02em' }}>
        JEPES Score Over Time
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
          {/* Projected cut score range band */}
          {projection && (
            <ReferenceArea
              y1={projection.projectedLow}
              y2={projection.projectedHigh}
              fill="#CC3333"
              fillOpacity={0.06}
            />
          )}
          {/* Current cut line */}
          <ReferenceLine
            y={cuttingScore}
            stroke="#CC3333"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: projection ? 'Current Cut' : 'Cut Line',
              position: 'insideRight',
              textAnchor: 'end',
              offset: 10,
              dy: -6,
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
      {/* Legend for projected range */}
      {projection && (
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-wp-tan-light/50">
          <div className="w-3 h-2.5 rounded-sm" style={{ background: 'rgba(204,51,51,0.12)' }} />
          <span className="font-body text-wp-tan-dark" style={{ fontSize: 11 }}>
            Projected range for {projection.targetQuarter} ({projection.projectedLow}–{projection.projectedHigh})
          </span>
        </div>
      )}
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

export default function ScoreDetailOverlay({ profile, breakdown, compositeHistory, cutScoreProjection, onClose, activeTab, onTabChange }: ScoreDetailOverlayProps) {
  const projection = cutScoreProjection
  const gapLow = projection ? Math.max(0, projection.projectedLow - profile.compositeScore) : 0
  const gapHigh = projection ? Math.max(0, projection.projectedHigh - profile.compositeScore) : 0
  const staticGap = profile.cuttingScore - profile.compositeScore

  function handleTabChange(tab: TabId) {
    onClose()
    onTabChange(tab)
  }

  return (
    <div className="absolute inset-0 z-[90] bg-black">
      <div
        className="relative h-full w-full flex flex-col overflow-hidden bg-wp-bg"
      >
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
          <h1 className="font-heading font-bold text-wp-black" style={{ fontSize: 20 }}>Score Breakdown</h1>
        </header>

        <main className="flex-1 overflow-y-auto relative z-10 px-4 pt-5 pb-8">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 mb-5 -ml-0.5"
          >
            <ArrowLeft size={18} className="text-wp-accent" />
            <span className="font-body font-medium text-wp-accent" style={{ fontSize: 14 }}>Back</span>
          </button>

          <div className="flex items-baseline justify-between mb-1">
            <span className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 12, letterSpacing: '0.02em' }}>
              JEPES Score
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-mono font-bold text-wp-black" style={{ fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {profile.compositeScore}
            </span>
            <span className="font-mono font-semibold text-wp-tan-dark" style={{ fontSize: 16 }}>
              / {projection ? `${projection.projectedLow}–${projection.projectedHigh}` : profile.cuttingScore}
            </span>
            {projection && (gapLow > 0 || gapHigh > 0) ? (
              <span className="font-body text-wp-danger" style={{ fontSize: 13, fontWeight: 500 }}>
                {gapLow}–{gapHigh} pts away
              </span>
            ) : staticGap > 0 ? (
              <span className="font-body text-wp-danger" style={{ fontSize: 13, fontWeight: 500 }}>
                {staticGap} pts away
              </span>
            ) : null}
          </div>

          <CompositeChart history={compositeHistory} cuttingScore={profile.cuttingScore} projection={cutScoreProjection} />

          <div className="flex flex-wrap justify-center gap-2.5 mt-4">
            {[
              { icon: <Shield size={20} />, label: 'Log Warfighting' },
              { icon: <Dumbbell size={20} />, label: 'Log Physical Toughness' },
              { icon: <Brain size={20} />, label: 'Log Mental Agility' },
              { icon: <Star size={20} />, label: 'Log Command Input' },
              { icon: <Zap size={20} />, label: 'Log Bonus' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-1 border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg text-center"
                style={{ height: 56, fontSize: 11, lineHeight: 1.25, background: '#ebe1d1', width: 'calc(33.333% - 7px)', padding: '0 4px' }}
              >
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>

          <BreakdownSection breakdown={breakdown} />
        </main>

        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}
