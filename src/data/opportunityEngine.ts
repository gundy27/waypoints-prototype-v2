import type { Opportunity, ScoreCategory } from './mockData'
import type { ScoreComponents } from './useAppState'
import type { PromotionWindow } from './promotionTimeline'
import { CURRENT_DATE } from './promotionTimeline'

export interface RankedOpportunity {
  opportunity: Opportunity
  relevanceScore: number
  gapCategory: ScoreCategory
  gapAmount: number
  isAvailableNow: boolean
  urgencyLabel?: string
}

const CATEGORY_MAX: Record<ScoreCategory, number> = {
  warfighting: 250,
  physicalToughness: 250,
  mentalAgility: 250,
  commandInput: 250,
  bonus: 100,
}

export function rankOpportunities(
  opportunities: Opportunity[],
  components: ScoreComponents,
  promotionWindow: PromotionWindow | null,
): RankedOpportunity[] {
  const month = CURRENT_DATE.getMonth()
  const isPftSeason = month >= 0 && month <= 5

  const gaps: Record<ScoreCategory, number> = {
    warfighting: CATEGORY_MAX.warfighting - components.warfighting,
    physicalToughness: CATEGORY_MAX.physicalToughness - components.physicalToughness,
    mentalAgility: CATEGORY_MAX.mentalAgility - components.mentalAgility,
    commandInput: CATEGORY_MAX.commandInput - components.commandInput,
    bonus: CATEGORY_MAX.bonus - components.bonus,
  }

  return opportunities
    .map(opp => {
      const gapAmount = gaps[opp.category]
      let relevanceScore = 0
      let isAvailableNow = true
      let urgencyLabel: string | undefined

      // Larger gap → more relevant (0–40 pts)
      relevanceScore += Math.min(40, (gapAmount / CATEGORY_MAX[opp.category]) * 40)

      // Higher point impact relative to gap (0–30 pts)
      const impactRatio = gapAmount > 0 ? opp.pointImpact / gapAmount : 0
      relevanceScore += Math.min(30, impactRatio * 30)

      // Seasonal availability (±20 pts)
      if (opp.seasonal === 'pft') {
        isAvailableNow = isPftSeason
        if (isPftSeason) {
          relevanceScore += 20
          const monthsLeft = 6 - month
          urgencyLabel = `PFT season — ${monthsLeft} months left`
        } else {
          relevanceScore -= 30
        }
      } else if (opp.seasonal === 'cft') {
        isAvailableNow = !isPftSeason
        if (!isPftSeason) {
          relevanceScore += 20
          const monthsLeft = 12 - month
          urgencyLabel = `CFT season — ${monthsLeft} months left`
        } else {
          relevanceScore -= 30
        }
      }

      // Date-based availability
      if (opp.availableFrom && CURRENT_DATE < new Date(opp.availableFrom)) isAvailableNow = false
      if (opp.availableUntil && CURRENT_DATE > new Date(opp.availableUntil)) isAvailableNow = false

      // Window urgency boost
      if (promotionWindow?.isEligible) {
        relevanceScore += 10
      }

      return {
        opportunity: opp,
        relevanceScore: Math.max(0, Math.min(100, relevanceScore)),
        gapCategory: opp.category,
        gapAmount,
        isAvailableNow,
        urgencyLabel,
      }
    })
    .filter(r => r.isAvailableNow)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
}
