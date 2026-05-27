// ── Waypoint primitives + template library + recommendation engine ───
// Waypoints are the concrete steps that move a user toward an objective.
// Templates are filtered by (branch × objective type × grade) and
// instantiated into live Waypoints when an objective is set.

import { CURRENT_DATE } from './promotionTimeline'
import type { BranchId } from './branches'
import type { Objective, ObjectiveType } from './objectives'

export type WaypointStatus = 'open' | 'completed' | 'skipped'
export type CompletionLogic = 'manual' | 'log' | 'event'

export type WaypointIcon =
  | 'book'
  | 'dumbbell'
  | 'target'
  | 'award'
  | 'calendar'
  | 'star'
  | 'file'
  | 'graduation'
  | 'piggy'
  | 'map'
  | 'flag'

export interface RelatedLink {
  label: string
  ref: string
}

export interface WaypointTemplate {
  id: string
  applicableBranches: BranchId[] | 'all'
  applicableObjectiveTypes: ObjectiveType[]
  applicableGrades?: string[]
  title: string
  description: string
  whyItMatters: string
  pointValue?: number
  completionLogic: CompletionLogic
  defaultOrder: number
  icon: WaypointIcon
  relatedLinks?: RelatedLink[]
}

export interface Waypoint {
  id: string
  objectiveId: string
  templateId: string
  title: string
  description: string
  whyItMatters: string
  pointValue?: number
  status: WaypointStatus
  completionLogic: CompletionLogic
  order: number
  icon: WaypointIcon
  completedAt?: string
  relatedLinks?: RelatedLink[]
}

