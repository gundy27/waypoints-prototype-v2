import {
  BookOpen, Dumbbell, Target, Award, Calendar, Star,
  FileText, GraduationCap, PiggyBank, Map, Flag,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { WaypointIcon } from '../data/waypoints'

export const WAYPOINT_ICONS: Record<WaypointIcon, LucideIcon> = {
  book: BookOpen,
  dumbbell: Dumbbell,
  target: Target,
  award: Award,
  calendar: Calendar,
  star: Star,
  file: FileText,
  graduation: GraduationCap,
  piggy: PiggyBank,
  map: Map,
  flag: Flag,
}
