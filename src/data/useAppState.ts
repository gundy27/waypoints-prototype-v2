import { useState, useCallback } from 'react'
import { defaultProfile, scoreBreakdown, pftHistory, compositeHistory } from './mockData'
import type { UserProfile, ScoreBreakdown } from './mockData'

export function getPromotionWindowLabel(windowStart: string, windowEnd: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(windowStart)
  const end = new Date(windowEnd)

  if (today >= start && today <= end) {
    return 'In Window'
  }

  const target = today < start ? start : (() => {
    const next = new Date(start)
    while (next <= today) {
      next.setMonth(next.getMonth() + 6)
    }
    return next
  })()

  const diffMs = target.getTime() - today.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return `T-${days} days`
}

export function calcPromotionWindow(dor: string): { promotionWindowStart: string; promotionWindowEnd: string } {
  const dorDate = new Date(dor)
  const windowStart = new Date(dorDate)
  windowStart.setFullYear(windowStart.getFullYear() + 1)
  const windowEnd = new Date(windowStart)
  windowEnd.setDate(windowEnd.getDate() + 29)
  return {
    promotionWindowStart: windowStart.toISOString().slice(0, 10),
    promotionWindowEnd: windowEnd.toISOString().slice(0, 10),
  }
}

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

function getMcmapPoints(belt: string): number {
  const map: Record<string, number> = {
    MMA: 0,
    MMB: 30,
    MMC: 60,
    MMD: 105,
    MME: 120,
    MMF: 135,
    'MMG+': 150,
  }
  return map[belt] ?? 0
}

function getRiflePoints(rifleScore: number): number {
  if (rifleScore >= 305) return 100
  if (rifleScore >= 280) return 75
  if (rifleScore >= 250) return 50
  if (rifleScore >= 190) return 25
  return 0
}

function getFitnessPoints(score: number): number {
  return Math.round((score / 300) * 125)
}

function getMciPoints(courses: number): number {
  const capped = Math.min(courses, 40)
  return Math.round(capped * 1.25)
}

function getDegreePoints(degree: string): number {
  if (degree === 'Bachelors') return 20
  if (degree === 'Associates') return 10
  return 0
}

function getOffDutyPoints(inGradeCourses: number, inServicePoints: number): number {
  const inGrade = Math.min(inGradeCourses, 4) * 5
  return Math.min(inGrade + inServicePoints, 40)
}

function getCommandInputPoints(avg: number): number {
  return Math.round((avg / 5.0) * 250)
}

function getSdaPoints(sdaAssignment: string): number {
  if (!sdaAssignment || sdaAssignment === 'None') return 0
  return 50
}

function getCrbPoints(referrals: number): number {
  return Math.min(referrals, 5) * 20
}

export interface ScoreComponents {
  warfighting: number
  physicalToughness: number
  mentalAgility: number
  commandInput: number
  bonus: number
}

export function calcScoreComponents(
  pft: number,
  cft: number,
  rifleScore: number,
  mcmapBelt: string,
  commandInputAvg: number,
  mosQualPoints: number,
  mciCourses: number,
  degree: string,
  inGradeCourses: number,
  inServicePoints: number,
  sdaAssignment: string,
  crbReferrals: number,
): ScoreComponents {
  const mcmapPts = getMcmapPoints(mcmapBelt)
  const riflePts = getRiflePoints(rifleScore)
  const warfighting = Math.min(mcmapPts + riflePts, 250)

  const pftPts = getFitnessPoints(pft)
  const cftPts = getFitnessPoints(cft)
  const physicalToughness = Math.min(pftPts + cftPts, 250)

  const mosQual = Math.min(mosQualPoints, 100)
  const mciPts = getMciPoints(mciCourses)
  const degreePts = getDegreePoints(degree)
  const offDutyPts = getOffDutyPoints(inGradeCourses, inServicePoints)
  const mentalAgility = Math.min(mosQual + mciPts + degreePts + offDutyPts, 250)

  const commandInput = Math.min(getCommandInputPoints(commandInputAvg), 250)

  const sdaPts = getSdaPoints(sdaAssignment)
  const crbPts = getCrbPoints(crbReferrals)
  const bonus = Math.min(sdaPts + crbPts, 100)

  return { warfighting, physicalToughness, mentalAgility, commandInput, bonus }
}

