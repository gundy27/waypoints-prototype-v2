// ── Branch & rank foundation (multi-branch parity) ───────────────────
// Enlisted ranks E-1..E-9 per branch, theming colors, scoring system,
// fitness test, and job-code labels. Officer/Warrant are out of scope
// for v2.0 (routed to a light "enlisted-focused" screen in onboarding).

export type BranchId =
  | 'marines'
  | 'army'
  | 'navy'
  | 'airforce'
  | 'coastguard'
  | 'spaceforce'

export type ScoringSystem =
  | 'cutting_score' // USMC JEPES composite
  | 'promotion_points' // Army (max 800)
  | 'waps' // Air Force / Space Force
  | 'fms' // Navy Final Multiple Score
  | 'final_multiple' // Coast Guard

export type FitnessTest = 'PFT' | 'CFT' | 'ACFT' | 'PRT' | 'PT Test' | 'PFA'

export interface Rank {
  payGrade: string // E-1 .. E-9
  abbr: string // LCpl, SPC, PO3, SrA ...
  name: string // Lance Corporal ...
}

export interface BranchConfig {
  id: BranchId
  name: string
  shortName: string
  /** Primary theme color (light mode). Branch theming is color-only in v1. */
  color: string
  /** Darker shade for gradients / pressed states. */
  colorDark: string
  /** Label for the occupational-code field captured in onboarding. */
  jobLabel: 'MOS' | 'Rate' | 'AFSC'
  /** Example job code shown as placeholder. */
  jobPlaceholder: string
  scoringSystem: ScoringSystem
  scoringLabel: string
  /** Max attainable promotion score for the gap visualization. */
  scoringMax: number
  fitnessTest: FitnessTest
  /** Secondary fitness test if the branch runs two (e.g. USMC CFT). */
  fitnessTestSecondary?: FitnessTest
  /** Branch-specific evaluation report name. */
  evalName: string
  /** Pay-grades that use a competitive promotion score (gap applies). */
  competitiveGrades: string[]
  enlistedRanks: Rank[]
}

const marinesRanks: Rank[] = [
  { payGrade: 'E-1', abbr: 'Pvt', name: 'Private' },
  { payGrade: 'E-2', abbr: 'PFC', name: 'Private First Class' },
  { payGrade: 'E-3', abbr: 'LCpl', name: 'Lance Corporal' },
  { payGrade: 'E-4', abbr: 'Cpl', name: 'Corporal' },
  { payGrade: 'E-5', abbr: 'Sgt', name: 'Sergeant' },
  { payGrade: 'E-6', abbr: 'SSgt', name: 'Staff Sergeant' },
  { payGrade: 'E-7', abbr: 'GySgt', name: 'Gunnery Sergeant' },
  { payGrade: 'E-8', abbr: 'MSgt', name: 'Master Sergeant' },
  { payGrade: 'E-9', abbr: 'MGySgt', name: 'Master Gunnery Sergeant' },
]

const armyRanks: Rank[] = [
  { payGrade: 'E-1', abbr: 'PV1', name: 'Private' },
  { payGrade: 'E-2', abbr: 'PV2', name: 'Private' },
  { payGrade: 'E-3', abbr: 'PFC', name: 'Private First Class' },
  { payGrade: 'E-4', abbr: 'SPC', name: 'Specialist' },
  { payGrade: 'E-5', abbr: 'SGT', name: 'Sergeant' },
  { payGrade: 'E-6', abbr: 'SSG', name: 'Staff Sergeant' },
  { payGrade: 'E-7', abbr: 'SFC', name: 'Sergeant First Class' },
  { payGrade: 'E-8', abbr: 'MSG', name: 'Master Sergeant' },
  { payGrade: 'E-9', abbr: 'SGM', name: 'Sergeant Major' },
]

