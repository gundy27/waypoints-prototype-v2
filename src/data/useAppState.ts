import { useState, useCallback } from 'react'
import { defaultProfile, scoreBreakdown, pftHistory } from './mockData'
import type { UserProfile, ScoreBreakdown } from './mockData'

export function calculatePftScore(pullUps: number, crunches: number, runMinutes: number, runSeconds: number): number {
  const pullUpScore = Math.min(pullUps * 5, 100)
  const crunchScore = Math.min(crunches, 100)
  const runTotalSeconds = runMinutes * 60 + runSeconds
  const runScore = Math.max(0, Math.min(100, Math.round(200 - (runTotalSeconds / 10.8))))
  return pullUpScore + crunchScore + runScore
}

export function getPftClass(score: number): string {
  if (score >= 235) return '1st Class'
  if (score >= 200) return '2nd Class'
  if (score >= 150) return '3rd Class'
  return 'Below Standards'
}

export function useAppState() {
  const [profile, setProfile] = useState<UserProfile>({ ...defaultProfile })
  const [breakdown, setBreakdown] = useState<ScoreBreakdown[]>([...scoreBreakdown])
  const [history, setHistory] = useState([...pftHistory])
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())

  const logPft = useCallback((pullUps: number, crunches: number, runMinutes: number, runSeconds: number) => {
    const newPftScore = calculatePftScore(pullUps, crunches, runMinutes, runSeconds)
    const pftClass = getPftClass(newPftScore)
    const oldPft = profile.pft
    const pftDiff = newPftScore - oldPft

    const oldPftCftValue = breakdown[0].value
    const newPftCftValue = Math.min(oldPftCftValue + pftDiff, 600)
    const newComposite = profile.compositeScore + (newPftCftValue - oldPftCftValue)

    const newPercentile = Math.min(99, Math.max(1, profile.percentile + Math.round(pftDiff / 5)))

    setProfile(prev => ({
      ...prev,
      pft: newPftScore,
      pftClass: pftClass,
      compositeScore: newComposite,
      percentile: newPercentile,
      scoreTrend: prev.scoreTrend + pftDiff,
    }))

    setBreakdown(prev => prev.map((item, i) =>
      i === 0 ? { ...item, value: newPftCftValue } : item
    ))

    const now = new Date()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    setHistory(prev => [
      ...prev,
      { month: `${monthNames[now.getMonth()]} ${String(now.getFullYear()).slice(2)}`, score: newPftScore },
    ])
  }, [profile, breakdown])

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  return { profile, breakdown, history, bookmarks, logPft, toggleBookmark }
}
