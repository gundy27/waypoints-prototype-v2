import { useState } from 'react'
import { TrendingUp, TrendingDown, Target, BookOpen, FileText, Dumbbell, Crosshair, Award, ChevronRight, Clock, CheckCircle2, Calendar } from 'lucide-react'
import type { UserProfile, ScoreBreakdown, Tip, ScoreCategory } from '../data/mockData'
import { tips } from '../data/mockData'
import { RankInsignia, getNextRank, isRankCode } from '../components/RankInsignia'
import { getPromotionWindowLabel } from '../data/useAppState'
import type { PromotionWindow } from '../data/promotionTimeline'
import { formatCountdown, formatShortDate } from '../data/promotionTimeline'
import type { CutScoreProjection } from '../data/cutScoreProjection'
import type { RankedOpportunity } from '../data/opportunityEngine'

type TipStatus = 'Not Started' | 'Started' | 'Scheduled' | 'Completed'

const STATUS_CYCLE: TipStatus[] = ['Not Started', 'Started', 'Scheduled', 'Completed']

const STATUS_STYLES: Record<TipStatus, { bg: string; text: string; border: string }> = {
  'Not Started': { bg: '#F5F1EB', text: '#A08060', border: '#D2C4A8' },
  'Started':     { bg: '#FFF4E6', text: '#D4940A', border: '#F5C96A' },
  'Scheduled':   { bg: '#E8F4FF', text: '#1A6BAD', border: '#90C4E8' },
  'Completed':   { bg: '#EAF7EE', text: '#2D8A4E', border: '#82CDA0' },
}

const CATEGORY_BORDER_COLORS: Record<ScoreCategory, string> = {
  warfighting: '#FF5522',
  physicalToughness: '#2D8A4E',
  mentalAgility: '#D4940A',
  commandInput: '#1A6BAD',
  bonus: '#A08060',
}

const OPP_ICON_MAP = {
  book: BookOpen,
  dumbbell: Dumbbell,
  target: Target,
  award: Award,
  calendar: Calendar,
  star: CheckCircle2,
}

interface CareerTabProps {
  profile: UserProfile
  breakdown: ScoreBreakdown[]
  compositeHistory: { month: string; score: number }[]
  promotionWindow: PromotionWindow | null
  cutScoreProjection: CutScoreProjection | null
  rankedOpportunities: RankedOpportunity[]
  currentSeason: 'pft' | 'cft'
  onOpenPftModal: () => void
  onOpenScoreDetail: () => void
}

// ── Promotion Window Banner ──────────────────────────────────────────