const navyRanks: Rank[] = [
  { payGrade: 'E-1', abbr: 'SR', name: 'Seaman Recruit' },
  { payGrade: 'E-2', abbr: 'SA', name: 'Seaman Apprentice' },
  { payGrade: 'E-3', abbr: 'SN', name: 'Seaman' },
  { payGrade: 'E-4', abbr: 'PO3', name: 'Petty Officer Third Class' },
  { payGrade: 'E-5', abbr: 'PO2', name: 'Petty Officer Second Class' },
  { payGrade: 'E-6', abbr: 'PO1', name: 'Petty Officer First Class' },
  { payGrade: 'E-7', abbr: 'CPO', name: 'Chief Petty Officer' },
  { payGrade: 'E-8', abbr: 'SCPO', name: 'Senior Chief Petty Officer' },
  { payGrade: 'E-9', abbr: 'MCPO', name: 'Master Chief Petty Officer' },
]

const airforceRanks: Rank[] = [
  { payGrade: 'E-1', abbr: 'AB', name: 'Airman Basic' },
  { payGrade: 'E-2', abbr: 'Amn', name: 'Airman' },
  { payGrade: 'E-3', abbr: 'A1C', name: 'Airman First Class' },
  { payGrade: 'E-4', abbr: 'SrA', name: 'Senior Airman' },
  { payGrade: 'E-5', abbr: 'SSgt', name: 'Staff Sergeant' },
  { payGrade: 'E-6', abbr: 'TSgt', name: 'Technical Sergeant' },
  { payGrade: 'E-7', abbr: 'MSgt', name: 'Master Sergeant' },
  { payGrade: 'E-8', abbr: 'SMSgt', name: 'Senior Master Sergeant' },
  { payGrade: 'E-9', abbr: 'CMSgt', name: 'Chief Master Sergeant' },
]

const coastguardRanks: Rank[] = [
  { payGrade: 'E-1', abbr: 'SR', name: 'Seaman Recruit' },
  { payGrade: 'E-2', abbr: 'SA', name: 'Seaman Apprentice' },
  { payGrade: 'E-3', abbr: 'SN', name: 'Seaman' },
  { payGrade: 'E-4', abbr: 'PO3', name: 'Petty Officer Third Class' },
  { payGrade: 'E-5', abbr: 'PO2', name: 'Petty Officer Second Class' },
  { payGrade: 'E-6', abbr: 'PO1', name: 'Petty Officer First Class' },
  { payGrade: 'E-7', abbr: 'CPO', name: 'Chief Petty Officer' },
  { payGrade: 'E-8', abbr: 'SCPO', name: 'Senior Chief Petty Officer' },
  { payGrade: 'E-9', abbr: 'MCPO', name: 'Master Chief Petty Officer' },
]

const spaceforceRanks: Rank[] = [
  { payGrade: 'E-1', abbr: 'Spc1', name: 'Specialist 1' },
  { payGrade: 'E-2', abbr: 'Spc2', name: 'Specialist 2' },
  { payGrade: 'E-3', abbr: 'Spc3', name: 'Specialist 3' },
  { payGrade: 'E-4', abbr: 'Spc4', name: 'Specialist 4' },
  { payGrade: 'E-5', abbr: 'Sgt', name: 'Sergeant' },
  { payGrade: 'E-6', abbr: 'TSgt', name: 'Technical Sergeant' },
  { payGrade: 'E-7', abbr: 'MSgt', name: 'Master Sergeant' },
  { payGrade: 'E-8', abbr: 'SMSgt', name: 'Senior Master Sergeant' },
  { payGrade: 'E-9', abbr: 'CMSgt', name: 'Chief Master Sergeant' },
]

