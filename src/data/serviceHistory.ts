// ── Service history: career map + timeline + activity stats ──────────
// Mock-only dataset powering the My Journey tab. Duty stations,
// deployments, promotions, and the enlistment feed BOTH the career
// timeline and the US-map pins (one source of truth). Stats combine this
// seeded history with live session state (logs, waypoints, objectives).

import { CURRENT_DATE } from './promotionTimeline'
import type { WaypointIcon } from './waypoints'
import type { LogEntry } from './logs'
import type { Objective } from './objectives'

export type ServiceLocationKind = 'training' | 'station' | 'deployment'
export type MapEdge = 'pacific' | 'atlantic' | 'gulf'

export interface ServiceLocation {
  id: string
  kind: ServiceLocationKind
  /** Short display name, e.g. "Camp Lejeune". */
  name: string
  /** Unit / role / operation subtitle. */
  detail: string
  /** City, state or theater. */
  place: string
  arrival: string // ISO yyyy-mm-dd
  departure: string | null // null = current
  /** Normalized 0–100 position over the US map box (x: W→E, y: N→S). */
  coords: { x: number; y: number }
  /** Overseas deployments anchor to a map edge instead of a US pin. */
  overseas?: boolean
  edge?: MapEdge
}

export interface Promotion {
  rank: string
  date: string // ISO yyyy-mm-dd
}

export interface Enlistment {
  branchShort: string
  date: string // ISO yyyy-mm-dd
  place: string
}

export type ObjectiveOutcome = 'hit' | 'switched'

export interface ObjectiveHistoryEntry {
  id: string
  label: string
  outcome: ObjectiveOutcome
  date: string // ISO yyyy-mm-dd (completed or switched-away)
  waypointsCompleted: number
}

export interface ServiceHistory {
  enlistment: Enlistment
  promotions: Promotion[]
  locations: ServiceLocation[]
  objectiveHistory: ObjectiveHistoryEntry[]
}

// ── Mock career: LCpl Martinez (Parris Island → Lejeune → Med → Pendleton)
export const martinezServiceHistory: ServiceHistory = {
  enlistment: { branchShort: 'USMC', date: '2022-06-15', place: 'Parris Island, SC' },
  promotions: [
    { rank: 'Private First Class', date: '2022-09-09' },
    { rank: 'Lance Corporal', date: '2024-08-01' },
  ],
  locations: [
    {
      id: 'loc-pi', kind: 'training', name: 'MCRD Parris Island',
      detail: 'Recruit Training', place: 'Parris Island, SC',
      arrival: '2022-06-15', departure: '2022-09-15',
      coords: { x: 79, y: 65 },
    },
    {
      id: 'loc-geiger', kind: 'training', name: 'School of Infantry',
      detail: 'SOI-East · 0311 Rifleman', place: 'Camp Geiger, NC',
      arrival: '2022-09-20', departure: '2022-12-10',
      coords: { x: 80, y: 57 },
    },
    {
      id: 'loc-lejeune', kind: 'station', name: 'Camp Lejeune',
      detail: '2nd Bn, 8th Marines', place: 'Jacksonville, NC',
      arrival: '2023-01-05', departure: '2025-05-30',
      coords: { x: 82.5, y: 60 },
    },
    {
      id: 'loc-med', kind: 'deployment', name: '26th MEU',
      detail: 'Mediterranean rotation', place: 'Mediterranean Sea',
      arrival: '2024-03-01', departure: '2024-09-15',
      coords: { x: 95, y: 44 }, overseas: true, edge: 'atlantic',
    },
    {
      id: 'loc-pendleton', kind: 'station', name: 'Camp Pendleton',
      detail: '1st Marine Division', place: 'Oceanside, CA',
      arrival: '2025-06-10', departure: null,
      coords: { x: 14, y: 63 },
    },
  ],
  objectiveHistory: [
    { id: 'oh-pfc', label: 'Make Private First Class', outcome: 'hit', date: '2022-09-09', waypointsCompleted: 3 },
    { id: 'oh-pft', label: 'Improve PFT Score', outcome: 'hit', date: '2023-12-04', waypointsCompleted: 4 },
    { id: 'oh-savings', label: 'Build Emergency Savings', outcome: 'switched', date: '2024-02-18', waypointsCompleted: 1 },
  ],
}

// ── Career timeline ──────────────────────────────────────────────────

export interface TimelineEvent {
  id: string
  date: string // ISO yyyy-mm-dd
  title: string
  subtitle?: string
  icon: WaypointIcon
}

/**
 * Unified, newest-first career timeline: enlistment, promotions, station
 * moves, deployments, and activity logs — drawn from one dataset so the
 * map pins and timeline stay in sync.
 */
export function buildCareerTimeline(history: ServiceHistory, logs: LogEntry[]): TimelineEvent[] {
  const events: TimelineEvent[] = []

  events.push({
    id: 'evt-join',
    date: history.enlistment.date,
    title: `Joined the ${history.enlistment.branchShort}`,
    subtitle: history.enlistment.place,
    icon: 'flag',
  })

  for (const p of history.promotions) {
    events.push({
      id: `evt-promo-${p.date}`,
      date: p.date,
      title: `Promoted to ${p.rank}`,
      icon: 'award',
    })
  }

  for (const loc of history.locations) {
    events.push({
      id: `evt-${loc.id}`,
      date: loc.arrival,
      title: loc.kind === 'deployment' ? `Deployed · ${loc.name}` : `Reported to ${loc.name}`,
      subtitle: `${loc.detail} · ${loc.place}`,
      icon: loc.kind === 'deployment' ? 'flag' : loc.kind === 'training' ? 'graduation' : 'map',
    })
  }

  for (const l of logs) {
    events.push({ id: l.id, date: l.date, title: l.title, icon: l.icon })
  }

  return events.sort((a, b) => (a.date < b.date ? 1 : -1))
}

// ── Activity stats ───────────────────────────────────────────────────

export interface JourneyStats {
  logs: number
  waypointsCompleted: number
  objectivesHit: number
  objectivesSwitched: number
  objectivesActive: number
}

/** Combine seeded history with live session state for the activity cards. */
export function computeJourneyStats(
  history: ServiceHistory,
  logs: LogEntry[],
  liveCompletedWaypoints: number,
  liveSwitched: number,
  activeObjective: Objective,
): JourneyStats {
  const seededWaypoints = history.objectiveHistory.reduce((s, o) => s + o.waypointsCompleted, 0)
  return {
    logs: logs.length,
    waypointsCompleted: seededWaypoints + liveCompletedWaypoints,
    objectivesHit: history.objectiveHistory.filter(o => o.outcome === 'hit').length,
    objectivesSwitched: history.objectiveHistory.filter(o => o.outcome === 'switched').length + liveSwitched,
    objectivesActive: activeObjective.status === 'active' ? 1 : 0,
  }
}

export function fmtMonthYear(iso: string): string {
  const p = iso.split('-').map(Number)
  if (p.length !== 3 || p.some(Number.isNaN)) return iso
  return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/** Years:months of service from enlistment to CURRENT_DATE. */
export function timeInService(history: ServiceHistory): string {
  const start = new Date(history.enlistment.date)
  let months = (CURRENT_DATE.getFullYear() - start.getFullYear()) * 12 + (CURRENT_DATE.getMonth() - start.getMonth())
  if (CURRENT_DATE.getDate() < start.getDate()) months -= 1
  const years = Math.floor(months / 12)
  const rem = months % 12
  return `${years}y ${rem}m`
}
