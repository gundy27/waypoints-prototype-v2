export interface UserProfile {
  name: string
  firstName: string
  lastName: string
  mos: string
  rank: string
  tis: string
  tig: string
  dor: string
  compositeScore: number
  cuttingScore: number
  pft: number
  pftClass: string
  cft: number
  cftClass: string
  rifle: number
  rifleClass: string
  mcmapBelt: string
  pmeCompleted: boolean
  commandInputMosMission: number
  commandInputLeadership: number
  commandInputCharacter: number
  commandInputAvg: number
  mosQualPoints: number
  mciCourses: number
  degree: string
  inGradeCourses: number
  inServicePoints: number
  sdaAssignment: string
  crbReferrals: number
  promotionWindowStart: string
  promotionWindowEnd: string
  scoreTrend: number
}

export const defaultProfile: UserProfile = {
  name: 'LCpl Martinez',
  firstName: 'Miguel',
  lastName: 'Martinez',
  mos: '0311 - Rifleman',
  rank: 'E-3 (Lance Corporal)',
  tis: '1 year 5 months',
  tig: '3 months',
  dor: '2024-12-01',
  compositeScore: 718,
  cuttingScore: 780,
  pft: 271,
  pftClass: '1st Class',
  cft: 285,
  cftClass: '1st Class',
  rifle: 335,
  rifleClass: 'Expert',
  mcmapBelt: 'MMD',
  pmeCompleted: true,
  commandInputMosMission: 3.8,
  commandInputLeadership: 3.6,
  commandInputCharacter: 3.7,
  commandInputAvg: 3.7,
  mosQualPoints: 70,
  mciCourses: 24,
  degree: 'None',
  inGradeCourses: 2,
  inServicePoints: 0,
  sdaAssignment: 'None',
  crbReferrals: 0,
  promotionWindowStart: '2026-04-01',
  promotionWindowEnd: '2026-04-30',
  scoreTrend: 12,
}

export interface ScoreBreakdown {
  label: string
  value: number
  max: number
}

export const scoreBreakdown: ScoreBreakdown[] = [
  { label: 'Warfighting', value: 188, max: 250 },
  { label: 'Physical Toughness', value: 226, max: 250 },
  { label: 'Mental Agility', value: 120, max: 250 },
  { label: 'Command Input', value: 184, max: 250 },
  { label: 'Bonus', value: 0, max: 100 },
]

export const pftHistory = [
  { month: 'Mar 24', score: 245 },
  { month: 'Jun 24', score: 255 },
  { month: 'Sep 24', score: 260 },
  { month: 'Jan 25', score: 271 },
]

export const compositeHistory = [
  { month: 'Jun 24', score: 680 },
  { month: 'Sep 24', score: 694 },
  { month: 'Nov 24', score: 706 },
  { month: 'Jan 25', score: 718 },
]

export interface Tip {
  id: number
  title: string
  description: string
  icon: 'gap' | 'pme' | 'cutting' | 'fitness'
}

export const tips: Tip[] = [
  {
    id: 1,
    title: 'Close the Gap',
    description:
      "You're 62 points below the cutting score. Max your MCIs on MarineNet — 40 CEUs gives you 50 JEPES points.",
    icon: 'gap',
  },
  {
    id: 2,
    title: 'Earn MOS Qual Points',
    description:
      'MOS qualification courses can give you up to 100 JEPES points in Mental Agility. Check the PMOS list for courses worth your time.',
    icon: 'pme',
  },
  {
    id: 3,
    title: 'Boost Your PFT Score',
    description:
      'Your next PFT window opens in 6 weeks. Adding two interval runs per week can cut 30–45 seconds off your 3-mile time and add up to 10 JEPES Physical Fitness points.',
    icon: 'fitness',
  },
]

export interface PocketbookCategory {
  id: string
  title: string
  items: PocketbookItem[]
}

export interface PocketbookItem {
  id: string
  title: string
  content: string
}

