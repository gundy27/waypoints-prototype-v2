import { useEffect, useMemo, useState } from 'react'
import type { UserProfile } from '../data/mockData'
import type { PromotionWindow } from '../data/promotionTimeline'
import type { CutScoreProjection } from '../data/cutScoreProjection'
import ScoreWheel, { usePrefersReducedMotion } from './ScoreWheel'

interface PostOnboardingPlaceholderProps {
  profile: UserProfile
  promotionWindow: PromotionWindow | null
  cutScoreProjection: CutScoreProjection | null
}

function AnimatedSection({
  show,
  children,
  from = 'down',
  delayMs = 0,
}: {
  show: boolean
  children: React.ReactNode
  from?: 'down' | 'up'
  delayMs?: number
}) {
  const translate = from === 'down' ? 10 : -10
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0px)' : `translateY(${translate}px)`,
        transition: `opacity 420ms ease-out ${delayMs}ms, transform 420ms ease-out ${delayMs}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

export default function PostOnboardingPlaceholder({ profile, promotionWindow, cutScoreProjection }: PostOnboardingPlaceholderProps) {
  const [visible, setVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [stage, setStage] = useState(-1)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setStage(2)
      return
    }

    setStage(-1)
    const timers: number[] = []
    timers.push(window.setTimeout(() => setStage(0), 60))
    timers.push(window.setTimeout(() => setStage(1), 960))
    timers.push(window.setTimeout(() => setStage(2), 1860))
    return () => {
      timers.forEach(id => {
        window.clearTimeout(id)
      })
    }
  }, [prefersReducedMotion])

  const showEstimated = useMemo(
    () => promotionWindow?.phase === 'preparation' && !!cutScoreProjection,
    [promotionWindow?.phase, cutScoreProjection],
  )

  const projectedLow = cutScoreProjection?.projectedLow
  const projectedHigh = cutScoreProjection?.projectedHigh
  const cutTarget = showEstimated && projectedHigh ? projectedHigh : profile.cuttingScore
  const gap = cutTarget - profile.compositeScore
  const gapDisplay = Math.max(0, Math.abs(gap))
  const cutScoreSentence = showEstimated ? 'The estimated cutting score range is:' : 'The current cutting score is:'
  const cutScoreValue =
    showEstimated && typeof projectedLow === 'number' && typeof projectedHigh === 'number'
      ? `${projectedLow}–${projectedHigh}`
      : `${profile.cuttingScore}`

  return (
    <div className="absolute inset-0 z-[85] bg-wp-bg">
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

      <div
        className="relative z-10 h-full flex flex-col px-5 pt-10 pb-10 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <AnimatedSection show={stage >= 0} from="down">
            <p
              className="font-body font-medium text-wp-tan-dark uppercase"
              style={{ fontSize: 12, letterSpacing: '0.04em' }}
            >
              Your JEPES Score
            </p>
            <div className="mt-4 flex justify-center">
              <div
                style={{
                  transform: stage >= 0 ? 'scale(1)' : 'scale(0.96)',
                  transition: prefersReducedMotion ? undefined : 'transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1)',
                }}
              >
                <ScoreWheel
                  score={profile.compositeScore}
                  cutTarget={cutTarget}
                  size={196}
                  strokeWidth={11}
                  animateFromZero
                  animationMs={650}
                  delayMs={150}
                />
              </div>
            </div>
          </AnimatedSection>

          <div className="mt-7 w-full">
            <AnimatedSection show={stage >= 1} from="down">
              <div className="w-full bg-wp-surface rounded-2xl border border-wp-contour/50 px-5 py-4">
                <p className="font-body text-wp-tan-dark" style={{ fontSize: 13, lineHeight: 1.35 }}>
                  {cutScoreSentence}
                </p>
                <div className="mt-2 font-mono font-bold text-wp-black" style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                  {cutScoreValue}
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="mt-7">
            <AnimatedSection show={stage >= 2} from="down">
              {gap > 0 ? (
                <>
                  <p className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 11, letterSpacing: '0.08em' }}>
                    Gap
                  </p>
                  <div
                    className="mt-2 font-mono font-bold"
                    style={{
                      fontSize: 52,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      color: '#CC3333',
                      transform: prefersReducedMotion ? undefined : 'scale(1)',
                    }}
                  >
                    {gapDisplay}
                  </div>
                </>
              ) : (
                <>
                  <p className="font-heading font-bold text-wp-black" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                    Promotable
                  </p>
                  <p className="mt-2 font-body text-wp-tan-dark" style={{ fontSize: 13, lineHeight: 1.35 }}>
                    <span className="font-mono font-bold" style={{ color: '#2D8A4E' }}>
                      {gapDisplay} pts above
                    </span>
                  </p>
                </>
              )}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}

