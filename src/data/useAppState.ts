import { useState, useCallback, useMemo } from 'react'
import { defaultProfile, scoreBreakdown, pftHistory, compositeHistory, opportunities } from './mockData'
import type { UserProfile, ScoreBreakdown } from './mockData'
import { calculatePromotionWindow, CURRENT_DATE } from './promotionTimeline'
import type { PromotionWindow } from './promotionTimeline'
import { projectCutScore } from './cutScoreProjection'
import type { CutScoreProjection } from './cutScoreProjection'
import { rankOpportunities } from './opportunityEngine'
import type { RankedOpportunity } from './opportunityEngine'
import { getBranch, getRank, formatRank } from './branches'
import type { BranchId } from './branches'
import {
  defaultObjectiveForIntent, buildObjective, makeCountdown, nextFitnessTestDate,
} from './objectives'
import type { Objective, Countdown, Intent } from './objectives'
import { recommendWaypoints, completeWaypoint, waypointProgress } from './waypoints'
import type { Waypoint } from './waypoints'
import { buildLogEntry, getLogType } from './logs'
import type { LogEntry, LogTypeId } from './logs'
import { buildScoreGap, mockBranchScore, fitnessMaxForTest, applyBonusToComponents } from './scoring'
import type { ScoreGap } from './scoring'
import { martinezServiceHistory, computeJourneyStats } from './serviceHistory'

const DAY_MS = 1000 * 60 * 60 * 24

// Stable seed so the seeded objective id and its waypoints' ids agree.
const SEED_GRADE = defaultProfile.rank.split(' ')[0]
const SEED_OBJECTIVE = defaultObjectiveForIntent('career', 'marines', SEED_GRADE)
const SEED_WAYPOINTS = recommendWaypoints(SEED_OBJECTIVE, 'marines', SEED_GRADE)

// Seeded activity history (newest-first) — populates My Journey + recent activity.
const SEED_LOGS: LogEntry[] = [
  buildLogEntry('fitness', { test: 'PFT', score: 285, date: '2026-01-15' }, 'seed'),
  buildLogEntry('pme', { name: 'Leading Marines (MCI)', date: '2025-12-02' }, 'seed'),
  buildLogEntry('journal', { note: 'Picked up team lead for the fire team', date: '2025-11-01' }, 'seed'),
  buildLogEntry('bodycomp', { weight: 178, date: '2025-09-01' }, 'seed'),
  buildLogEntry('fitness', { test: 'CFT', score: 290, date: '2025-08-12' }, 'seed'),
  buildLogEntry('weapons', { weapon: 'Rifle', level: 'Expert', date: '2025-03-10' }, 'seed'),
  buildLogEntry('pme', { name: 'MCMAP Gray Belt Course', date: '2025-02-15' }, 'seed'),
  buildLogEntry('award', { name: 'Sea Service Deployment Ribbon', date: '2024-09-20' }, 'seed'),
  buildLogEntry('fitness', { test: 'PFT', score: 268, date: '2024-05-20' }, 'seed'),
  buildLogEntry('eval', { kind: 'EVAL', period: 'Semi-annual FY24', date: '2024-01-10' }, 'seed'),
  buildLogEntry('award', { name: 'Certificate of Commendation', date: '2023-10-05' }, 'seed'),
  buildLogEntry('pme', { name: 'Annual MarineNet MCIs (x3)', date: '2023-06-15' }, 'seed'),
]

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

