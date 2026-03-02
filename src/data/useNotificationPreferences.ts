import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export type NotificationTier = 'critical_only' | 'all'

export interface NotificationPreferences {
  push_enabled: boolean
  tier: NotificationTier
  topic_mos_cutoff: boolean
  topic_rank_requirements: boolean
  topic_policy_changes: boolean
  quiet_hours_enabled: boolean
  quiet_hours_start: string
  quiet_hours_end: string
  badge_enabled: boolean
  weekly_summary: boolean
}

const DEFAULT_PREFS: NotificationPreferences = {
  push_enabled: false,
  tier: 'critical_only',
  topic_mos_cutoff: true,
  topic_rank_requirements: true,
  topic_policy_changes: true,
  quiet_hours_enabled: false,
  quiet_hours_start: '21:00',
  quiet_hours_end: '06:00',
  badge_enabled: true,
  weekly_summary: false,
}

function getDeviceId(): string {
  const key = 'waypoints_device_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export function useNotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const userId = getDeviceId()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (!error && data) {
        setPrefs({
          push_enabled: data.push_enabled,
          tier: data.tier as NotificationTier,
          topic_mos_cutoff: data.topic_mos_cutoff,
          topic_rank_requirements: data.topic_rank_requirements,
          topic_policy_changes: data.topic_policy_changes,
          quiet_hours_enabled: data.quiet_hours_enabled,
          quiet_hours_start: data.quiet_hours_start,
          quiet_hours_end: data.quiet_hours_end,
          badge_enabled: data.badge_enabled,
          weekly_summary: data.weekly_summary,
        })
      }
      setLoading(false)
    }
    load()
  }, [userId])

  const save = useCallback(async (updated: NotificationPreferences) => {
    setSaving(true)
    await supabase
      .from('notification_preferences')
      .upsert(
        { user_id: userId, ...updated, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      )
    setPrefs(updated)
    setSaving(false)
    setSavedAt(Date.now())
  }, [userId])

  return { prefs, loading, saving, savedAt, save }
}