export const pocketbookCategories: PocketbookCategory[] = [
  {
    id: 'uniform',
    title: 'Uniform Standards',
    items: [
      {
        id: 'u1',
        title: 'Hair Regulations',
        content:
          'Hair will be neat and closely trimmed. The hair may be clipped at the edges of the side and back and will be evenly graduated from zero length at the hairline in the lower portion of the head to the upper portion of the head. Hair will not be over 3 inches in length fully extended on the upper portion of the head.',
      },
      {
        id: 'u2',
        title: 'Service Uniform (Charlies)',
        content:
          'The Service "C" uniform consists of the green coat, khaki long-sleeve shirt, green trousers, and appropriate accessories. The garrison cover is worn with this uniform. Ribbons are worn over the left breast pocket. Shooting badges are worn on the left breast below the ribbons.',
      },
      {
        id: 'u3',
        title: 'Utility Uniform (MARPAT)',
        content:
          'The utility uniform (MCCUU) is the standard working uniform. It consists of the woodland or desert MARPAT blouse and trousers, undershirt (olive drab or coyote brown), and combat boots. Sleeves will not be rolled. Name tapes and service tapes are required.',
      },
    ],
  },
  {
    id: 'rank',
    title: 'Rank Structure & Insignia',
    items: [
      {
        id: 'r1',
        title: 'Enlisted Ranks (E-1 to E-5)',
        content:
          'E-1: Private (Pvt) - No insignia. E-2: Private First Class (PFC) - One chevron up. E-3: Lance Corporal (LCpl) - One chevron up, crossed rifles. E-4: Corporal (Cpl) - Two chevrons up, crossed rifles. E-5: Sergeant (Sgt) - Three chevrons up, crossed rifles.',
      },
      {
        id: 'r2',
        title: 'Staff NCO Ranks (E-6 to E-9)',
        content:
          'E-6: Staff Sergeant (SSgt) - Three up, one rocker. E-7: Gunnery Sergeant (GySgt) - Three up, two rockers. E-8: Master Sergeant (MSgt) / First Sergeant (1stSgt). E-9: Master Gunnery Sergeant (MGySgt) / Sergeant Major (SgtMaj).',
      },
    ],
  },
  {
    id: 'general-orders',
    title: 'General Orders',
    items: [
      {
        id: 'g1',
        title: '1st General Order',
        content:
          'To take charge of this post and all government property in view.',
      },
      {
        id: 'g2',
        title: '2nd General Order',
        content:
          'To walk my post in a military manner, keeping always on the alert, and observing everything that takes place within sight or hearing.',
      },
      {
        id: 'g3',
        title: '3rd General Order',
        content:
          'To report all violations of orders I am instructed to enforce.',
      },
      {
        id: 'g4',
        title: '4th General Order',
        content:
          'To repeat all calls from posts more distant from the guard house than my own.',
      },
      {
        id: 'g5',
        title: '5th General Order',
        content:
          'To quit my post only when properly relieved.',
      },
      {
        id: 'g6',
        title: '6th General Order',
        content:
          'To receive, obey, and pass on to the sentry who relieves me, all orders from the Commanding Officer, Officer of the Day, Officers, and Non-Commissioned Officers of the guard only.',
      },
      {
        id: 'g7',
        title: '7th General Order',
        content:
          'To talk to no one except in the line of duty.',
      },
      {
        id: 'g8',
        title: '8th General Order',
        content:
          'To give the alarm in case of fire or disorder.',
      },
      {
        id: 'g9',
        title: '9th General Order',
        content:
          'To call the Corporal of the Guard in any case not covered by instructions.',
      },
      {
        id: 'g10',
        title: '10th General Order',
        content:
          'To salute all officers and all colors and standards not cased.',
      },
      {
        id: 'g11',
        title: '11th General Order',
        content:
          'To be especially watchful at night, and, during the time for challenging, to challenge all persons on or near my post and to allow no one to pass without proper authority.',
      },
    ],
  },
  {
    id: 'code-of-conduct',
    title: 'Code of Conduct',
    items: [
      {
        id: 'c1',
        title: 'Article I',
        content:
          'I am an American, fighting in the forces which guard my country and our way of life. I am prepared to give my life in their defense.',
      },
      {
        id: 'c2',
        title: 'Article II',
        content:
          'I will never surrender of my own free will. If in command, I will never surrender the members of my command while they still have the means to resist.',
      },
      {
        id: 'c3',
        title: 'Article III',
        content:
          'If I am captured I will continue to resist by all means available. I will make every effort to escape and aid others to escape. I will accept neither parole nor special favors from the enemy.',
      },
    ],
  },
  {
    id: 'leadership',
    title: 'Leadership Principles & Traits',
    items: [
      {
        id: 'l1',
        title: '14 Leadership Traits (JJ DID TIE BUCKLE)',
        content:
          'Justice, Judgment, Dependability, Initiative, Decisiveness, Tact, Integrity, Enthusiasm, Bearing, Unselfishness, Courage, Knowledge, Loyalty, Endurance.',
      },
      {
        id: 'l2',
        title: '11 Leadership Principles',
        content:
          '1. Know yourself and seek self-improvement. 2. Be technically and tactically proficient. 3. Know your Marines and look out for their welfare. 4. Keep your Marines informed. 5. Set the example. 6. Ensure the task is understood, supervised, and accomplished. 7. Train your Marines as a team. 8. Make sound and timely decisions. 9. Develop a sense of responsibility among your subordinates. 10. Employ your command in accordance with its capabilities. 11. Seek responsibility and take responsibility for your actions.',
      },
    ],
  },
  {
    id: 'acronyms',
    title: 'Common Acronyms',
    items: [
      {
        id: 'a1',
        title: 'Service Acronyms',
        content:
          'PFT: Physical Fitness Test. CFT: Combat Fitness Test. PME: Professional Military Education. MOS: Military Occupational Specialty. TIS: Time in Service. TIG: Time in Grade. MARADMIN: Marine Administrative Message. MCO: Marine Corps Order. SOP: Standard Operating Procedure.',
      },
      {
        id: 'a2',
        title: 'Rank & Organization',
        content:
          'NCO: Non-Commissioned Officer. SNCO: Staff Non-Commissioned Officer. CO: Commanding Officer. XO: Executive Officer. 1stSgt: First Sergeant. SgtMaj: Sergeant Major. HQMC: Headquarters Marine Corps. MEF: Marine Expeditionary Force.',
      },
    ],
  },
  {
    id: 'chain-of-command',
    title: 'Chain of Command',
    items: [
      {
        id: 'cc1',
        title: 'National Chain of Command',
        content:
          'President of the United States (Commander-in-Chief). Secretary of Defense. Secretary of the Navy. Commandant of the Marine Corps. Assistant Commandant of the Marine Corps. Sergeant Major of the Marine Corps.',
      },
      {
        id: 'cc2',
        title: 'Unit Chain of Command',
        content:
          'Commanding General. Regimental Commander. Battalion Commander. Company Commander. Platoon Commander. Platoon Sergeant. Squad Leader. Fire Team Leader. Individual Marine.',
      },
    ],
  },
  {
    id: 'fitness',
    title: 'Physical Fitness Standards',
    items: [
      {
        id: 'f1',
        title: 'PFT Scoring (Male, 17–26)',
        content:
          'The Physical Fitness Test (PFT) consists of Pull-ups (max 100 pts), Crunches or Plank (max 100 pts), and a 3-mile run (max 100 pts) for a maximum of 300 points.\n\nPull-ups: 1st Class = 23+, 2nd Class = 18–22, 3rd Class = 4–17.\nCrunches (2 min): 1st Class = 105+, 2nd Class = 80–104, 3rd Class = 50–79.\n3-Mile Run: 1st Class = sub-19:30, 2nd Class = sub-23:00, 3rd Class = sub-27:40.\n\nClass thresholds — 1st Class: 225–300 pts. 2nd Class: 175–224 pts. 3rd Class: 135–174 pts. Failure: below 135 pts.',
      },
      {
        id: 'f2',
        title: 'CFT Scoring (Male, 17–26)',
        content:
          'The Combat Fitness Test (CFT) consists of an 880-yard sprint (Movement to Contact), Ammunition Lift (30 lb ammo can overhead, max reps in 2 min), and Maneuver Under Fire (300-yard course) for a maximum of 300 points.\n\nMovement to Contact: 1st Class = sub-2:45, 2nd Class = sub-3:25, 3rd Class = sub-4:10.\nAmmunition Lift: 1st Class = 71+ reps, 2nd Class = 50–70 reps, 3rd Class = 21–49 reps.\nManeuver Under Fire: 1st Class = sub-2:45, 2nd Class = sub-3:25, 3rd Class = sub-4:35.\n\nClass thresholds — 1st Class: 270–300 pts. 2nd Class: 225–269 pts. 3rd Class: 150–224 pts. Failure: below 150 pts.',
      },
      {
        id: 'f3',
        title: 'PFT & CFT Impact on JEPES',
        content:
          'PFT and CFT scores contribute to the Physical Toughness category of the JEPES composite score (max 250 pts).\n\nPFT points (max 125): Score ÷ 300 × 125.\nCFT points (max 125): Score ÷ 300 × 125.\n\nAchieving a perfect 300 on both tests earns the full 250 Physical Toughness points. A 1st Class PFT (225+) and 1st Class CFT (270+) are the floor for competitive composite scores. Improving either test score directly raises your JEPES.',
      },
      {
        id: 'f4',
        title: 'Rifle Qualification Classes',
        content:
          'Annual rifle qualification is conducted at the rifle range using the prescribed qualification course.\n\nScoring thresholds (Table 1 & 2 combined, max 500 pts):\nExpert: 420–500 pts\nSharpshooter: 350–419 pts\nMarksman: 305–349 pts\nUnqualified (Re-qual required): below 305 pts\n\nExpert qualification earns 5 bonus JEPES points. Maintaining Expert through consecutive years reflects sustained proficiency and is noted favorably in command input evaluations.',
      },
      {
        id: 'f5',
        title: 'MCMAP Belt Levels',
        content:
          'Marine Corps Martial Arts Program (MCMAP) belts represent progressive combat and character training.\n\nTan Belt: Entry level, required for all Marines.\nGray Belt: Typically earned in formal schooling.\nGreen Belt: Journeyman level; required for NCO promotion board eligibility.\nBrown Belt: Intermediate instructor-level proficiency.\nBlack Belt: Advanced level, required for SNCO promotion board eligibility.\n\nEarning a belt above Tan contributes to the Warfighting category of your JEPES score and demonstrates commitment to personal development.',
      },
    ],
  },
  {
    id: 'promotions',
    title: 'Promotion Requirements',
    items: [
      {
        id: 'p1',
        title: 'E-2 (PFC) Requirements',
        content:
          'Time in Service: 6 months. Time in Grade: N/A. Commandant\'s approval required. Automatic upon meeting TIS requirement unless withheld by commander.',
      },
      {
        id: 'p2',
        title: 'E-3 (LCpl) Requirements',
        content:
          'Time in Service: 9 months. Time in Grade: 8 months as PFC. Must meet minimum conduct and proficiency marks.',
      },
      {
        id: 'p3',
        title: 'E-4 (Cpl) Requirements',
        content:
          'JEPES score (0-1000, up to 1100 with bonus) must meet or exceed the cutting score for MOS. Five categories: Warfighting (250), Physical Toughness (250), Mental Agility (250), Command Input (250), Bonus (100). Cutting scores published monthly via MARADMIN.',
      },
      {
        id: 'p4',
        title: 'E-5 (Sgt) Requirements',
        content:
          'JEPES score (0-1000, up to 1100 with bonus) must meet or exceed the cutting score for MOS. Must be a Corporal. Must complete required PME (Sergeants Course). Cutting scores published monthly via MARADMIN.',
      },
    ],
  },
]

