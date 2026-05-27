// ── Log primitives ───────────────────────────────────────────────────
// Structured, low-friction capture from the global "+" overlay. On save a
// log appends to My Journey, updates the Objective gap/waypoint, and
// becomes context for the AI layer.

import { CURRENT_DATE } from './promotionTimeline'
import type { WaypointIcon } from './waypoints'

export type LogTypeId =
  | 'fitness'
  | 'eval'
  | 'pme'
  | 'award'
  | 'weapons'
  | 'journal'
  | 'bodycomp'

export type LogFieldKind = 'number' | 'text' | 'select' | 'date'

export interface LogField {
  key: string
  label: string
  kind: LogFieldKind
  placeholder?: string
  options?: string[]
  optional?: boolean
}

export interface LogTypeDef {
  id: LogTypeId
  label: string
  description: string
  icon: WaypointIcon
  /** Top-5 launch log types float to the top of the sheet. */
  primary: boolean
  fields: LogField[]
  summarize: (data: Record<string, string | number>) => string
}

export interface LogEntry {
  id: string
  type: LogTypeId
  title: string
  date: string // ISO yyyy-mm-dd
  data: Record<string, string | number>
  icon: WaypointIcon
  sourceSurface: string
}

export const LOG_TYPES: LogTypeDef[] = [
  {
    id: 'fitness',
    label: 'Fitness Test',
    description: 'PFT, CFT, ACFT, PRT, PT Test, or PFA',
    icon: 'dumbbell',
    primary: true,
    fields: [
      { key: 'test', label: 'Test', kind: 'select', options: ['PFT', 'CFT', 'ACFT', 'PRT', 'PT Test', 'PFA'] },
      { key: 'score', label: 'Total Score', kind: 'number', placeholder: '285' },
      { key: 'date', label: 'Test Date', kind: 'date' },
    ],
    summarize: d => `${d.test ?? 'Fitness'} ${d.score ?? ''}`.trim(),
  },
  {
    id: 'eval',
    label: 'Evaluation',
    description: 'FITREP, OPR, NCOER, or EVAL submitted',
    icon: 'file',
    primary: true,
    fields: [
      { key: 'kind', label: 'Type', kind: 'select', options: ['FITREP', 'OPR', 'NCOER', 'EVAL', 'EPR'] },
      { key: 'period', label: 'Period', kind: 'text', placeholder: 'Annual FY26' },
      { key: 'date', label: 'Submitted', kind: 'date' },
    ],
    summarize: d => `${d.kind ?? 'Eval'} submitted${d.period ? ` (${d.period})` : ''}`,
  },
  {
    id: 'pme',
    label: 'PME / School',
    description: 'Course, school, or professional military education',
    icon: 'graduation',
    primary: true,
    fields: [
      { key: 'name', label: 'Course', kind: 'text', placeholder: 'Corporals Course' },
      { key: 'date', label: 'Completed', kind: 'date' },
    ],
    summarize: d => `Completed ${d.name ?? 'a course'}`,
  },
  {
    id: 'award',
    label: 'Award / Ribbon',
    description: 'Decoration, ribbon, or citation received',
    icon: 'award',
    primary: true,
    fields: [
      { key: 'name', label: 'Award', kind: 'text', placeholder: 'Navy & Marine Corps Achievement Medal' },
      { key: 'date', label: 'Date', kind: 'date' },
      { key: 'citation', label: 'Citation (optional)', kind: 'text', optional: true },
    ],
    summarize: d => `Earned ${d.name ?? 'an award'}`,
  },
  {
    id: 'weapons',
    label: 'Weapons Qual',
    description: 'Rifle or weapon qualification',
    icon: 'target',
    primary: true,
    fields: [
      { key: 'weapon', label: 'Weapon', kind: 'text', placeholder: 'Rifle' },
      { key: 'level', label: 'Qualification', kind: 'select', options: ['Expert', 'Sharpshooter', 'Marksman'] },
      { key: 'date', label: 'Date', kind: 'date' },
    ],
    summarize: d => `${d.weapon ?? 'Weapon'} — ${d.level ?? 'qualified'}`,
  },
  {
    id: 'journal',
    label: 'Journal Entry',
    description: 'A note for your record',
    icon: 'file',
    primary: false,
    fields: [
      { key: 'note', label: 'Note', kind: 'text', placeholder: "What happened?" },
      { key: 'date', label: 'Date', kind: 'date' },
    ],
    summarize: d => String(d.note ?? 'Journal entry'),
  },
  {
    id: 'bodycomp',
    label: 'Body Weight',
    description: 'Weight or body-composition check (voluntary)',
    icon: 'target',
    primary: false,
    fields: [
      { key: 'weight', label: 'Weight (lb)', kind: 'number', placeholder: '178' },
      { key: 'date', label: 'Date', kind: 'date' },
    ],
    summarize: d => `Logged weight ${d.weight ?? ''} lb`.trim(),
  },
]

export function getLogType(id: LogTypeId): LogTypeDef | null {
  return LOG_TYPES.find(t => t.id === id) ?? null
}

export function buildLogEntry(
  typeId: LogTypeId,
  data: Record<string, string | number>,
  sourceSurface = 'log_overlay',
): LogEntry {
  const def = getLogType(typeId) ?? LOG_TYPES[0]
  const date = typeof data.date === 'string' && data.date ? data.date : CURRENT_DATE.toISOString().slice(0, 10)
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: typeId,
    title: def.summarize(data),
    date,
    data,
    icon: def.icon,
    sourceSurface,
  }
}
