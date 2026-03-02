import { useEffect, useState } from 'react'
import type { UserProfile } from '../data/mockData'

interface PostOnboardingPlaceholderProps {
  profile: UserProfile
}

export default function PostOnboardingPlaceholder({ profile }: PostOnboardingPlaceholderProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const gap = profile.cuttingScore - profile.compositeScore

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
          <p
            className="font-body font-medium text-wp-tan-dark uppercase"
            style={{ fontSize: 12, letterSpacing: '0.04em' }}
          >
            Your JEPES Score
          </p>

          <div
            className="mt-3 font-mono font-bold text-wp-black"
            style={{ fontSize: 56, lineHeight: 1, letterSpacing: '-0.03em' }}
          >
            {profile.compositeScore}
          </div>

          <div className="mt-6 w-full bg-wp-surface rounded-2xl border border-wp-contour/50 p-5">
            <div className="flex items-center justify-between">
              <span className="font-body text-wp-tan-dark" style={{ fontSize: 13 }}>
                Current cut line
              </span>
              <span className="font-mono font-semibold text-wp-black" style={{ fontSize: 16 }}>
                {profile.cuttingScore}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-body text-wp-tan-dark" style={{ fontSize: 13 }}>
                Gap
              </span>
              <span
                className="font-mono font-semibold"
                style={{ fontSize: 16, color: gap > 0 ? '#CC3333' : '#2D8A4E' }}
              >
                {gap > 0 ? gap : 0}
              </span>
            </div>

            <div className="mt-5 w-full h-2 bg-wp-tan-light rounded-full overflow-hidden">
              <div
                className="h-full bg-wp-accent rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (profile.compositeScore / profile.cuttingScore) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <p className="font-body text-center text-wp-tan-dark" style={{ fontSize: 13 }}>
          Waypoints will help you close that gap
        </p>
      </div>
    </div>
  )
}

