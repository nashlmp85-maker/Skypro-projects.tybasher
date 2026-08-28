'use client'

import { createClient } from '@/lib/supabase/client'

/** Load a single site_settings value by key. Returns {} if not set. */
export async function loadSettings<T = Record<string, unknown>>(
  key: string,
): Promise<T> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error) throw error
  return (data?.value ?? {}) as T
}

/** Upsert a single site_settings value by key. */
export async function saveSettings(
  key: string,
  value: Record<string, unknown>,
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })
  if (error) throw error
}
