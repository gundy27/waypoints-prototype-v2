import { promotionRules } from './mockData'
import type { PromotionEligibilityRule, UserProfile } from './mockData'

/** Deterministic reference date for the prototype */
export const CURRENT_DATE = new Date('2026-02-01')

export interface PromotionWindow {
  rule: PromotionEligibilityRule
  eligibilityDate: Date
  daysUntilEligible: number
  isEligible: boolean
  phase: 'preparation' | 'tracking'
  quarterLabel: string
}

export function getPromotionRule(rank: string): PromotionEligibilityRule | null {
  return promotionRules.find(r => r.fromRank === rank) ?? null
}

export function calculateEligibilityDate(dor: string, tigMonthsRequired: number): Date {
  const dorDate = new Date(dor)
  const eligibility = new Date(dorDate)
  eligibility.setMonth(eligibility.getMonth() + tigMonthsRequired)
  return eligibility
}

export function calculatePromotionWindow(profile: UserProfile): PromotionWindow | null {
  const rule = getPromotionRule(profile.rank)
  if (!rule) return null

  const eligibilityDate = calculateEligibilityDate(profile.dor, rule.tigMonthsRequired)
  const diffMs = eligibilityDate.getTime() - CURRENT_DATE.getTime()
  const daysUntilEligible = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const isEligible = daysUntilEligible <= 0

  return {
    rule,
    eligibilityDate,
    daysUntilEligible,
    isEligible,
    phase: isEligible ? 'tracking' : 'preparation',
    quarterLabel: formatQuarterLabel(isEligible ? CURRENT_DATE : eligibilityDate),
  }
}

function formatQuarterLabel(date: Date): string {
  const month = date.getMonth()
  const year = date.getFullYear()
  // Fiscal year: Q1=Oct-Dec, Q2=Jan-Mar, Q3=Apr-Jun, Q4=Jul-Sep
  const fyYear = month >= 9 ? year + 1 : year
  const quarter = month >= 9 ? 1 : month >= 6 ? 4 : month >= 3 ? 3 : 2
  return `Q${quarter} FY${String(fyYear).slice(2)}`
}

export function formatCountdown(days: number): string {
  if (days <= 0) return 'Open now'
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  const months = Math.floor(days / 30)
  const remainingDays = days % 30
  if (remainingDays === 0) return `${months} mo`
  return `${months} mo ${remainingDays} d`
}

export function formatShortDate(date: Date): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}