export const BRANCHES: Record<BranchId, BranchConfig> = {
  marines: {
    id: 'marines',
    name: 'United States Marine Corps',
    shortName: 'Marines',
    color: '#A6192E',
    colorDark: '#6E1020',
    jobLabel: 'MOS',
    jobPlaceholder: '0311',
    scoringSystem: 'cutting_score',
    scoringLabel: 'Cutting Score',
    scoringMax: 1100,
    fitnessTest: 'PFT',
    fitnessTestSecondary: 'CFT',
    evalName: 'Pro/Con Marks',
    competitiveGrades: ['E-3', 'E-4'], // promote to E-4 / E-5 via JEPES
    enlistedRanks: marinesRanks,
  },
  army: {
    id: 'army',
    name: 'United States Army',
    shortName: 'Army',
    color: '#4B5320',
    colorDark: '#333A16',
    jobLabel: 'MOS',
    jobPlaceholder: '11B',
    scoringSystem: 'promotion_points',
    scoringLabel: 'Promotion Points',
    scoringMax: 800,
    fitnessTest: 'ACFT',
    evalName: 'NCOER',
    competitiveGrades: ['E-4', 'E-5'], // promote to E-5 / E-6 via points
    enlistedRanks: armyRanks,
  },
  navy: {
    id: 'navy',
    name: 'United States Navy',
    shortName: 'Navy',
    color: '#0A3161',
    colorDark: '#06203F',
    jobLabel: 'Rate',
    jobPlaceholder: 'IT',
    scoringSystem: 'fms',
    scoringLabel: 'Final Multiple Score',
    scoringMax: 100,
    fitnessTest: 'PRT',
    evalName: 'EVAL',
    competitiveGrades: ['E-4', 'E-5', 'E-6'],
    enlistedRanks: navyRanks,
  },
  airforce: {
    id: 'airforce',
    name: 'United States Air Force',
    shortName: 'Air Force',
    color: '#00308F',
    colorDark: '#001E5C',
    jobLabel: 'AFSC',
    jobPlaceholder: '3D0X2',
    scoringSystem: 'waps',
    scoringLabel: 'WAPS Score',
    scoringMax: 460,
    fitnessTest: 'PT Test',
    evalName: 'EPR',
    competitiveGrades: ['E-4', 'E-5', 'E-6'],
    enlistedRanks: airforceRanks,
  },
  coastguard: {
    id: 'coastguard',
    name: 'United States Coast Guard',
    shortName: 'Coast Guard',
    color: '#E4632D',
    colorDark: '#B44619',
    jobLabel: 'Rate',
    jobPlaceholder: 'BM',
    scoringSystem: 'final_multiple',
    scoringLabel: 'Final Multiple',
    scoringMax: 100,
    fitnessTest: 'PFA',
    evalName: 'EVAL',
    competitiveGrades: ['E-5', 'E-6'],
    enlistedRanks: coastguardRanks,
  },
  spaceforce: {
    id: 'spaceforce',
    name: 'United States Space Force',
    shortName: 'Space Force',
    color: '#1C2841',
    colorDark: '#0E1626',
    jobLabel: 'AFSC',
    jobPlaceholder: '5C0X1',
    scoringSystem: 'waps',
    scoringLabel: 'WAPS Score',
    scoringMax: 460,
    fitnessTest: 'PT Test',
    evalName: 'EPR',
    competitiveGrades: ['E-4', 'E-5', 'E-6'],
    enlistedRanks: spaceforceRanks,
  },
}

export const BRANCH_LIST: BranchConfig[] = [
  BRANCHES.marines,
  BRANCHES.army,
  BRANCHES.navy,
  BRANCHES.airforce,
  BRANCHES.coastguard,
  BRANCHES.spaceforce,
]

export function getBranch(id: BranchId): BranchConfig {
  return BRANCHES[id]
}

export function getRank(branchId: BranchId, payGrade: string): Rank | null {
  return BRANCHES[branchId].enlistedRanks.find(r => r.payGrade === payGrade) ?? null
}

/** The next enlisted rank up, or null if already E-9. */
export function getNextRank(branchId: BranchId, payGrade: string): Rank | null {
  const ranks = BRANCHES[branchId].enlistedRanks
  const idx = ranks.findIndex(r => r.payGrade === payGrade)
  if (idx < 0 || idx >= ranks.length - 1) return null
  return ranks[idx + 1]
}

/** Whether promotion to the next grade is score-competitive (shows a gap). */
export function isCompetitivePromotion(branchId: BranchId, payGrade: string): boolean {
  return BRANCHES[branchId].competitiveGrades.includes(payGrade)
}

export function formatRank(rank: Rank): string {
  return `${rank.payGrade} (${rank.name})`
}
