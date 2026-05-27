import { useMemo } from 'react'

interface CountdownRingProps {
  daysRemaining: number
  elapsedDays: number | null
  totalDays: number | null
  size?: number
  strokeWidth?: number
}

/** Time-progress ring with days-remaining in the center. Themed via --color-wp-accent. */
export default function CountdownRing({
  daysRemaining,
  elapsedDays,
  totalDays,
  size = 96,
  strokeWidth = 8,
}: CountdownRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = useMemo(() => {
    if (!totalDays || totalDays <= 0 || elapsedDays == null) return 0
    return Math.min(1, Math.max(0, elapsedDays / totalDays))
  }, [elapsedDays, totalDays])

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <title>Time remaining</title>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8D5B7" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-wp-accent)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * progress} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 1 }}>
        <span className="font-mono font-bold text-wp-black" style={{ fontSize: Math.round(size * 0.26), lineHeight: 1 }}>
          {daysRemaining}
        </span>
        <span className="font-body font-medium text-wp-tan-dark uppercase" style={{ fontSize: 9, letterSpacing: '0.08em' }}>
          days
        </span>
      </div>
    </div>
  )
}