export const WAYPOINT_TEMPLATES: WaypointTemplate[] = [
  // ── Marines — promotion (JEPES) ────────────────────────────────────
  {
    id: 'mc-corporals-course', applicableBranches: ['marines'], applicableObjectiveTypes: ['promotion'], applicableGrades: ['E-3'],
    title: 'Complete Corporals Course', description: 'Finish the Corporals Course on MarineNet.',
    whyItMatters: 'Adds 50 Mental Agility points to your JEPES — one of the fastest ways to close the gap.',
    pointValue: 50, completionLogic: 'manual', defaultOrder: 1, icon: 'book',
    relatedLinks: [{ label: 'MARADMIN 038/25', ref: 'maradmin:2' }],
  },
  {
    id: 'mc-sergeants-course', applicableBranches: ['marines'], applicableObjectiveTypes: ['promotion'], applicableGrades: ['E-4'],
    title: 'Complete Sergeants Course', description: 'Finish the Sergeants Distance Education Program.',
    whyItMatters: 'Required PME for Sergeant and adds Mental Agility points to your composite.',
    pointValue: 50, completionLogic: 'manual', defaultOrder: 1, icon: 'book',
  },
  {
    id: 'mc-max-mci', applicableBranches: ['marines'], applicableObjectiveTypes: ['promotion'],
    title: 'Max MarineNet MCIs', description: 'Complete remaining MCI courses for CEU credit.',
    whyItMatters: 'Each CEU adds ~1.25 JEPES points, up to 50 total in Mental Agility.',
    pointValue: 30, completionLogic: 'manual', defaultOrder: 3, icon: 'book',
  },
  {
    id: 'mc-mos-qual', applicableBranches: ['marines'], applicableObjectiveTypes: ['promotion'],
    title: 'Earn MOS Qualification Points', description: 'Complete PMOS courses from your qualification list.',
    whyItMatters: 'MOS qual courses give up to 100 Mental Agility points.',
    pointValue: 40, completionLogic: 'manual', defaultOrder: 4, icon: 'target',
  },
  {
    id: 'mc-mcmap', applicableBranches: ['marines'], applicableObjectiveTypes: ['promotion'],
    title: 'Advance Your MCMAP Belt', description: 'Train up to the next Marine Corps Martial Arts belt.',
    whyItMatters: 'A higher belt adds Warfighting points and reflects sustained development.',
    pointValue: 15, completionLogic: 'manual', defaultOrder: 5, icon: 'award',
  },
  {
    id: 'mc-pft', applicableBranches: ['marines'], applicableObjectiveTypes: ['promotion'],
    title: 'Log a Higher PFT', description: 'Test during the PFT window and log a stronger score.',
    whyItMatters: 'PFT feeds Physical Toughness — a higher score raises your composite directly.',
    completionLogic: 'log', defaultOrder: 2, icon: 'dumbbell',
  },

  // ── Army — promotion points ────────────────────────────────────────
  {
    id: 'ar-blc', applicableBranches: ['army'], applicableObjectiveTypes: ['promotion'],
    title: 'Complete Basic Leader Course', description: 'Attend BLC for NCO development.',
    whyItMatters: 'Military education is a major promotion-point category and a prerequisite for SGT.',
    pointValue: 80, completionLogic: 'manual', defaultOrder: 1, icon: 'graduation',
  },
  {
    id: 'ar-acft', applicableBranches: ['army'], applicableObjectiveTypes: ['promotion'],
    title: 'Max Your ACFT', description: 'Push your Army Combat Fitness Test score up.',
    whyItMatters: 'Physical fitness contributes directly to your promotion-point total.',
    completionLogic: 'log', defaultOrder: 2, icon: 'dumbbell',
  },
  {
    id: 'ar-weapons', applicableBranches: ['army'], applicableObjectiveTypes: ['promotion'],
    title: 'Qualify Expert', description: 'Re-qualify on your assigned weapon at the Expert level.',
    whyItMatters: 'Weapons qualification is worth promotion points and is checked at the board.',
    pointValue: 40, completionLogic: 'log', defaultOrder: 3, icon: 'target',
  },
  {
    id: 'ar-corr', applicableBranches: ['army'], applicableObjectiveTypes: ['promotion'],
    title: 'Complete Correspondence Courses', description: 'Knock out ATRRS / structured self-development hours.',
    whyItMatters: 'Correspondence hours add promotion points in the military-education category.',
    pointValue: 30, completionLogic: 'manual', defaultOrder: 4, icon: 'book',
  },
  {
    id: 'ar-awards', applicableBranches: ['army'], applicableObjectiveTypes: ['promotion'],
    title: 'Earn an Award', description: 'Get recognized with an AAM or higher.',
    whyItMatters: 'Awards and decorations are a scored promotion-point category.',
    pointValue: 20, completionLogic: 'manual', defaultOrder: 5, icon: 'award',
  },

  // ── Navy / Coast Guard — advancement ───────────────────────────────
  {
    id: 'nv-exam', applicableBranches: ['navy', 'coastguard'], applicableObjectiveTypes: ['promotion'],
    title: 'Study for the Advancement Exam', description: 'Work the bibliography for the Navy-wide / SWE exam.',
    whyItMatters: 'Your exam standard score is the largest single input to your Final Multiple.',
    completionLogic: 'manual', defaultOrder: 1, icon: 'book',
  },
  {
    id: 'nv-prt', applicableBranches: ['navy', 'coastguard'], applicableObjectiveTypes: ['promotion'],
    title: 'Pass Your PRT/PFA', description: 'Stay in the green on your physical readiness test.',
    whyItMatters: 'A PRT failure makes you ineligible to advance regardless of score.',
    completionLogic: 'log', defaultOrder: 2, icon: 'dumbbell',
  },
  {
    id: 'nv-quals', applicableBranches: ['navy', 'coastguard'], applicableObjectiveTypes: ['promotion'],
    title: 'Complete Required PQS', description: 'Finish Personnel Qualification Standards for your watch/rate.',
    whyItMatters: 'Qualifications strengthen your record and your evaluation marks.',
    completionLogic: 'manual', defaultOrder: 3, icon: 'star',
  },
  {
    id: 'nv-eval', applicableBranches: ['navy', 'coastguard'], applicableObjectiveTypes: ['promotion'],
    title: 'Earn Strong EVAL Marks', description: 'Document accomplishments ahead of your evaluation.',
    whyItMatters: 'Performance marks (PMA) weigh heavily in your Final Multiple.',
    completionLogic: 'manual', defaultOrder: 4, icon: 'file',
  },

  // ── Air Force / Space Force — WAPS ─────────────────────────────────
  {
    id: 'af-pme', applicableBranches: ['airforce', 'spaceforce'], applicableObjectiveTypes: ['promotion'],
    title: 'Finish Your CDCs / PME', description: 'Complete Career Development Courses or ALS.',
    whyItMatters: 'PME completion is required to test and contributes to your WAPS score.',
    completionLogic: 'manual', defaultOrder: 1, icon: 'graduation',
  },
  {
    id: 'af-testing', applicableBranches: ['airforce', 'spaceforce'], applicableObjectiveTypes: ['promotion'],
    title: 'Prep for WAPS Testing', description: 'Study the PFE and SKT references.',
    whyItMatters: 'Promotion-fitness and specialty-knowledge tests are large WAPS components.',
    completionLogic: 'manual', defaultOrder: 2, icon: 'target',
  },
  {
    id: 'af-pfa', applicableBranches: ['airforce', 'spaceforce'], applicableObjectiveTypes: ['promotion'],
    title: 'Improve Your PT Test', description: 'Raise your fitness assessment composite.',
    whyItMatters: 'Staying fit keeps you eligible and supports a strong record.',
    completionLogic: 'log', defaultOrder: 3, icon: 'dumbbell',
  },
  {
    id: 'af-epr', applicableBranches: ['airforce', 'spaceforce'], applicableObjectiveTypes: ['promotion'],
    title: 'Build a Strong EPR', description: 'Log accomplishments for your performance report.',
    whyItMatters: 'Evaluation scoring is a decisive WAPS input at the SrA→SSgt and above tiers.',
    completionLogic: 'manual', defaultOrder: 4, icon: 'file',
  },

  // ── Fitness objective (all branches) ───────────────────────────────
  {
    id: 'fit-cardio', applicableBranches: 'all', applicableObjectiveTypes: ['fitness'],
    title: 'Improve Your Run Time', description: 'Add two interval sessions per week.',
    whyItMatters: 'Cardio is the highest-leverage event for most fitness-test scores.',
    completionLogic: 'log', defaultOrder: 1, icon: 'dumbbell',
  },
  {
    id: 'fit-strength', applicableBranches: 'all', applicableObjectiveTypes: ['fitness'],
    title: 'Build Upper-Body Strength', description: 'Progressive push-ups / pull-ups program.',
    whyItMatters: 'Strength events are quick to improve and add points fast.',
    completionLogic: 'log', defaultOrder: 2, icon: 'dumbbell',
  },
  {
    id: 'fit-core', applicableBranches: 'all', applicableObjectiveTypes: ['fitness'],
    title: 'Strengthen Your Core', description: 'Daily plank / crunch progression.',
    whyItMatters: 'Core events are easy points and reduce injury risk.',
    completionLogic: 'log', defaultOrder: 3, icon: 'dumbbell',
  },
  {
    id: 'fit-log', applicableBranches: 'all', applicableObjectiveTypes: ['fitness'],
    title: 'Log a New Test Score', description: 'Record your latest official score.',
    whyItMatters: 'Logging keeps your gap accurate and your trajectory visible.',
    completionLogic: 'log', defaultOrder: 4, icon: 'calendar',
  },

  // ── Light objectives ───────────────────────────────────────────────
  { id: 'fin-tsp', applicableBranches: 'all', applicableObjectiveTypes: ['finance'], title: 'Set Your TSP Allocation', description: 'Pick a contribution rate and fund mix.', whyItMatters: 'Automated contributions are the backbone of building savings.', completionLogic: 'manual', defaultOrder: 1, icon: 'piggy' },
  { id: 'fin-savings', applicableBranches: 'all', applicableObjectiveTypes: ['finance'], title: 'Open High-Yield Savings', description: 'Move your emergency fund somewhere it earns.', whyItMatters: 'A dedicated account separates savings from spending.', completionLogic: 'manual', defaultOrder: 2, icon: 'piggy' },
  { id: 'fin-milestone', applicableBranches: 'all', applicableObjectiveTypes: ['finance'], title: 'Hit Your First $1,000', description: 'Reach your starter emergency-fund milestone.', whyItMatters: 'The first milestone builds the habit and the buffer.', completionLogic: 'manual', defaultOrder: 3, icon: 'flag' },

  { id: 'pcs-housing', applicableBranches: 'all', applicableObjectiveTypes: ['pcs'], title: 'Research Housing', description: 'On-base vs. off-base options at the new duty station.', whyItMatters: 'Housing lead time is the longest pole in a PCS.', completionLogic: 'manual', defaultOrder: 1, icon: 'map' },
  { id: 'pcs-paperwork', applicableBranches: 'all', applicableObjectiveTypes: ['pcs'], title: 'Start Your Paperwork', description: 'Orders, travel claim, and TMO scheduling.', whyItMatters: 'Early paperwork avoids reimbursement and move delays.', completionLogic: 'manual', defaultOrder: 2, icon: 'file' },
  { id: 'pcs-schools', applicableBranches: 'all', applicableObjectiveTypes: ['pcs'], title: 'Line Up Schools', description: 'Enrollment and records transfer for dependents.', whyItMatters: 'School slots fill early near most installations.', completionLogic: 'manual', defaultOrder: 3, icon: 'graduation' },

  { id: 'tr-tap', applicableBranches: 'all', applicableObjectiveTypes: ['transition'], title: 'Complete TAP', description: 'Finish the Transition Assistance Program.', whyItMatters: 'TAP is required and unlocks the rest of your transition timeline.', completionLogic: 'manual', defaultOrder: 1, icon: 'flag' },
  { id: 'tr-resume', applicableBranches: 'all', applicableObjectiveTypes: ['transition'], title: 'Draft Your Resume', description: 'Translate your record into civilian terms.', whyItMatters: 'A strong resume is the centerpiece of your job search.', completionLogic: 'manual', defaultOrder: 2, icon: 'file' },
  { id: 'tr-gibill', applicableBranches: 'all', applicableObjectiveTypes: ['transition'], title: 'Sort Out GI Bill', description: 'Transfer or plan to use your education benefit.', whyItMatters: 'Benefit decisions have deadlines tied to your service.', completionLogic: 'manual', defaultOrder: 3, icon: 'graduation' },

  { id: 'pme-prereq', applicableBranches: 'all', applicableObjectiveTypes: ['pme'], title: 'Clear the Pre-Reqs', description: 'Confirm eligibility and prerequisites.', whyItMatters: 'Pre-reqs gate your seat in the course.', completionLogic: 'manual', defaultOrder: 1, icon: 'book' },
  { id: 'pme-study', applicableBranches: 'all', applicableObjectiveTypes: ['pme'], title: 'Build a Study Plan', description: 'Schedule study blocks before the course date.', whyItMatters: 'A plan keeps a self-paced course from stalling.', completionLogic: 'manual', defaultOrder: 2, icon: 'calendar' },
  { id: 'pme-enroll', applicableBranches: 'all', applicableObjectiveTypes: ['pme'], title: 'Enroll', description: 'Register and lock in your start.', whyItMatters: 'Enrollment turns intent into a tracked commitment.', completionLogic: 'manual', defaultOrder: 3, icon: 'flag' },

  { id: 'bc-targets', applicableBranches: 'all', applicableObjectiveTypes: ['bodycomp'], title: 'Set Daily Targets', description: 'Calorie and activity targets to your weigh-in.', whyItMatters: 'Clear daily targets make the goal actionable.', completionLogic: 'manual', defaultOrder: 1, icon: 'target' },
  { id: 'bc-log', applicableBranches: 'all', applicableObjectiveTypes: ['bodycomp'], title: 'Log Weight Cadence', description: 'Weigh in on a consistent schedule.', whyItMatters: 'Regular logging keeps the trend honest.', completionLogic: 'log', defaultOrder: 2, icon: 'calendar' },
  { id: 'bc-tape', applicableBranches: 'all', applicableObjectiveTypes: ['bodycomp'], title: 'Pass the Tape', description: 'Clear your body-composition assessment.', whyItMatters: 'Passing keeps you eligible and off the program.', completionLogic: 'event', defaultOrder: 3, icon: 'flag' },

  { id: 'ev-accomplishments', applicableBranches: 'all', applicableObjectiveTypes: ['eval'], title: 'Log Accomplishments', description: 'Capture wins as they happen.', whyItMatters: 'A running list makes your eval write-up easy and complete.', completionLogic: 'manual', defaultOrder: 1, icon: 'file' },
  { id: 'ev-input', applicableBranches: 'all', applicableObjectiveTypes: ['eval'], title: 'Submit Self-Input', description: 'Provide your accomplishments to your rater.', whyItMatters: 'Self-input shapes how your performance is documented.', completionLogic: 'manual', defaultOrder: 2, icon: 'file' },
  { id: 'ev-review', applicableBranches: 'all', applicableObjectiveTypes: ['eval'], title: 'Review With Your Rater', description: 'Talk through expectations early.', whyItMatters: 'Early alignment avoids surprises at submission.', completionLogic: 'manual', defaultOrder: 3, icon: 'flag' },

  // ── Pre-bootcamp readiness ─────────────────────────────────────────
  { id: 'bc-docs', applicableBranches: 'all', applicableObjectiveTypes: ['bootcamp'], title: 'Get Your Documents Ready', description: 'Gather IDs, records, and recruiter paperwork.', whyItMatters: 'Missing documents are the most common ship-day delay.', completionLogic: 'manual', defaultOrder: 1, icon: 'file' },
  { id: 'bc-fitness', applicableBranches: 'all', applicableObjectiveTypes: ['bootcamp'], title: 'Build Baseline Fitness', description: 'Run, push-ups, and core on a steady schedule.', whyItMatters: 'Showing up fit makes the first weeks far easier.', completionLogic: 'log', defaultOrder: 2, icon: 'dumbbell' },
  { id: 'bc-knowledge', applicableBranches: 'all', applicableObjectiveTypes: ['bootcamp'], title: 'Learn the Rank Structure', description: 'Memorize ranks and basic knowledge.', whyItMatters: 'Knowing the basics early earns you breathing room.', completionLogic: 'manual', defaultOrder: 3, icon: 'book' },
  { id: 'bc-support', applicableBranches: 'all', applicableObjectiveTypes: ['bootcamp'], title: 'Set Up Your Support Network', description: 'Line up who will write you letters.', whyItMatters: 'Mail at boot camp is a real morale lifeline.', completionLogic: 'manual', defaultOrder: 4, icon: 'flag' },
]

