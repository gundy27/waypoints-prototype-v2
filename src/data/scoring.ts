// ── Gap engine (per-branch, polymorphic) ─────────────────────────────
// The Objective tab renders the "gap" three ways depending on objective
// type. This module produces a normalized ScoreGap for promotion and
// fitness objectives. Marines promotion reuses the live JEPES composite
// (passed in from useAppState); other branches use structurally-correct
// mock tables — NOT validated against official charts (prototype only).

import { getBranch } from './branches'
import type { BranchId } from './branches'

export interface GapComponent {
  label: string
  value: number
  max: number
}

export interface ScoreGap {
  current: number
  target: number
  max: number
  gap: number // points still needed (0 if at/over target)
  surplus: number // points over target (0 if under)
  components: GapComponent[]
  unitLabel: string
}

/** Distribute a point bonus into component headroom (fills trailing buckets first). */
export function applyBonusToComponents(components: GapComponent[], bonus: number): GapComponent[] {
  if (bonus <= 0) return components
  let remaining = bonus
  const out = components.map(c => ({ ...c }))
  for (let i = out.length - 1; i >= 0 && remaining > 0; i--) {
    const headroom = out[i].max - out[i].value
    const add = Math.min(headroom, remaining)
    out[i].value += add
    remaining -= add
  }
  return out
}

export function buildScoreGap(
  current: number,
  target: number,
  max: number,
  components: GapComponent[],
  unitLabel: string,
): ScoreGap {
  return {
    current,
    target,
    max,
    gap: Math.max(0, target - current),
    surplus: Math.max(0, current - target),
    components,
    unitLabel,
  }
}

/** Max attainable fitness score for a branch's test. */
export function fitnessMaxForTest(test: string): number {
  switch (test) {
    case 'PFT':
    case 'CFT':
      return 300
    case 'ACFT':
      return 600
    case 'PRT':
    case 'PFA':
    case 'PT Test':
      return 100
    default:
      return 300
  }
}

/**
 * Structurally-correct mock promotion score per branch for users who
 * onboard as a non-Marine (or as a Marines fallback). Component values
 * sum to `current`; `target` is the mock cutoff for the next grade.
 */
export function mockBranchScore(branchId: BranchId): ScoreGap {
  const branch = getBranch(branchId)
  switch (branch.scoringSystem) {
    case 'promotion_points': {
      const components: GapComponent[] = [
        { label: 'Weapons', value: 100, max: 160 },
        { label: 'Fitness (ACFT)', value: 120, max: 160 },
        { label: 'Awards & Decorations', value: 80, max: 165 },
        { label: 'Military Education', value: 180, max: 255 },
        { label: 'Civilian Education', value: 40, max: 60 },
      ]
      const current = components.reduce((s, c) => s + c.value, 0) // 520
      return buildScoreGap(current, 580, branch.scoringMax, components, branch.scoringLabel)
    }
    case 'waps': {
      const components: GapComponent[] = [
        { label: 'EPR / Eval', value: 200, max: 250 },
        { label: 'Specialty Knowledge (SKT)', value: 60, max: 100 },
        { label: 'Promotion Fitness (PFE)', value: 55, max: 100 },
        { label: 'Time in Grade', value: 18, max: 60 },
        { label: 'Decorations', value: 7, max: 25 },
      ]
      const current = components.reduce((s, c) => s + c.value, 0) // 340
      return buildScoreGap(current, 365, branch.scoringMax, components, branch.scoringLabel)
    }
    case 'fms':
    case 'final_multiple': {
      const components: GapComponent[] = [
        { label: 'Exam Standard Score', value: 34, max: 50 },
        { label: 'Performance (PMA)', value: 18, max: 26 },
        { label: 'Awards', value: 6, max: 12 },
        { label: 'Service / PNA', value: 6, max: 12 },
      ]
      const current = components.reduce((s, c) => s + c.value, 0) // 64
      return buildScoreGap(current, 70, branch.scoringMax, components, branch.scoringLabel)
    }
    case 'cutting_score':
    default: {
      const components: GapComponent[] = [
        { label: 'Warfighting', value: 188, max: 250 },
        { label: 'Physical Toughness', value: 226, max: 250 },
        { label: 'Mental Agility', value: 120, max: 250 },
        { label: 'Command Input', value: 184, max: 250 },
        { label: 'Bonus', value: 0, max: 100 },
      ]
      const current = components.reduce((s, c) => s + c.value, 0) // 718
      return buildScoreGap(current, 780, branch.scoringMax, components, branch.scoringLabel)
    }
  }
}
