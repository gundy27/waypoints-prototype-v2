import { TrendingUp, Target, BookOpen, Dumbbell, Award, ChevronRight, CheckCircle2, Calendar, Shield, Brain, Star, Zap } from 'lucide-react'
import type { UserProfile, ScoreBreakdown, ScoreCategory } from '../data/mockData'
import { RankInsignia, getNextRank, isRankCode } from '../components/RankInsignia'
import type { PromotionWindow } from '../data/promotionTimeline'
import { formatCountdown, formatShortDate } from '../data/promotionTimeline'
import type { CutScoreProjection } from '../data/cutScoreProjection'
import type { RankedOpportunity } from '../data/opportunityEngine'


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

  // Preparation phase — horizontal timeline widget
  const totalDays = window.rule.tigMonthsRequired * 30
  const elapsed = totalDays - window.daysUntilEligible
  const progressPct = Math.max(2, Math.min(96, (elapsed / totalDays) * 100))

  return (
    <div className="mb-4" style={{ paddingTop: 2, paddingBottom: 2 }}>
      {/* Header row */}
      <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: 10 }}>
        <p className="font-body font-medium text-wp-tan-dark uppercase whitespace-nowrap" style={{ fontSize: 10, letterSpacing: '0.06em', marginBottom: 0 }}>
          Promotion Window
        </p>
        <span
          className="font-mono font-bold text-wp-black whitespace-nowrap"
          style={{ fontSize: 'clamp(12px, 4.2vw, 17px)', letterSpacing: '-0.02em', lineHeight: 1 }}
        >
          Opens in {formatCountdown(window.daysUntilEligible)}
        </span>
      </div>

      {/* Timeline container */}
      <div>

        {/* Track row */}
        <div className="relative flex items-center" style={{ height: 20 }}>
          {/* Background track */}
          <div
            className="absolute inset-y-0 flex items-center"
            style={{ left: 0, right: 0 }}
          >
            <div className="w-full rounded-full" style={{ height: 6, background: '#E8D5B7' }} />
          </div>

          {/* Filled progress */}
          <div
            className="absolute inset-y-0 flex items-center"
            style={{ left: 0, width: `${progressPct}%` }}
          >
            <div
              className="w-full rounded-full"
              style={{ height: 6, background: '#D4940A', transition: 'width 700ms ease-out' }}
            />
          </div>

          {/* Left endpoint dot */}
          <div
            className="absolute rounded-full border-2"
            style={{ width: 10, height: 10, left: 0, background: '#D4940A', borderColor: '#D4940A', transform: 'translateX(-50%)' }}
          />

          {/* Current position marker dot */}
          <div
            className="absolute rounded-full"
            style={{
              width: 14,
              height: 14,
              left: `${progressPct}%`,
              transform: 'translateX(-50%)',
              background: '#fff',
              border: '2.5px solid #D4940A',
              boxShadow: '0 0 0 3px rgba(212,148,10,0.15)',
            }}
          />

          {/* Right endpoint dot */}
          <div
            className="absolute rounded-full border-2"
            style={{ width: 10, height: 10, right: 0, background: '#E8D5B7', borderColor: '#C4A87A', transform: 'translateX(50%)' }}
          />
        </div>

        {/* Labels below track */}
        <div className="flex justify-between" style={{ marginTop: 8 }}>
          <div style={{ textAlign: 'left' }}>
            <p className="font-body text-wp-tan-dark" style={{ fontSize: 10, lineHeight: 1.3 }}>
              Earliest Eligibility
            </p>
            <p className="font-body font-medium text-wp-tan-dark" style={{ fontSize: 11, lineHeight: 1.3 }}>
              {formatShortDate(window.eligibilityDate)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="font-body text-wp-tan-dark" style={{ fontSize: 10, lineHeight: 1.3 }}>
              Full Window
            </p>
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
          <ChevronRight size={16} className="text-wp-tan-dark" />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <title>Progress toward cutting score</title>
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


// ── Main CareerTab ───────────────────────────────────────────────────

export default function CareerTab({
  profile,
  promotionWindow,
  cutScoreProjection,
  rankedOpportunities,
  onOpenScoreDetail,
}: CareerTabProps) {
  const rankCandidate = profile.name.split(/\s+/)[0] ?? ''
  const nextRank = isRankCode(rankCandidate) ? getNextRank(rankCandidate) : null

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

      {/* Score Category Tiles */}
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

      {/* Available to You — ranked opportunities */}
      {rankedOpportunities.length > 0 && (
        <div className="mt-5">
          <h2 className="font-heading font-bold text-wp-black mb-3" style={{ fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            Waypoints
          </h2>
          <div className="space-y-2.5">
            {rankedOpportunities.slice(0, 3).map(ranked => (
              <OpportunityCard key={ranked.opportunity.id} ranked={ranked} />
            ))}
          </div>
        </div>
      )}


    </div>
  )
}