// ── Promotion eligibility rules ──────────────────────────────────────

export interface PromotionEligibilityRule {
  fromRank: string
  toRank: string
  toRankShort: string
  tigMonthsRequired: number
  tisMonthsRequired: number
  pmeRequired: boolean
  usesJepes: boolean
}

export const promotionRules: PromotionEligibilityRule[] = [
  { fromRank: 'E-1 (Private)', toRank: 'E-2 (Private First Class)', toRankShort: 'PFC', tigMonthsRequired: 0, tisMonthsRequired: 6, pmeRequired: false, usesJepes: false },
  { fromRank: 'E-2 (Private First Class)', toRank: 'E-3 (Lance Corporal)', toRankShort: 'LCpl', tigMonthsRequired: 8, tisMonthsRequired: 9, pmeRequired: false, usesJepes: false },
  { fromRank: 'E-3 (Lance Corporal)', toRank: 'E-4 (Corporal)', toRankShort: 'Cpl', tigMonthsRequired: 8, tisMonthsRequired: 0, pmeRequired: false, usesJepes: true },
  { fromRank: 'E-4 (Corporal)', toRank: 'E-5 (Sergeant)', toRankShort: 'Sgt', tigMonthsRequired: 12, tisMonthsRequired: 0, pmeRequired: true, usesJepes: true },
]

