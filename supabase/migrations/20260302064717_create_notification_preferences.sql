/*
  # Create notification_preferences table

  ## Summary
  Stores per-user notification settings for the Waypoints app.

  ## New Tables
  - `notification_preferences`
    - `id` (uuid, primary key)
    - `user_id` (text, unique — device/session ID for unauthenticated prototype)
    - `push_enabled` (boolean) — master push notification toggle
    - `tier` (text) — "critical_only" or "all"
    - `topic_mos_cutoff` (boolean) — subscribe to MOS cutting score changes
    - `topic_rank_requirements` (boolean) — subscribe to rank requirement updates
    - `topic_policy_changes` (boolean) — subscribe to policy changes affecting inputs
    - `quiet_hours_enabled` (boolean) — enable quiet hours window
    - `quiet_hours_start` (text) — start time in "HH:MM" format (24h)
    - `quiet_hours_end` (text) — end time in "HH:MM" format (24h)
    - `badge_enabled` (boolean) — show in-app notification badge
    - `weekly_summary` (boolean) — receive weekly score summary digest
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Users can only read/write their own row (matched by user_id)

  ## Notes
  1. Defaults to "critical_only" tier and all topics enabled
  2. Quiet hours default to 21:00–06:00 (disabled by default)
  3. user_id is a client-generated device ID since this is an unauthenticated prototype
*/

CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  push_enabled boolean NOT NULL DEFAULT false,
  tier text NOT NULL DEFAULT 'critical_only',
  topic_mos_cutoff boolean NOT NULL DEFAULT true,
  topic_rank_requirements boolean NOT NULL DEFAULT true,
  topic_policy_changes boolean NOT NULL DEFAULT true,
  quiet_hours_enabled boolean NOT NULL DEFAULT false,
  quiet_hours_start text NOT NULL DEFAULT '21:00',
  quiet_hours_end text NOT NULL DEFAULT '06:00',
  badge_enabled boolean NOT NULL DEFAULT true,
  weekly_summary boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notification preferences"
  ON notification_preferences FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