function PromotionWindowBanner({ window }: { window: PromotionWindow }) {
  if (window.phase === 'tracking') {
    return (
      <div
        className="bg-wp-surface rounded-xl p-3.5 border-l-[3px] mb-4"
        style={{ borderLeftColor: '#2D8A4E', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <CheckCircle2 size={18} style={{ color: '#2D8A4E' }} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 10, letterSpacing: '0.06em', marginBottom: 2 }}>
              Promotion Window
            </p>
            <p className="font-body font-semibold" style={{ fontSize: 14, color: '#2D8A4E', lineHeight: 1.3 }}>
              Eligible now
            </p>
            <p className="font-body text-wp-tan-dark" style={{ fontSize: 11, lineHeight: 1.4, marginTop: 2 }}>
              Eligible since {formatShortDate(window.eligibilityDate)}. Meet the cutting score to promote.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Preparation phase
  const totalDays = window.rule.tigMonthsRequired * 30
  const elapsed = totalDays - window.daysUntilEligible
  const progressPct = Math.max(0, Math.min(100, (elapsed / totalDays) * 100))

  return (
    <div
      className="bg-wp-surface rounded-xl p-3.5 border-l-[3px] mb-4"
      style={{ borderLeftColor: '#D4940A', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <Clock size={18} style={{ color: '#D4940A' }} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 10, letterSpacing: '0.06em', marginBottom: 2 }}>
            Promotion Window
          </p>
          <p className="font-mono font-bold text-wp-black" style={{ fontSize: 18, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Opens in {formatCountdown(window.daysUntilEligible)}
          </p>
          <p className="font-body text-wp-tan-dark" style={{ fontSize: 11, lineHeight: 1.4, marginTop: 2 }}>
            Earliest eligibility: {formatShortDate(window.eligibilityDate)}
          </p>
          <div className="mt-2.5 w-full h-1.5 bg-wp-tan-light rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: '#D4940A', transition: 'width 600ms ease-in-out' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Score Card ───────────────────────────────────────────────────────

function ScoreCard({ profile, projection, onOpen }: { profile: UserProfile; projection: CutScoreProjection | null; onOpen: () => void }) {
  const cutTarget = projection ? projection.projectedHigh : profile.cuttingScore
  const progress = Math.min(1, profile.compositeScore / cutTarget)

  const size = 160
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Gap messaging
  const gapLow = projection ? Math.max(0, projection.projectedLow - profile.compositeScore) : 0
  const gapHigh = projection ? Math.max(0, projection.projectedHigh - profile.compositeScore) : 0
  const staticGap = profile.cuttingScore - profile.compositeScore

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
            {getPromotionWindowLabel(profile.promotionWindowStart, profile.promotionWindowEnd)}
          </span>
          <ChevronRight size={16} className="text-wp-tan-dark" />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8D5B7" strokeWidth={strokeWidth} />
            <circle
              cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#D2C4A8"
              strokeWidth={strokeWidth - 4}
              strokeDasharray={`${circumference * (1 - progress) > 0 ? circumference - circumference * progress - 4 : 0} ${circumference}`}
              strokeDashoffset={-circumference * progress - 2}
              strokeLinecap="round" opacity={0.5}
            />
            <circle
              cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#FF5522"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference * progress - 2} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 600ms ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 2 }}>
            <span className="font-mono font-bold text-wp-black" style={{ fontSize: 32, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {profile.compositeScore}
            </span>
            <span className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 9, letterSpacing: '0.1em' }}>
              JEPES Score
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3.5 flex-1 min-w-0">
          {/* Projected cut line or static cutting score */}
          {projection ? (
            <div>
              <div className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 10, letterSpacing: '0.06em', marginBottom: 2 }}>
                Projected Cut
              </div>
              <div className="font-mono font-bold text-wp-black" style={{ fontSize: 20, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {projection.projectedLow}–{projection.projectedHigh}
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                {projection.trend === 'falling' ? (
                  <TrendingDown size={12} style={{ color: '#2D8A4E', flexShrink: 0 }} />
                ) : (
                  <TrendingUp size={12} style={{ color: '#CC3333', flexShrink: 0 }} />
                )}
                <span className="font-body font-medium" style={{ fontSize: 11, color: projection.trend === 'falling' ? '#2D8A4E' : '#CC3333', lineHeight: 1.2 }}>
                  {projection.trend === 'falling' ? '↓' : '↑'} ~{Math.abs(projection.quarterlyChange)} pts/qtr
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 10, letterSpacing: '0.06em', marginBottom: 2 }}>
                Cutting Score
              </div>
              <div className="font-mono font-bold text-wp-black" style={{ fontSize: 22, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {profile.cuttingScore}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={13} style={{ color: '#2D8A4E', flexShrink: 0 }} />
              <span className="font-body font-semibold" style={{ fontSize: 13, color: '#2D8A4E', lineHeight: 1.2 }}>
                +{profile.scoreTrend} this month
              </span>
            </div>
            {projection && (gapLow > 0 || gapHigh > 0) ? (
              <div className="font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.3 }}>
                ~<span className="font-semibold text-wp-black">{gapLow}–{gapHigh} pts</span> needed
              </div>
            ) : staticGap > 0 ? (
              <div className="font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.3 }}>
                <span className="font-semibold text-wp-black">{staticGap} pts</span> to promotion
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  )
}

// ── Opportunity Card ─────────────────────────────────────────────────

function OpportunityCard({ ranked }: { ranked: RankedOpportunity }) {
  const { opportunity, urgencyLabel } = ranked
  const Icon = OPP_ICON_MAP[opportunity.icon]
  const borderColor = CATEGORY_BORDER_COLORS[opportunity.category]

  return (
    <div
      className="bg-wp-surface rounded-xl p-3.5 border-l-[3px]"
      style={{ borderLeftColor: borderColor, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon size={18} style={{ color: borderColor }} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-body font-semibold text-wp-black" style={{ fontSize: 13 }}>
              {opportunity.title}
            </h3>
            <span
              className="shrink-0 font-mono font-bold rounded-full"
              style={{
                fontSize: 10,
                padding: '2px 8px',
                background: 'rgba(45,138,78,0.10)',
                color: '#2D8A4E',
                letterSpacing: '-0.01em',
                lineHeight: 1.6,
              }}
            >
              +{opportunity.pointImpact} pts
            </span>
          </div>
          <p className="mt-1 font-body text-wp-tan-dark" style={{ fontSize: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {opportunity.description}
          </p>
          {urgencyLabel && (
            <p className="mt-1.5 font-body font-medium" style={{ fontSize: 11, color: '#D4940A', lineHeight: 1.3 }}>
              {urgencyLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Tip Card ─────────────────────────────────────────────────────────

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

// ── Main CareerTab ───────────────────────────────────────────────────

export default function CareerTab({
  profile,
  promotionWindow,
  cutScoreProjection,
  rankedOpportunities,
  currentSeason,
  onOpenPftModal,
  onOpenScoreDetail,
}: CareerTabProps) {
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
      {/* Journey to next rank */}
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

      {/* Promotion Window Banner */}
      {promotionWindow && <PromotionWindowBanner window={promotionWindow} />}

      {/* Score Card */}
      <ScoreCard profile={profile} projection={cutScoreProjection} onOpen={onOpenScoreDetail} />

      {/* Action Buttons — season-aware first button */}
      <div className="grid grid-cols-3 gap-2.5 mt-4">
        <button
          type="button"
          onClick={onOpenPftModal}
          className="flex flex-col items-center justify-center gap-1.5 border-[1.5px] border-wp-tan text-wp-black font-body font-medium rounded-lg cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light"
          style={{ height: 56, fontSize: 12, background: '#ebe1d1' }}
        >
          <Dumbbell size={20} />
          {currentSeason === 'pft' ? 'Log PFT' : 'Log CFT'}
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

      {/* Available to You — ranked opportunities */}
      {rankedOpportunities.length > 0 && (
        <div className="mt-5">
          <h2 className="font-heading font-bold text-wp-black mb-3" style={{ fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            Available to You
          </h2>
          <div className="space-y-2.5">
            {rankedOpportunities.slice(0, 3).map(ranked => (
              <OpportunityCard key={ranked.opportunity.id} ranked={ranked} />
            ))}
          </div>
        </div>
      )}

      {/* Waypoints */}
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
