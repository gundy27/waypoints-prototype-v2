// ── Objective + Countdown primitives ─────────────────────────────────
// The nucleus of the 2.0 loop: one active objective at a time, each with
// a countdown and a gap rendered conditionally on the objective type.

import { CURRENT_DATE } from './promotionTimeline'
import { getBranch, getNextRank, isCompetitivePromotion } from './branches'
import type { BranchId } from './branches'

export type ObjectiveType =
  | 'promotion'
  | 'fitness'
  | 'finance'
  | 'pcs'
  | 'transition'
  | 'pme'
  | 'bodycomp'
  | 'eval'
  | 'board'
  | 'bootcamp'

export type ObjectiveSource = 'auto' | 'user_set' | 'template'
export type ObjectiveStatus = 'active' | 'completed' | 'abandoned'

/** How the Objective tab renders the "gap" section for this objective. */
export type GapKind = 'score' | 'fitness' | 'waypoints'

/** Onboarding intent that surfaces an objective. */
export type Intent = 'career' | 'fitness' | 'finance'

export type CountdownAnchor =
  | 'promotion_cycle'
  | 'next_test'
  | 'user_date'
  | 'event'

export interface ObjectiveTemplate {
  id: string
  type: ObjectiveType
  /** Onboarding intent this template belongs to (drives routing). */
  intent: Intent
  /** Display label; may contain {nextRank} / {test} tokens. */
  labelTemplate: string
  description: string
  gapKind: GapKind
  countdownAnchor: CountdownAnchor
  /** Shown in the objective switcher. */
  selectable: boolean
  /** Full-fidelity in the prototype vs. waypoint-completion only. */
  depth: 'full' | 'light'
}

export const OBJECTIVE_TEMPLATES: ObjectiveTemplate[] = [
  {
    id: 'tmpl-promotion',
    type: 'promotion',
    intent: 'career',
    labelTemplate: 'Make {nextRank}',
    description: 'Close the gap to the promotion cutoff for your job and rank.',
    gapKind: 'score',
    countdownAnchor: 'promotion_cycle',
    selectable: true,
    depth: 'full',
  },
  {
    id: 'tmpl-fitness',
    type: 'fitness',
    intent: 'fitness',
    labelTemplate: 'Improve {test} Score',
    description: 'Raise your fitness score toward max before your next test window.',
    gapKind: 'fitness',
    countdownAnchor: 'next_test',
    selectable: true,
    depth: 'full',
  },
  {
    id: 'tmpl-finance',
    type: 'finance',
    intent: 'finance',
    labelTemplate: 'Build Emergency Savings',
    description: 'Hit a savings milestone with steady TSP and allocation steps.',
    gapKind: 'waypoints',
    countdownAnchor: 'user_date',
    selectable: true,
    depth: 'light',
  },
  {
    id: 'tmpl-eval',
    type: 'eval',
    intent: 'career',
    labelTemplate: 'Submit a Strong {eval}',
    description: 'Prep accomplishments and inputs ahead of your evaluation window.',
    gapKind: 'waypoints',
    countdownAnchor: 'user_date',
    selectable: true,
    depth: 'light',
  },
  {
    id: 'tmpl-pme',
    type: 'pme',
    intent: 'career',
    labelTemplate: 'Complete Required PME',
    description: 'Clear the pre-reqs and finish your next professional military education course.',
    gapKind: 'waypoints',
    countdownAnchor: 'user_date',
    selectable: true,
    depth: 'light',
  },
  {
    id: 'tmpl-pcs',
    type: 'pcs',
    intent: 'career',
    labelTemplate: 'Plan My PCS',
    description: 'Stay ahead of housing, schools, and paperwork before your report date.',
    gapKind: 'waypoints',
    countdownAnchor: 'user_date',
    selectable: true,
    depth: 'light',
  },
  {
    id: 'tmpl-transition',
    type: 'transition',
    intent: 'career',
    labelTemplate: 'Plan My Transition',
    description: 'Line up TAP, resume, GI Bill, and networking before your EAS.',
    gapKind: 'waypoints',
    countdownAnchor: 'user_date',
    selectable: true,
    depth: 'light',
  },
  {
    id: 'tmpl-bodycomp',
    type: 'bodycomp',
    intent: 'fitness',
    labelTemplate: 'Hit Body Comp Standards',
    description: 'Daily targets and a logging cadence toward your next weigh-in.',
    gapKind: 'waypoints',
    countdownAnchor: 'user_date',
    selectable: true,
    depth: 'light',
  },
  {
    id: 'tmpl-bootcamp',
    type: 'bootcamp',
    intent: 'career',
    labelTemplate: 'Prepare for Boot Camp',
    description: 'Get ship-ready before your date.',
    gapKind: 'waypoints',
    countdownAnchor: 'user_date',
    selectable: false,
    depth: 'light',
  },
]