function templateApplies(
  t: WaypointTemplate,
  branchId: BranchId,
  payGrade: string,
  objectiveType: ObjectiveType,
): boolean {
  const branchOk = t.applicableBranches === 'all' || t.applicableBranches.includes(branchId)
  const typeOk = t.applicableObjectiveTypes.includes(objectiveType)
  const gradeOk = !t.applicableGrades || t.applicableGrades.includes(payGrade)
  return branchOk && typeOk && gradeOk
}

/**
 * Seed live Waypoints for an objective from the template library,
 * filtered by branch × grade × objective type and ordered.
 */
export function recommendWaypoints(
  objective: Objective,
  branchId: BranchId,
  payGrade: string,
): Waypoint[] {
  return WAYPOINT_TEMPLATES
    .filter(t => templateApplies(t, branchId, payGrade, objective.type))
    .sort((a, b) => a.defaultOrder - b.defaultOrder)
    .map((t, i) => ({
      id: `wp-${objective.id}-${t.id}`,
      objectiveId: objective.id,
      templateId: t.id,
      title: t.title,
      description: t.description,
      whyItMatters: t.whyItMatters,
      pointValue: t.pointValue,
      status: 'open' as WaypointStatus,
      completionLogic: t.completionLogic,
      order: i,
      icon: t.icon,
      relatedLinks: t.relatedLinks,
    }))
}

export function completeWaypoint(waypoints: Waypoint[], waypointId: string): Waypoint[] {
  return waypoints.map(w =>
    w.id === waypointId
      ? { ...w, status: 'completed' as WaypointStatus, completedAt: CURRENT_DATE.toISOString().slice(0, 10) }
      : w,
  )
}

export function waypointProgress(waypoints: Waypoint[]): { completed: number; total: number } {
  return {
    completed: waypoints.filter(w => w.status === 'completed').length,
    total: waypoints.length,
  }
}