function applyMentalAgilityBonus(components: ScoreComponents, bonus: number): ScoreComponents {
  if (bonus <= 0) return components
  return {
    ...components,
    mentalAgility: Math.min(250, components.mentalAgility + bonus),
  }
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

export interface OnboardingV2Data {
  firstName: string
  lastName: string
  branchId: BranchId
  payGrade: string
  intent: Intent
  job?: string
  lastScore?: number
  targetDate?: string
  dor?: string
  isPreBootcamp?: boolean
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
  const [corporalsWaypointCompleted, setCorporalsWaypointCompleted] = useState(false)
  const [mentalAgilityWaypointBonus, setMentalAgilityWaypointBonus] = useState(0)
  const [notificationPromptShown, setNotificationPromptShown] = useState(
    () => sessionStorage.getItem(NOTIFICATION_PROMPT_KEY) === 'true'
  )

  // ── 2.0 primitives: branch, objective, waypoints, logs ─────────────
  const [branchId, setBranchId] = useState<BranchId>('marines')
  const [objective, setObjectiveState] = useState<Objective>(SEED_OBJECTIVE)
  const [waypoints, setWaypoints] = useState<Waypoint[]>(SEED_WAYPOINTS)
  const [logs, setLogs] = useState<LogEntry[]>(() => [...SEED_LOGS])
  // Objectives the user switched away from this session (counts toward "switched").
  const [liveSwitchedObjectives, setLiveSwitchedObjectives] = useState(0)

  const logPft = useCallback((pullUps: number, crunches: number, runMinutes: number, runSeconds: number) => {
    const newPftScore = calculatePftScore(pullUps, crunches, runMinutes, runSeconds)
    const pftClass = getPftClass(newPftScore)

    setProfile(prev => {
      const commandInputAvg = prev.commandInputAvg
      const base = calcScoreComponents(
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
      const components = applyMentalAgilityBonus(base, mentalAgilityWaypointBonus)
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
  }, [mentalAgilityWaypointBonus])

  const submitOnboarding = useCallback((data: OnboardingData) => {
    sessionStorage.removeItem(NOTIFICATION_PROMPT_KEY)
    setNotificationPromptShown(false)

    const commandInputAvg = (data.commandInputMosMission + data.commandInputLeadership + data.commandInputCharacter) / 3
    const inGradeCourses = Math.min(data.offDutyEducationCourses, 4)

    const base = calcScoreComponents(
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
    const components = applyMentalAgilityBonus(base, mentalAgilityWaypointBonus)
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
  }, [mentalAgilityWaypointBonus])

  const markNotificationShown = useCallback(() => {
    sessionStorage.setItem(NOTIFICATION_PROMPT_KEY, 'true')
    setNotificationPromptShown(true)
  }, [])

  const completeCorporalsWaypoint = useCallback(() => {
    if (corporalsWaypointCompleted) return
    const bonus = 50
    setCorporalsWaypointCompleted(true)
    setMentalAgilityWaypointBonus(bonus)

    setProfile(prev => {
      const base = calcScoreComponents(
        prev.pft,
        prev.cft,
        prev.rifle,
        prev.mcmapBelt,
        prev.commandInputAvg,
        prev.mosQualPoints,
        prev.mciCourses,
        prev.degree,
        prev.inGradeCourses,
        prev.inServicePoints,
        prev.sdaAssignment,
        prev.crbReferrals,
      )
      const components = applyMentalAgilityBonus(base, bonus)
      const newComposite = calcComposite(components)

      setBreakdown([
        { label: 'Warfighting', value: components.warfighting, max: 250 },
        { label: 'Physical Toughness', value: components.physicalToughness, max: 250 },
        { label: 'Mental Agility', value: components.mentalAgility, max: 250 },
        { label: 'Command Input', value: components.commandInput, max: 250 },
        { label: 'Bonus', value: components.bonus, max: 100 },
      ])

      const now = new Date()
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthLabel = `${monthNames[now.getMonth()]} ${String(now.getFullYear()).slice(2)}`
      setCompositeHist(h => [...h, { month: monthLabel, score: newComposite }])

      return {
        ...prev,
        compositeScore: newComposite,
        scoreTrend: newComposite - prev.compositeScore,
      }
    })
  }, [corporalsWaypointCompleted])

  const resetToMockData = useCallback(() => {
    sessionStorage.removeItem(NOTIFICATION_PROMPT_KEY)
    setNotificationPromptShown(false)
    setProfile({ ...defaultProfile })
    setBreakdown([...scoreBreakdown])
    setHistory([...pftHistory])
    setCompositeHist([...compositeHistory])
    setBookmarks(new Set())
    setCorporalsWaypointCompleted(false)
    setMentalAgilityWaypointBonus(0)
    setBranchId('marines')
    setObjectiveState(SEED_OBJECTIVE)
    setWaypoints(SEED_WAYPOINTS)
    setLogs([...SEED_LOGS])
    setLiveSwitchedObjectives(0)
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

  const setObjective = useCallback((templateId: string, targetDate?: string) => {
    const grade = profile.rank.split(' ')[0]
    const obj = buildObjective(templateId, branchId, grade, { source: 'user_set', targetDate })
    setObjectiveState(prev => {
      // Switching to a different objective retires the prior one as "switched".
      if (prev.templateId !== obj.templateId) setLiveSwitchedObjectives(n => n + 1)
      return obj
    })
    setWaypoints(recommendWaypoints(obj, branchId, grade))
  }, [branchId, profile.rank])

  const completeWaypointById = useCallback((id: string) => {
    setWaypoints(prev => completeWaypoint(prev, id))
  }, [])

  const completeOnboarding = useCallback((data: OnboardingV2Data) => {
    sessionStorage.removeItem(NOTIFICATION_PROMPT_KEY)
    setNotificationPromptShown(false)
    setBranchId(data.branchId)
    const rank = getRank(data.branchId, data.payGrade)
    const obj = data.isPreBootcamp
      ? buildObjective('tmpl-bootcamp', data.branchId, data.payGrade, { source: 'auto', targetDate: data.targetDate })
      : defaultObjectiveForIntent(data.intent, data.branchId, data.payGrade, data.targetDate)
    setObjectiveState(obj)
    setWaypoints(recommendWaypoints(obj, data.branchId, data.payGrade))
    setLogs([])
    setProfile(prev => ({
      ...prev,
      name: rank ? `${rank.abbr} ${data.lastName}` : data.lastName,
      firstName: data.firstName,
      lastName: data.lastName,
      rank: rank ? formatRank(rank) : data.payGrade,
      mos: data.job || prev.mos,
      pft: data.lastScore ?? prev.pft,
      dor: data.dor ?? prev.dor,
      ...(data.dor ? calcPromotionWindow(data.dor) : {}),
    }))
  }, [])

  const submitLog = useCallback(
    (typeId: LogTypeId, data: Record<string, string | number>) => {
      setLogs(prev => [buildLogEntry(typeId, data, 'log_overlay'), ...prev])

      // Fitness logs move the gap: update the score and (for Marines) recompute the composite.
      if (typeId === 'fitness') {
        const score = Number(data.score) || 0
        const isCft = String(data.test ?? '') === 'CFT'
        if (score > 0) {
          setProfile(prev => {
            const pft = isCft ? prev.pft : score
            const cft = isCft ? score : prev.cft
            const next = {
              ...prev,
              pft, cft,
              pftClass: getPftClass(pft),
              cftClass: getCftClass(cft),
            }
            if (branchId !== 'marines') return next
            const comps = calcScoreComponents(
              pft, cft, prev.rifle, prev.mcmapBelt, prev.commandInputAvg,
              prev.mosQualPoints, prev.mciCourses, prev.degree,
              prev.inGradeCourses, prev.inServicePoints, prev.sdaAssignment, prev.crbReferrals,
            )
            const composite = calcComposite(comps)
            setBreakdown([
              { label: 'Warfighting', value: comps.warfighting, max: 250 },
              { label: 'Physical Toughness', value: comps.physicalToughness, max: 250 },
              { label: 'Mental Agility', value: comps.mentalAgility, max: 250 },
              { label: 'Command Input', value: comps.commandInput, max: 250 },
              { label: 'Bonus', value: comps.bonus, max: 100 },
            ])
            return { ...next, compositeScore: composite, scoreTrend: composite - prev.compositeScore }
          })
        }
      }

      // Auto-complete the first open log-triggered waypoint matching this log type.
      const def = getLogType(typeId)
      if (def) {
        setWaypoints(prev => {
          const target = prev.find(w => w.status === 'open' && w.completionLogic === 'log' && w.icon === def.icon)
          return target ? completeWaypoint(prev, target.id) : prev
        })
      }
    },
    [branchId],
  )

  // ── Derived computed values ──────────────────────────────────────────

  const branch = getBranch(branchId)

  const promotionWindow: PromotionWindow | null = useMemo(
    () => calculatePromotionWindow(profile),
    [profile],
  )

  const cutScoreProjection: CutScoreProjection | null = useMemo(() => {
    if (!promotionWindow) return null
    const mosCode = profile.mos.split(' ')[0]
    const toRank = promotionWindow.rule.toRankShort
    return projectCutScore(mosCode, toRank, promotionWindow.quarterLabel, 1, profile.cuttingScore)
  }, [profile.mos, profile.cuttingScore, promotionWindow])

  const scoreComponents = useMemo(
    () => applyMentalAgilityBonus(
      calcScoreComponents(
        profile.pft, profile.cft, profile.rifle, profile.mcmapBelt,
        profile.commandInputAvg, profile.mosQualPoints, profile.mciCourses,
        profile.degree, profile.inGradeCourses, profile.inServicePoints,
        profile.sdaAssignment, profile.crbReferrals,
      ),
      mentalAgilityWaypointBonus,
    ),
    [profile, mentalAgilityWaypointBonus],
  )

  const rankedOpportunities: RankedOpportunity[] = useMemo(
    () => rankOpportunities(opportunities, scoreComponents, promotionWindow),
    [scoreComponents, promotionWindow],
  )

  const currentSeason: 'pft' | 'cft' = useMemo(() => {
    const month = CURRENT_DATE.getMonth()
    return month >= 0 && month <= 5 ? 'pft' : 'cft'
  }, [])

  const completedWaypointBonus = useMemo(
    () => waypoints.filter(w => w.status === 'completed').reduce((s, w) => s + (w.pointValue ?? 0), 0),
    [waypoints],
  )

  const currentGap: ScoreGap | null = useMemo(() => {
    if (objective.gapKind === 'waypoints') return null
    if (objective.gapKind === 'fitness') {
      const max = fitnessMaxForTest(branch.fitnessTest)
      return buildScoreGap(
        profile.pft, max, max,
        [{ label: branch.fitnessTest, value: profile.pft, max }],
        branch.fitnessTest,
      )
    }
    const base = branchId === 'marines'
      ? buildScoreGap(
          profile.compositeScore, profile.cuttingScore, branch.scoringMax,
          breakdown.map(b => ({ label: b.label, value: b.value, max: b.max })),
          branch.scoringLabel,
        )
      : mockBranchScore(branchId)
    if (completedWaypointBonus <= 0) return base
    const components = applyBonusToComponents(base.components, completedWaypointBonus)
    const current = components.reduce((s, c) => s + c.value, 0)
    return buildScoreGap(current, base.target, base.max, components, base.unitLabel)
  }, [objective.gapKind, branchId, branch, profile, breakdown, completedWaypointBonus])

  const objectiveCountdown: Countdown | null = useMemo(() => {
    if (objective.countdownAnchor === 'promotion_cycle') {
      if (promotionWindow) {
        return makeCountdown(
          `${promotionWindow.quarterLabel} cycle`,
          promotionWindow.eligibilityDate,
          objective.createdAt,
          promotionWindow.isEligible ? 'In window' : 'Preparation',
        )
      }
      return makeCountdown('Next promotion cycle', new Date(CURRENT_DATE.getTime() + 120 * DAY_MS), objective.createdAt)
    }
    if (objective.countdownAnchor === 'next_test') {
      return makeCountdown(`${branch.fitnessTest} window`, nextFitnessTestDate(branch.fitnessTest), objective.createdAt)
    }
    if (objective.targetDate) {
      return makeCountdown(objective.targetEvent ?? 'Target date', new Date(objective.targetDate), objective.createdAt)
    }
    return makeCountdown('Target date', new Date(CURRENT_DATE.getTime() + 90 * DAY_MS), objective.createdAt)
  }, [objective, promotionWindow, branch])

  const recentActivity = useMemo(() => logs.slice(0, 3), [logs])
  const wpProgress = useMemo(() => waypointProgress(waypoints), [waypoints])

  const journeyStats = useMemo(
    () => computeJourneyStats(martinezServiceHistory, logs, wpProgress.completed, liveSwitchedObjectives, objective),
    [logs, wpProgress.completed, liveSwitchedObjectives, objective],
  )

  return {
    profile, breakdown, history, compositeHist, bookmarks, notificationPromptShown,
    corporalsWaypointCompleted,
    promotionWindow, cutScoreProjection, rankedOpportunities, currentSeason,
    logPft, submitOnboarding, resetToMockData, toggleBookmark, markNotificationShown,
    completeCorporalsWaypoint,
    // 2.0 primitives
    branchId, branch, objective, waypoints, logs,
    currentGap, objectiveCountdown, recentActivity, wpProgress, completedWaypointBonus,
    setObjective, completeWaypointById, submitLog, completeOnboarding,
    // My Journey
    serviceHistory: martinezServiceHistory, journeyStats,
  }
}
