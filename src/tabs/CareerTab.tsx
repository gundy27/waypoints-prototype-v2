import { useState } from 'react'
import { TrendingUp, Target, BookOpen, FileText, Dumbbell, Crosshair, Award, ChevronRight } from 'lucide-react'
import type { UserProfile, ScoreBreakdown, Tip } from '../data/mockData'
import { tips } from '../data/mockData'
import PftModal from '../components/PftModal'
import ScoreDetailOverlay from '../components/ScoreDetailOverlay'

interface CareerTabProps {
  profile: UserProfile
  breakdown: ScoreBreakdown[]
  compositeHistory: { month: string; score: number }[]
  onLogPft: (pullUps: number, crunches: number, runMin: number, runSec: number) => void
}

function ScoreCard({ profile, onOpen }: { profile: UserProfile; onOpen: () => void }) {
  const progress = Math.min(100, (profile.compositeScore / profile.cuttingScore) * 100)
  const gap = profile.cuttingScore - profile.compositeScore

  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-wp-surface rounded-xl p-5 border-none cursor-pointer transition-shadow duration-150 hover:shadow-md"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between">
        <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 12, letterSpacing: '0.02em' }}>
          Your Composite Score
        </p>
        <ChevronRight size={18} className="text-wp-tan-dark mt-0.5" />
      </div>
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
    </button>
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
      className="bg-wp-surface rounded-xl p-3.5 border-l-[3px] border-wp-accent"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon size={18} className="text-wp-accent" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="font-body font-semibold text-wp-black" style={{ fontSize: 13 }}>
            {tip.title}
          </h3>
          <p className="mt-1 font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.5 }}>
            {tip.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CareerTab({ profile, breakdown, compositeHistory, onLogPft }: CareerTabProps) {
  const [showPftModal, setShowPftModal] = useState(false)
  const [showScoreDetail, setShowScoreDetail] = useState(false)

  return (
    <div>
      <ScoreCard profile={profile} onOpen={() => setShowScoreDetail(true)} />

      <div className="grid grid-cols-3 gap-2.5 mt-4">
        <button
          onClick={() => setShowPftModal(true)}
          className="flex flex-col items-center justify-center gap-1.5 bg-transparent border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light"
          style={{ height: 56, fontSize: 12 }}
        >
          <Dumbbell size={20} />
          Log PFT
        </button>
        <button
          className="flex flex-col items-center justify-center gap-1.5 bg-transparent border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light opacity-50"
          style={{ height: 56, fontSize: 12 }}
        >
          <Crosshair size={20} />
          Log Rifle
        </button>
        <button
          className="flex flex-col items-center justify-center gap-1.5 bg-transparent border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light opacity-50"
          style={{ height: 56, fontSize: 12 }}
        >
          <Award size={20} />
          Log PME
        </button>
      </div>

      <div className="mt-5">
        <h2 className="font-heading font-bold text-wp-black mb-3" style={{ fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          What You Can Do
        </h2>
        <div className="space-y-2.5">
          {tips.map(tip => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      </div>

      {showPftModal && (
        <PftModal
          onClose={() => setShowPftModal(false)}
          onSubmit={onLogPft}
        />
      )}

      {showScoreDetail && (
        <ScoreDetailOverlay
          profile={profile}
          breakdown={breakdown}
          compositeHistory={compositeHistory}
          onClose={() => setShowScoreDetail(false)}
        />
      )}
    </div>
  )
}
