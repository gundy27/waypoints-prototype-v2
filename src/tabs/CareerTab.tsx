import { useState } from 'react'
import { TrendingUp, Target, BookOpen, FileText, Dumbbell, Crosshair, Award, ChevronRight } from 'lucide-react'
import type { UserProfile, ScoreBreakdown, Tip } from '../data/mockData'
import { tips } from '../data/mockData'
import { RankInsignia, getNextRank, isRankCode } from '../components/RankInsignia'

type TipStatus = 'Not Started' | 'Started' | 'Scheduled' | 'Completed'

const STATUS_CYCLE: TipStatus[] = ['Not Started', 'Started', 'Scheduled', 'Completed']

const STATUS_STYLES: Record<TipStatus, { bg: string; text: string; border: string }> = {
  'Not Started': { bg: '#F5F1EB', text: '#A08060', border: '#D2C4A8' },
  'Started':     { bg: '#FFF4E6', text: '#D4940A', border: '#F5C96A' },
  'Scheduled':   { bg: '#E8F4FF', text: '#1A6BAD', border: '#90C4E8' },
  'Completed':   { bg: '#EAF7EE', text: '#2D8A4E', border: '#82CDA0' },
}

interface CareerTabProps {
  profile: UserProfile
  breakdown: ScoreBreakdown[]
  compositeHistory: { month: string; score: number }[]
  onOpenPftModal: () => void
  onOpenScoreDetail: () => void
}

function ScoreCard({ profile, onOpen }: { profile: UserProfile; onOpen: () => void }) {
  const progress = Math.min(1, profile.compositeScore / profile.cuttingScore)
  const gap = profile.cuttingScore - profile.compositeScore

  const size = 160
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left bg-wp-surface rounded-xl border-none cursor-pointer transition-shadow duration-150 hover:shadow-md"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', padding: '20px 20px 16px' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.08em' }}>
          Progress
        </p>
        <div className="flex items-center gap-2">
          <span
            className="font-body font-bold"
            style={{ fontSize: 12, color: '#FF5522', background: 'rgba(255,85,34,0.10)', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.02em' }}
          >
            Top {100 - profile.percentile}%
          </span>
          <ChevronRight size={16} className="text-wp-tan-dark" />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#E8D5B7"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#D2C4A8"
              strokeWidth={strokeWidth - 4}
              strokeDasharray={`${circumference * (1 - progress) > 0 ? circumference - circumference * progress - 4 : 0} ${circumference}`}
              strokeDashoffset={-circumference * progress - 2}
              strokeLinecap="round"
              opacity={0.5}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#FF5522"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference * progress - 2} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 600ms ease-in-out' }}
            />
          </svg>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ gap: 2 }}
          >
            <span className="font-mono font-bold text-wp-black" style={{ fontSize: 32, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {profile.compositeScore}
            </span>
            <span className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 9, letterSpacing: '0.1em' }}>
              JEPES Score
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 flex-1 min-w-0">
          <div>
            <div className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 10, letterSpacing: '0.06em', marginBottom: 2 }}>
              Cutting Score
            </div>
            <div className="font-mono font-bold text-wp-black" style={{ fontSize: 22, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {profile.cuttingScore}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={13} style={{ color: '#2D8A4E', flexShrink: 0 }} />
              <span className="font-body font-semibold" style={{ fontSize: 13, color: '#2D8A4E', lineHeight: 1.2 }}>
                +{profile.scoreTrend} this month
              </span>
            </div>
            {gap > 0 && (
              <div className="font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.3 }}>
                <span className="font-semibold text-wp-black">{gap} pts</span> to promotion
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

function TipCard({ tip, status, onCycleStatus }: { tip: Tip; status: TipStatus; onCycleStatus: () => void }) {
  const iconMap = {
    gap: Target,
    pme: BookOpen,
    cutting: FileText,
    fitness: Dumbbell,
  }
  const Icon = iconMap[tip.icon]
  const style = STATUS_STYLES[status]

  return (
    <div
      className="bg-wp-surface rounded-xl p-3.5 border-l-[3px] border-wp-accent"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon size={18} className="text-wp-accent" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-body font-semibold text-wp-black" style={{ fontSize: 13 }}>
              {tip.title}
            </h3>
            <button
              type="button"
              onClick={onCycleStatus}
              className="shrink-0 rounded-full font-body font-semibold cursor-pointer border transition-all duration-150 active:scale-95"
              style={{
                fontSize: 10,
                paddingTop: 3,
                paddingBottom: 3,
                paddingLeft: 8,
                paddingRight: 8,
                background: style.bg,
                color: style.text,
                borderColor: style.border,
                letterSpacing: '0.01em',
                lineHeight: 1.4,
              }}
            >
              {status}
            </button>
          </div>
          <p className="mt-1 font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.5 }}>
            {tip.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CareerTab({ profile, onOpenPftModal, onOpenScoreDetail }: CareerTabProps) {
  const [tipStatuses, setTipStatuses] = useState<Record<number, TipStatus>>(
    () => Object.fromEntries(tips.map(t => [t.id, 'Not Started' as TipStatus]))
  )
  const rankCandidate = profile.name.split(/\s+/)[0] ?? ''
  const nextRank = isRankCode(rankCandidate) ? getNextRank(rankCandidate) : null

  function cycleTipStatus(id: number) {
    setTipStatuses(prev => {
      const current = prev[id]
      const idx = STATUS_CYCLE.indexOf(current)
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
      return { ...prev, [id]: next }
    })
  }

  return (
    <div>
      {nextRank && (
        <div className="w-full mb-4 flex flex-col items-center text-center">
          <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 12, letterSpacing: '0.04em' }}>
            Journey to
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <RankInsignia rank={nextRank} color="#1A1A1A" size={44} />
            <div className="font-heading font-bold text-wp-black" style={{ fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {nextRank}
            </div>
          </div>
          <div className="mt-1 font-body text-wp-tan-dark" style={{ fontSize: 13, lineHeight: 1.3 }}>
            Your next promotion rank
          </div>
        </div>
      )}

      <ScoreCard profile={profile} onOpen={onOpenScoreDetail} />

      <div className="grid grid-cols-3 gap-2.5 mt-4">
        <button
          type="button"
          onClick={onOpenPftModal}
          className="flex flex-col items-center justify-center gap-1.5 border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light"
          style={{ height: 56, fontSize: 12, background: '#ebe1d1' }}
        >
          <Dumbbell size={20} />
          Log PFT
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1.5 border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light opacity-50"
          style={{ height: 56, fontSize: 12, background: '#ebe1d1' }}
        >
          <Crosshair size={20} />
          Log Rifle
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1.5 border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light opacity-50"
          style={{ height: 56, fontSize: 12, background: '#ebe1d1' }}
        >
          <Award size={20} />
          Log PME
        </button>
      </div>

      <div className="mt-5">
        <h2 className="font-heading font-bold text-wp-black mb-3" style={{ fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          Waypoints
        </h2>
        <div className="space-y-2.5">
          {tips.map(tip => (
            <TipCard
              key={tip.id}
              tip={tip}
              status={tipStatuses[tip.id]}
              onCycleStatus={() => cycleTipStatus(tip.id)}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