// ── Historical cut scores ────────────────────────────────────────────

export interface CutScoreEntry {
  mos: string
  toRank: string
  quarter: string
  effectiveDate: string
  score: number
}

export const cutScoreHistory: CutScoreEntry[] = [
  // 0311 → Cpl (6 quarters, trending down ~14 pts/qtr)
  { mos: '0311', toRank: 'Cpl', quarter: 'Q1 FY24', effectiveDate: '2023-12-01', score: 850 },
  { mos: '0311', toRank: 'Cpl', quarter: 'Q2 FY24', effectiveDate: '2024-03-01', score: 830 },
  { mos: '0311', toRank: 'Cpl', quarter: 'Q3 FY24', effectiveDate: '2024-06-01', score: 820 },
  { mos: '0311', toRank: 'Cpl', quarter: 'Q4 FY24', effectiveDate: '2024-09-01', score: 810 },
  { mos: '0311', toRank: 'Cpl', quarter: 'Q1 FY25', effectiveDate: '2024-12-01', score: 800 },
  { mos: '0311', toRank: 'Cpl', quarter: 'Q2 FY25', effectiveDate: '2025-03-01', score: 780 },
  // 0311 → Sgt
  { mos: '0311', toRank: 'Sgt', quarter: 'Q1 FY24', effectiveDate: '2023-12-01', score: 920 },
  { mos: '0311', toRank: 'Sgt', quarter: 'Q2 FY24', effectiveDate: '2024-03-01', score: 910 },
  { mos: '0311', toRank: 'Sgt', quarter: 'Q3 FY24', effectiveDate: '2024-06-01', score: 895 },
  { mos: '0311', toRank: 'Sgt', quarter: 'Q4 FY24', effectiveDate: '2024-09-01', score: 885 },
  { mos: '0311', toRank: 'Sgt', quarter: 'Q1 FY25', effectiveDate: '2024-12-01', score: 870 },
  { mos: '0311', toRank: 'Sgt', quarter: 'Q2 FY25', effectiveDate: '2025-03-01', score: 860 },
]