function calcComposite(components: ScoreComponents): number {
  return components.warfighting + components.physicalToughness + components.mentalAgility + components.commandInput + components.bonus
}

export interface OnboardingData {
  firstName: string
  lastName: string
  mosCode: string
  rank: string
  dor: string
  destroysAchieved: number
  mcmapBelt: string
  marineNetCourses: number
  degree: string
  offDutyEducationCourses: number
  mosCqs: string[]
  mosQualPoints: number
  commandInputMosMission: number
  commandInputLeadership: number
  commandInputCharacter: number
  pftScore: number
  cftScore: number
  rifleScore: number
  rifleBadge: string
  sdaAssignment: string
  crbReferrals: number
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

    setProfile(prev => {
      const commandInputAvg = prev.commandInputAvg
      const components = calcScoreComponents(
        newPftScore,
        prev.cft,
        prev.rifle,
        prev.mcmapBelt,
        commandInputAvg,
        prev.mosQualPoints,
        prev.mciCourses,
        prev.degree,
        prev.inGradeCourses,
        prev.inServicePoints,
        prev.sdaAssignment,
        prev.crbReferrals,
      )
      const newComposite = calcComposite(components)

      const now = new Date()
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthLabel = `${monthNames[now.getMonth()]} ${String(now.getFullYear()).slice(2)}`

      setBreakdown([
        { label: 'Warfighting', value: components.warfighting, max: 250 },
        { label: 'Physical Toughness', value: components.physicalToughness, max: 250 },
        { label: 'Mental Agility', value: components.mentalAgility, max: 250 },
        { label: 'Command Input', value: components.commandInput, max: 250 },
        { label: 'Bonus', value: components.bonus, max: 100 },
      ])

      setHistory(h => [...h, { month: monthLabel, score: newPftScore }])
      setCompositeHist(h => [...h, { month: monthLabel, score: newComposite }])

      return {
        ...prev,
        pft: newPftScore,
        pftClass,
        compositeScore: newComposite,
        scoreTrend: newComposite - prev.compositeScore,
      }
    })
  }, [])

  const submitOnboarding = useCallback((data: OnboardingData) => {
    sessionStorage.removeItem(NOTIFICATION_PROMPT_KEY)
    setNotificationPromptShown(false)

    const commandInputAvg = (data.commandInputMosMission + data.commandInputLeadership + data.commandInputCharacter) / 3
    const inGradeCourses = Math.min(data.offDutyEducationCourses, 4)

    const components = calcScoreComponents(
      data.pftScore,
      data.cftScore,
      data.rifleScore,
      data.mcmapBelt,
      commandInputAvg,
      data.mosQualPoints,
      data.marineNetCourses,
      data.degree,
      inGradeCourses,
      0,
      data.sdaAssignment,
      data.crbReferrals,
    )
    const composite = calcComposite(components)

    setProfile({
      name: `${data.rank} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      mos: `${data.mosCode} - Rifleman`,
      rank: RANK_DISPLAY[data.rank] ?? data.rank,
      tis: '2 years 4 months',
      tig: '1 year 1 month',
      dor: data.dor,
      compositeScore: composite,
      cuttingScore: 780,
      pft: data.pftScore,
      pftClass: getPftClass(data.pftScore),
      cft: data.cftScore,
      cftClass: getCftClass(data.cftScore),
      rifle: data.rifleScore,
      rifleClass: data.rifleBadge,
      mcmapBelt: data.mcmapBelt,
      pmeCompleted: true,
      commandInputMosMission: data.commandInputMosMission,
      commandInputLeadership: data.commandInputLeadership,
      commandInputCharacter: data.commandInputCharacter,
      commandInputAvg,
      mosQualPoints: data.mosQualPoints,
      mciCourses: data.marineNetCourses,
      degree: data.degree,
      inGradeCourses,
      inServicePoints: 0,
      sdaAssignment: data.sdaAssignment,
      crbReferrals: data.crbReferrals,
      ...calcPromotionWindow(data.dor),
      scoreTrend: 0,
    })

    setBreakdown([
      { label: 'Warfighting', value: components.warfighting, max: 250 },
      { label: 'Physical Toughness', value: components.physicalToughness, max: 250 },
      { label: 'Mental Agility', value: components.mentalAgility, max: 250 },
      { label: 'Command Input', value: components.commandInput, max: 250 },
      { label: 'Bonus', value: components.bonus, max: 100 },
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
