export type RankCode = 'PVT' | 'PFC' | 'LCpl' | 'Cpl' | 'Sgt'

export const RANKS: RankCode[] = ['PVT', 'PFC', 'LCpl', 'Cpl', 'Sgt']

export function isRankCode(value: string): value is RankCode {
  return (RANKS as readonly string[]).includes(value)
}

export function getNextRank(rank: RankCode): RankCode | null {
  const idx = RANKS.indexOf(rank)
  if (idx < 0) return null
  return RANKS[idx + 1] ?? null
}

function CrossedRifles({ color }: { color: string }) {
  return (
    <g>
      <line x1="8" y1="22" x2="40" y2="26" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8" y1="26" x2="40" y2="22" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="6" y="20.5" width="6" height="3.5" rx="1" fill={color} />
      <rect x="36" y="20.5" width="6" height="3.5" rx="1" fill={color} />
      <rect x="6" y="24.5" width="6" height="3.5" rx="1" fill={color} />
      <rect x="36" y="24.5" width="6" height="3.5" rx="1" fill={color} />
    </g>
  )
}

function Chevron({ y, color }: { y: number; color: string }) {
  return (
    <polyline
      points={`10,${y + 7} 24,${y} 38,${y + 7}`}
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

export function RankInsignia({
  rank,
  selected = false,
  color,
  size = 48,
}: {
  rank: RankCode
  selected?: boolean
  color?: string
  size?: number
}) {
  const stroke = color ?? (selected ? '#FFFFFF' : '#6B5A3E')

  if (rank === 'PVT') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="24" cy="24" r="10" fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    )
  }

  if (rank === 'PFC') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <CrossedRifles color={stroke} />
        <Chevron y={8} color={stroke} />
      </svg>
    )
  }

  if (rank === 'LCpl') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <CrossedRifles color={stroke} />
        <Chevron y={8} color={stroke} />
      </svg>
    )
  }

  if (rank === 'Cpl') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <CrossedRifles color={stroke} />
        <Chevron y={4} color={stroke} />
        <Chevron y={12} color={stroke} />
      </svg>
    )
  }

  if (rank === 'Sgt') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <CrossedRifles color={stroke} />
        <Chevron y={1} color={stroke} />
        <Chevron y={9} color={stroke} />
        <Chevron y={17} color={stroke} />
      </svg>
    )
  }

  return null
}