// ── Opportunities ────────────────────────────────────────────────────

export type ScoreCategory = 'warfighting' | 'physicalToughness' | 'mentalAgility' | 'commandInput' | 'bonus'

export interface Opportunity {
  id: string
  title: string
  description: string
  pointImpact: number
  category: ScoreCategory
  type: 'course' | 'event' | 'action' | 'test'
  seasonal?: 'pft' | 'cft'
  availableFrom?: string
  availableUntil?: string
  icon: 'book' | 'dumbbell' | 'target' | 'award' | 'calendar' | 'star'
}

export const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Complete Corporals Course',
    description: 'Earn 50 Mental Agility points by completing the Corporals Course on MarineNet.',
    pointImpact: 50,
    category: 'mentalAgility',
    type: 'course',
    icon: 'book',
  },
  {
    id: 'opp-2',
    title: 'Max MarineNet MCIs',
    description: 'Complete remaining MCI courses. Each CEU adds ~1.25 JEPES points, up to 50 total.',
    pointImpact: 20,
    category: 'mentalAgility',
    type: 'course',
    icon: 'book',
  },
  {
    id: 'opp-3',
    title: 'Improve PFT Score',
    description: 'PFT season runs Jan–Jun. A higher score directly increases Physical Toughness points.',
    pointImpact: 10,
    category: 'physicalToughness',
    type: 'test',
    seasonal: 'pft',
    availableFrom: '2025-01-01',
    availableUntil: '2025-06-30',
    icon: 'dumbbell',
  },
  {
    id: 'opp-4',
    title: 'Log CFT Score',
    description: 'CFT season runs Jul–Dec. Maintain or improve your current score.',
    pointImpact: 5,
    category: 'physicalToughness',
    type: 'test',
    seasonal: 'cft',
    availableFrom: '2025-07-01',
    availableUntil: '2025-12-31',
    icon: 'dumbbell',
  },
  {
    id: 'opp-5',
    title: 'Earn MOS Qualification Points',
    description: 'PMOS courses can give up to 100 Mental Agility points. Check the qual list for your MOS.',
    pointImpact: 30,
    category: 'mentalAgility',
    type: 'course',
    icon: 'target',
  },
  {
    id: 'opp-6',
    title: 'Advance MCMAP Belt',
    description: 'Progressing from Green (105 pts) to Green Instructor (120 pts) adds 15 Warfighting points.',
    pointImpact: 15,
    category: 'warfighting',
    type: 'action',
    icon: 'award',
  },
  {
    id: 'opp-7',
    title: 'Start Off-Duty College Courses',
    description: 'Each in-grade college course earns 5 Mental Agility points (max 4 courses = 20 pts).',
    pointImpact: 10,
    category: 'mentalAgility',
    type: 'course',
    icon: 'book',
  },
]

