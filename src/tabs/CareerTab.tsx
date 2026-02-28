import { useState } from 'react'
import { TrendingUp, Target, BookOpen, FileText, Dumbbell, Crosshair, Award } from 'lucide-react'
import type { UserProfile, ScoreBreakdown, Tip } from '../data/mockData'
import { tips } from '../data/mockData'
import PftModal from '../components/PftModal'

interface CareerTabProps {
  profile: UserProfile
  breakdown: ScoreBreakdown[]
  onLogPft: (pullUps: number, crunches: number, runMin: number, runSec: number) => void
}

function ScoreCard({ profile }: { profile: UserProfile }) {
  const progress = Math.min(100, (profile.compositeScore / profile.cuttingScore) * 100)
  const gap = profile.cuttingScore - profile.compositeScore

  return (
    <div className="bg-wp-surface rounded-xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
      <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 12, letterSpacing: '0.02em' }}>
        Your Composite Score
      </p>
      <div className="mt-2 font-mono font-bold text-wp-black" style={{ fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em' }}>
        {profile.compositeScore}
      </div>

      <div className="mt-4 w-full h-2 bg-wp-tan-light rounded-full overflow-hidden">
        <div
          className="h-full bg-wp-accent rounded-full transition-all duration-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono font-semibold text-wp-tan-dark" style={{ fontSize: 20, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          Cutting: {profile.cuttingScore}
        </span>
        <span className="font-body font-semibold text-wp-accent" style={{ fontSize: 14 }}>
          Top {100 - profile.percentile}%
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <TrendingUp size={16} className="text-wp-success" />
        <span className="font-body text-wp-success" style={{ fontSize: 14 }}>
          +{profile.scoreTrend} since last month
        </span>
      </div>

      {gap > 0 && (
        <div className="mt-2 font-body text-wp-tan-dark" style={{ fontSize: 13 }}>
          {gap} points to promotion
        </div>
      )}
    </div>
  )
}

function BreakdownSection({ breakdown }: { breakdown: ScoreBreakdown[] }) {
  return (
    <div className="mt-8">
      <h2 className="font-heading font-bold text-wp-black mb-4" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
        Score Breakdown
      </h2>
      <div className="bg-wp-surface rounded-xl p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
        <div className="space-y-5">
          {breakdown.map(item => {
            const pct = Math.min(100, (item.value / item.max) * 100)
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
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

function TipCard({ tip }: { tip: Tip }) {
  const iconMap = {
    gap: Target,
    pme: BookOpen,
    cutting: FileText,
  }
  const Icon = iconMap[tip.icon]

  return (
    <div
      className="bg-wp-surface rounded-xl p-4 border-l-[3px] border-wp-accent"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon size={20} className="text-wp-accent" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="font-body font-semibold text-wp-black" style={{ fontSize: 14 }}>
            {tip.title}
          </h3>
          <p className="mt-1.5 font-body text-wp-tan-dark" style={{ fontSize: 13, lineHeight: 1.55 }}>
            {tip.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CareerTab({ profile, breakdown, onLogPft }: CareerTabProps) {
  const [showPftModal, setShowPftModal] = useState(false)

  return (
    <div>
      <ScoreCard profile={profile} />

      <BreakdownSection breakdown={breakdown} />

      <div className="mt-8">
        <h2 className="font-heading font-bold text-wp-black mb-4" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          What You Can Do
        </h2>
        <div className="space-y-3">
          {tips.map(tip => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-heading font-bold text-wp-black mb-4" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          Quick Log
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowPftModal(true)}
            className="flex items-center gap-2 bg-transparent border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg px-5 cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light"
            style={{ height: 44, fontSize: 14 }}
          >
            <Dumbbell size={18} />
            Log PFT
          </button>
          <button
            className="flex items-center gap-2 bg-transparent border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg px-5 cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light opacity-50"
            style={{ height: 44, fontSize: 14 }}
          >
            <Crosshair size={18} />
            Log Rifle
          </button>
          <button
            className="flex items-center gap-2 bg-transparent border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg px-5 cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light opacity-50"
            style={{ height: 44, fontSize: 14 }}
          >
            <Award size={18} />
            Log PME
          </button>
        </div>
      </div>

      {showPftModal && (
        <PftModal
          onClose={() => setShowPftModal(false)}
          onSubmit={onLogPft}
        />
      )}
    </div>
  )
}
