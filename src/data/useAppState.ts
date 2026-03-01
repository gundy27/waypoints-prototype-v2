import { useState, useCallback } from 'react'
import { defaultProfile, scoreBreakdown, pftHistory, compositeHistory } from './mockData'
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

function getCftClass(score: number): string {
  if (score >= 235) return '1st Class'
  if (score >= 200) return '2nd Class'
  if (score >= 150) return '3rd Class'
  return 'Below Standards'
}

function calcComposite(pft: number, cft: number, rifle: number, proMark: number, conMark: number): number {
  const pftCft = Math.min(pft + cft, 600)
  const rifleScore = Math.min(rifle, 350)
  const pme = 100
  const tis = 221
  const proCon = Math.round((proMark + conMark) / 2 * 50)
  return pftCft + rifleScore + pme + tis + proCon
}

export interface OnboardingData {
  firstName: string
  lastName: string
  mosCode: string
  rank: string
  dor: string
  adbd: string
  avgProMark: number
  avgConMark: number
  pftScore: number
  cftScore: number
  rifleScore: number
  rifleBadge: string
}

const RANK_DISPLAY: Record<string, string> = {
  PVT: 'E-1 (Private)',
  PFC: 'E-2 (Private First Class)',
  LCpl: 'E-3 (Lance Corporal)',
  Cpl: 'E-4 (Corporal)',
  Sgt: 'E-5 (Sergeant)',
}

const NOTIFICATION_PROMPT_KEY = 'wp_notification_prompt_shown'

export function useAppState() {
  const [profile, setProfile] = useState<UserProfile>({ ...defaultProfile })
  const [breakdown, setBreakdown] = useState<ScoreBreakdown[]>([...scoreBreakdown])
  const [history, setHistory] = useState([...pftHistory])
  const [compositeHist, setCompositeHist] = useState([...compositeHistory])
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [notificationPromptShown, setNotificationPromptShown] = useState(
    () => sessionStorage.getItem(NOTIFICATION_PROMPT_KEY) === 'true'
  )

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
    const monthLabel = `${monthNames[now.getMonth()]} ${String(now.getFullYear()).slice(2)}`
    setHistory(prev => [
      ...prev,
      { month: monthLabel, score: newPftScore },
    ])
    setCompositeHist(prev => [
      ...prev,
      { month: monthLabel, score: newComposite },
    ])
  }, [profile, breakdown])

  const submitOnboarding = useCallback((data: OnboardingData) => {
    sessionStorage.removeItem(NOTIFICATION_PROMPT_KEY)
    setNotificationPromptShown(false)

    const composite = calcComposite(data.pftScore, data.cftScore, data.rifleScore, data.avgProMark, data.avgConMark)
    const pftCft = Math.min(data.pftScore + data.cftScore, 600)
    const proConAvg = (data.avgProMark + data.avgConMark) / 2
    const proCon = Math.round(proConAvg * 50)

    setProfile({
      name: `${data.rank} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      mos: `${data.mosCode} - Rifleman`,
      rank: RANK_DISPLAY[data.rank] ?? data.rank,
      tis: '2 years 4 months',
      tig: '1 year 1 month',
      dor: data.dor,
      adbd: data.adbd,
      compositeScore: composite,
      cuttingScore: 1510,
      pft: data.pftScore,
      pftClass: getPftClass(data.pftScore),
      cft: data.cftScore,
      cftClass: getCftClass(data.cftScore),
      rifle: data.rifleScore,
      rifleClass: data.rifleBadge,
      pmeCompleted: true,
      proCon: `${data.avgProMark.toFixed(1)} / ${data.avgConMark.toFixed(1)}`,
      avgProMark: data.avgProMark,
      avgConMark: data.avgConMark,
      percentile: Math.min(99, Math.max(1, Math.round((composite / 1800) * 100))),
      scoreTrend: 0,
    })

    setBreakdown([
      { label: 'PFT/CFT', value: pftCft, max: 600 },
      { label: 'Rifle Qualification', value: Math.min(data.rifleScore, 350), max: 350 },
      { label: 'PME', value: 100, max: 150 },
      { label: 'Time in Service', value: 221, max: 400 },
      { label: 'Pro/Con Marks', value: proCon, max: 250 },
    ])

    setHistory([{ month: 'Current', score: data.pftScore }])
    setCompositeHist([{ month: 'Current', score: composite }])
  }, [])

  const markNotificationShown = useCallback(() => {
    sessionStorage.setItem(NOTIFICATION_PROMPT_KEY, 'true')
    setNotificationPromptShown(true)
  }, [])

  const resetToMockData = useCallback(() => {
    sessionStorage.removeItem(NOTIFICATION_PROMPT_KEY)
    setNotificationPromptShown(false)
    setProfile({ ...defaultProfile })
    setBreakdown([...scoreBreakdown])
    setHistory([...pftHistory])
    setCompositeHist([...compositeHistory])
    setBookmarks(new Set())
  }, [])

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

  return { profile, breakdown, history, compositeHist, bookmarks, notificationPromptShown, logPft, submitOnboarding, resetToMockData, toggleBookmark, markNotificationShown }
}