// ── MARADMINs ────────────────────────────────────────────────────────

export interface Maradmin {
  id: number
  number: string
  date: string
  title: string
  summary: string
  tag: 'Promotions' | 'PME' | 'Policy'
  affectsScore: boolean
  fullText: string
  whatItMeans: string
}

export const maradmins: Maradmin[] = [
  {
    id: 1,
    number: 'MARADMIN 045/25',
    date: 'Feb 15, 2025',
    title: 'FY25 Q2 Cutting Score Update',
    summary:
      'Updated JEPES score cutting scores for promotion to Corporal and Sergeant across all MOSs effective March 1, 2025.',
    tag: 'Promotions',
    affectsScore: true,
    fullText:
      'R 151200Z FEB 25\nFM CMC WASHINGTON DC\nTO AL MARADMIN\nSUBJ/FY25 SECOND QUARTER ENLISTED JEPES SCORE CUTTING SCORES\n\n1. THE FOLLOWING CUTTING SCORES ARE EFFECTIVE 1 MARCH 2025 FOR PROMOTION TO CPL AND SGT.\n\n2. MOS 0311 RIFLEMAN:\n   A. TO CPL: 780 (PREV 800, CHANGE: -20)\n   B. TO SGT: 860 (PREV 870, CHANGE: -10)\n\n3. MARINES WHO MEET OR EXCEED THE APPLICABLE CUTTING SCORE ON THE EFFECTIVE DATE WILL BE PROMOTED IAW CURRENT POLICY.\n\n4. COMMANDING OFFICERS SHALL ENSURE ALL ELIGIBLE MARINES ARE COUNSELED ON THEIR JEPES SCORES AND AREAS FOR IMPROVEMENT.',
    whatItMeans:
      'The cutting score for your MOS (0311) to make Corporal dropped 20 points to 780. This means you need fewer points to promote. With your current JEPES of 718, you are now 62 points away instead of 82. Focus on completing MCIs on MarineNet and earning MOS qualification points to close the remaining gap.',
  },
  {
    id: 2,
    number: 'MARADMIN 038/25',
    date: 'Feb 3, 2025',
    title: 'PME Requirements Update for FY25',
    summary:
      'Clarifies Professional Military Education completion requirements and JEPES score points for promotion eligibility.',
    tag: 'PME',
    affectsScore: true,
    fullText:
      'R 031400Z FEB 25\nFM CMC WASHINGTON DC\nTO AL MARADMIN\nSUBJ/FY25 PROFESSIONAL MILITARY EDUCATION REQUIREMENTS UPDATE\n\n1. THIS MARADMIN UPDATES PME REQUIREMENTS FOR JEPES SCORE CALCULATION.\n\n2. EFFECTIVE IMMEDIATELY, MARINES WHO COMPLETE THE CORPORALS COURSE WILL RECEIVE AN ADDITIONAL 50 JEPES SCORE POINTS.\n\n3. THE CORPORALS COURSE IS AVAILABLE VIA MARINENET AND MUST BE COMPLETED PRIOR TO THE CUTTING SCORE EFFECTIVE DATE TO COUNT TOWARD THAT QUARTER.\n\n4. COMMANDING OFFICERS WILL ENSURE ALL ELIGIBLE MARINES ARE ENROLLED AND TRACKING TOWARD COMPLETION.',
    whatItMeans:
      "Completing the Corporals Course on MarineNet now gives you 50 extra points on your JEPES score. Since you haven't started it yet, this is one of the fastest ways to close the 78-point gap to the cutting score. Start the course as soon as possible to have it count for next quarter's scores.",
  },
  {
    id: 3,
    number: 'MARADMIN 032/25',
    date: 'Jan 20, 2025',
    title: 'PFT/CFT Season Dates for CY2025',
    summary:
      'Announces the semi-annual PFT and CFT testing windows and reporting deadlines for Calendar Year 2025.',
    tag: 'Policy',
    affectsScore: false,
    fullText:
      'R 201000Z JAN 25\nFM CMC WASHINGTON DC\nTO AL MARADMIN\nSUBJ/CY2025 PHYSICAL FITNESS TEST AND COMBAT FITNESS TEST SCHEDULE\n\n1. THE FOLLOWING PFT/CFT TESTING WINDOWS ARE ESTABLISHED FOR CY2025:\n   A. PFT: 1 JAN - 30 JUN 2025\n   B. CFT: 1 JUL - 31 DEC 2025\n\n2. ALL SCORES MUST BE ENTERED INTO MCTFS NLT 15 DAYS AFTER THE TEST DATE.\n\n3. COMMANDERS WILL ENSURE ALL MARINES COMPLETE REQUIRED TESTING WITHIN THE DESIGNATED WINDOWS.',
    whatItMeans:
      'PFT season runs January through June 2025. You still have time to take another PFT this season if you want to improve your score of 271. A higher PFT score directly increases your JEPES score for promotion.',
  },
  {
    id: 4,
    number: 'MARADMIN 028/25',
    date: 'Jan 10, 2025',
    title: 'Tuition Assistance Policy Update',
    summary:
      'Updates to the Marine Corps Tuition Assistance program including increased annual caps and eligible programs.',
    tag: 'Policy',
    affectsScore: false,
    fullText:
      'R 101300Z JAN 25\nFM CMC WASHINGTON DC\nTO AL MARADMIN\nSUBJ/FY25 TUITION ASSISTANCE PROGRAM UPDATE\n\n1. EFFECTIVE 1 FEB 2025, THE ANNUAL TUITION ASSISTANCE CAP IS INCREASED TO $4,500 PER FISCAL YEAR.\n\n2. ELIGIBLE MARINES MAY USE TA FOR UNDERGRADUATE AND GRADUATE COURSES AT ACCREDITED INSTITUTIONS.\n\n3. MARINES MUST MAINTAIN A CUMULATIVE GPA OF 2.0 OR HIGHER.\n\n4. REQUESTS ARE SUBMITTED THROUGH THE JOINT SERVICES TRANSCRIPT PORTAL.',
    whatItMeans:
      'The military will pay up to $4,500 per year for college courses. While this does not directly affect your promotion score, education is valued during promotion boards at higher ranks. Consider starting classes if you have the time.',
  },
  {
    id: 5,
    number: 'MARADMIN 022/25',
    date: 'Jan 5, 2025',
    title: 'Updated Body Composition Standards',
    summary:
      'Revises body composition and military appearance program standards effective immediately.',
    tag: 'Policy',
    affectsScore: false,
    fullText:
      'R 051500Z JAN 25\nFM CMC WASHINGTON DC\nTO AL MARADMIN\nSUBJ/UPDATED BODY COMPOSITION AND MILITARY APPEARANCE PROGRAM\n\n1. THIS MARADMIN UPDATES MCO 6110.3A REGARDING BODY COMPOSITION STANDARDS.\n\n2. MAXIMUM BODY FAT PERCENTAGES REMAIN UNCHANGED: 18% FOR MALES AGED 17-26.\n\n3. UPDATED TAPING PROCEDURES ARE EFFECTIVE IMMEDIATELY.\n\n4. MARINES WHO EXCEED STANDARDS WILL BE PLACED ON BCP IAW CURRENT POLICY.',
    whatItMeans:
      'Body composition standards have been updated with new measurement procedures. This does not directly change your promotion composite, but staying within standards is required to be promotion-eligible. Maintain your fitness and you are fine.',
  },
]
