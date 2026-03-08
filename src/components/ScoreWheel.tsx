import { useEffect, useMemo, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(!!mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}

export default function ScoreWheel({
  score,
  cutTarget,
  label = 'JEPES Score',
  size = 160,
  strokeWidth = 10,
  animateFromZero = false,
  animationMs = 600,
  delayMs = 0,
}: {
  score: number
  cutTarget: number
  label?: string
  size?: number
  strokeWidth?: number
  animateFromZero?: boolean
  animationMs?: number
  delayMs?: number
}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const safeTarget = Math.max(1, cutTarget)
  const targetProgress = Math.min(1, Math.max(0, score / safeTarget))

  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth])
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius])

  const [progress, setProgress] = useState(() => (animateFromZero && !prefersReducedMotion ? 0 : targetProgress))

  useEffect(() => {
    if (!animateFromZero || prefersReducedMotion) {
      setProgress(targetProgress)
      return
    }

    setProgress(0)
    const t = window.setTimeout(() => {
      setProgress(targetProgress)
    }, Math.max(0, delayMs))

    return () => window.clearTimeout(t)
  }, [animateFromZero, prefersReducedMotion, targetProgress, delayMs])

  const remainderLen = Math.max(0, circumference - circumference * progress - 4)
  const remainderOffset = -circumference * progress - 2

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <title>Progress toward cutting score</title>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8D5B7" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#D2C4A8"
          strokeWidth={strokeWidth - 4}
          strokeDasharray={`${remainderLen} ${circumference}`}
          strokeDashoffset={remainderOffset}
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
          strokeDasharray={`${Math.max(0, circumference * progress - 2)} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          style={{
            transition: prefersReducedMotion ? undefined : `stroke-dasharray ${animationMs}ms ease-in-out`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 2 }}>
        <span className="font-mono font-bold text-wp-black" style={{ fontSize: Math.round(size * 0.2), lineHeight: 1, letterSpacing: '-0.03em' }}>
          {score}
        </span>
        <span className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: Math.max(9, Math.round(size * 0.056)), letterSpacing: '0.1em' }}>
          {label}
        </span>
      </div>
    </div>
  )
}