export interface Objective {
  id: string
  type: ObjectiveType
  templateId: string
  label: string
  targetEvent?: string
  targetDate?: string // ISO yyyy-mm-dd
  source: ObjectiveSource
  status: ObjectiveStatus
  gapKind: GapKind
  countdownAnchor: CountdownAnchor
  createdAt: string
  completedAt?: string
}

export interface Countdown {
  label: string
  targetDate: Date
  daysRemaining: number
  /** Total span (createdAt → target) for ring progress; null if unknown. */
  totalDays: number | null
  /** Days elapsed of totalDays. */
  elapsedDays: number | null
  phase?: string
}

export function getTemplate(id: string): ObjectiveTemplate | null {
  return OBJECTIVE_TEMPLATES.find(t => t.id === id) ?? null
}

export function templatesForIntent(intent: Intent): ObjectiveTemplate[] {
  return OBJECTIVE_TEMPLATES.filter(t => t.intent === intent)
}

export function objectiveLabelFor(template: ObjectiveTemplate, branchId: BranchId, payGrade: string): string {
  const branch = getBranch(branchId)
  const next = getNextRank(branchId, payGrade)
  return resolveLabel(template.labelTemplate, { nextRank: next?.name, test: branch.fitnessTest, evalName: branch.evalName })
}

function resolveLabel(
  labelTemplate: string,
  ctx: { nextRank?: string; test?: string; evalName?: string },
): string {
  return labelTemplate
    .replace('{nextRank}', ctx.nextRank ?? 'Next Rank')
    .replace('{test}', ctx.test ?? 'Fitness')
    .replace('{eval}', ctx.evalName ?? 'Eval')
}

/**
 * Instantiate an Objective from a template for a given user context.
 * targetDateOverride lets onboarding pass a user-set date (PCS report, EAS, etc.).
 */
export function buildObjective(
  templateId: string,
  branchId: BranchId,
  payGrade: string,
  opts: { source?: ObjectiveSource; targetDate?: string } = {},
): Objective {
  const template = getTemplate(templateId) ?? OBJECTIVE_TEMPLATES[0]
  const branch = getBranch(branchId)
  const next = getNextRank(branchId, payGrade)

  const label = resolveLabel(template.labelTemplate, {
    nextRank: next?.name,
    test: branch.fitnessTest,
    evalName: branch.evalName,
  })

  // Promotion gap only applies on competitive grades; otherwise fall back
  // to a waypoint-completion objective.
  const gapKind: GapKind =
    template.type === 'promotion' && !isCompetitivePromotion(branchId, payGrade)
      ? 'waypoints'
      : template.gapKind

  return {
    id: `obj-${Date.now()}`,
    type: template.type,
    templateId: template.id,
    label,
    targetDate: opts.targetDate,
    source: opts.source ?? 'auto',
    status: 'active',
    gapKind,
    countdownAnchor: template.countdownAnchor,
    createdAt: CURRENT_DATE.toISOString().slice(0, 10),
  }
}

/** The default objective for a user's primary intent. */
export function defaultObjectiveForIntent(
  intent: Intent,
  branchId: BranchId,
  payGrade: string,
  targetDate?: string,
): Objective {
  const template = templatesForIntent(intent)[0] ?? OBJECTIVE_TEMPLATES[0]
  return buildObjective(template.id, branchId, payGrade, { targetDate })
}

// ── Countdown derivation ─────────────────────────────────────────────

const DAY_MS = 1000 * 60 * 60 * 24

export function makeCountdown(
  label: string,
  targetDate: Date,
  createdAt: string,
  phase?: string,
): Countdown {
  const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - CURRENT_DATE.getTime()) / DAY_MS))
  const start = new Date(createdAt)
  const totalSpan = targetDate.getTime() - start.getTime()
  const totalDays = totalSpan > 0 ? Math.ceil(totalSpan / DAY_MS) : null
  const elapsedDays = totalDays != null ? Math.max(0, totalDays - daysRemaining) : null
  return { label, targetDate, daysRemaining, totalDays, elapsedDays, phase }
}

/** Deterministic next-test window end, anchored to CURRENT_DATE. */
export function nextFitnessTestDate(test: string): Date {
  const year = CURRENT_DATE.getFullYear()
  const month = CURRENT_DATE.getMonth() // 0-indexed
  if (test === 'PFT') {
    // PFT window Jan–Jun
    return month <= 5 ? new Date(year, 5, 30) : new Date(year + 1, 5, 30)
  }
  if (test === 'CFT') {
    // CFT window Jul–Dec
    return month >= 6 ? new Date(year, 11, 31) : new Date(year, 11, 31)
  }
  // ACFT / PRT / PT Test / PFA — generic ~120-day cadence
  return new Date(CURRENT_DATE.getTime() + 120 * DAY_MS)
}
