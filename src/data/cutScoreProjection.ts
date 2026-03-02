import { cutScoreHistory } from './mockData'
import type { CutScoreEntry } from './mockData'

export interface CutScoreProjection {
  mosCode: string
  toRank: string
  history: CutScoreEntry[]
  currentScore: number
  projectedLow: number
  projectedMid: number
  projectedHigh: number
  targetQuarter: string
  trend: 'rising' | 'falling' | 'stable'
  quarterlyChange: number
}

export function getHistoryForMos(mos: string, toRank: string): CutScoreEntry[] {
  return cutScoreHistory
    .filter(e => e.mos === mos && e.toRank === toRank)
    .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime())
}

export function projectCutScore(
  mosCode: string,
  toRank: string,
  targetQuarter: string,
  quartersAhead: number = 1,
): CutScoreProjection | null {
  const history = getHistoryForMos(mosCode, toRank)
  if (history.length < 2) return null

  const currentScore = history[history.length - 1].score

  // Average quarterly change from last 4 data points
  const recent = history.slice(-4)
  const changes: number[] = []
  for (let i = 1; i < recent.length; i++) {
    changes.push(recent[i].score - recent[i - 1].score)
  }
  const avgChange = changes.reduce((sum, c) => sum + c, 0) / changes.length
  const trend: CutScoreProjection['trend'] =
    avgChange < -5 ? 'falling' : avgChange > 5 ? 'rising' : 'stable'

  const projectedMid = Math.round(currentScore + avgChange * quartersAhead)
  const variance = 20
  const projectedLow = Math.max(0, projectedMid - variance)
  const projectedHigh = projectedMid + variance

  return {
    mosCode,
    toRank,
    history,
    currentScore,
    projectedLow,
    projectedMid,
    projectedHigh,
    targetQuarter,
    trend,
    quarterlyChange: Math.round(avgChange),
  }
}
