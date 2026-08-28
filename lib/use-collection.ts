'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

/** Generic SWR-backed collection loader ordered by sort_order then created_at. */
export function useCollection<T>(table: string) {
  const { data, error, isLoading, mutate } = useSWR<T[]>(
    `collection:${table}`,
    async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as T[]
    },
  )

  const supabase = createClient()

  async function insert(row: Record<string, unknown>) {
    const { error } = await supabase.from(table).insert(row)
    if (error) throw error
    await mutate()
  }

  async function update(id: string, row: Record<string, unknown>) {
    const { error } = await supabase.from(table).update(row).eq('id', id)
    if (error) throw error
    await mutate()
  }

  async function remove(id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
    await mutate()
  }

  return { items: data ?? [], error, isLoading, mutate, insert, update, remove }
}

/** Slugify a string for slug fields. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
