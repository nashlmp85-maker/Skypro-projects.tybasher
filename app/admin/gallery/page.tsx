'use client'

import { useState } from 'react'
import { Trash2, GripVertical, Film } from 'lucide-react'
import { Reorder } from 'framer-motion'
import { PageHeader, Card, Field, Input, Button, EmptyState } from '@/components/admin/ui'
import { MultiMediaInput } from '@/components/admin/MediaInput'
import { useToast } from '@/components/admin/Toast'
import { useCollection } from '@/lib/use-collection'
import { createClient } from '@/lib/supabase/client'
import type { GalleryItem } from '@/lib/cms-types'

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)$/i.test(url)
}

export default function GalleryEditor() {
  const { items, isLoading, mutate, insert, remove } =
    useCollection<GalleryItem>('gallery')
  const { toast } = useToast()
  const [category, setCategory] = useState('')
  const [order, setOrder] = useState<GalleryItem[] | null>(null)

  const list = order ?? items

  async function handleUpload(urls: string[]) {
    try {
      const supabase = createClient()
      const rows = urls.map((url, i) => ({
        url,
        type: isVideo(url) ? 'video' : 'image',
        category: category || null,
        sort_order: items.length + i,
      }))
      const { error } = await supabase.from('gallery').insert(rows)
      if (error) throw error
      await mutate()
      toast('Added to gallery', 'success')
    } catch {
      toast('Could not add media', 'error')
    }
  }

  async function handleDelete(item: GalleryItem) {
    try {
      await remove(item.id)
      toast('Removed', 'success')
    } catch {
      toast('Could not remove', 'error')
    }
  }

  async function saveOrder() {
    if (!order) return
    try {
      const supabase = createClient()
      await Promise.all(
        order.map((item, i) =>
          supabase.from('gallery').update({ sort_order: i }).eq('id', item.id),
        ),
      )
      await mutate()
      setOrder(null)
      toast('Order saved', 'success')
    } catch {
      toast('Could not save order', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Upload images and videos, organize by category, and drag to reorder."
        action={
          order && (
            <Button onClick={saveOrder}>Save New Order</Button>
          )
        }
      />

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Field
            label="Category (optional)"
            hint="Applied to files you upload next, e.g. Boreholes, Construction."
          >
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Boreholes"
            />
          </Field>
        </div>
        <div className="mt-4">
          <MultiMediaInput values={[]} onChange={handleUpload} folder="gallery" />
        </div>
      </Card>

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : list.length === 0 ? (
        <EmptyState message="Gallery is empty. Upload your first media." />
      ) : (
        <Reorder.Group
          axis="y"
          values={list}
          onReorder={setOrder}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="relative flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-2 shadow-sm cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="text-gray-300 shrink-0" size={18} />
              {isVideo(item.url) ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-navy shrink-0">
                  <Film className="text-white" size={20} />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url || '/placeholder.svg'}
                  alt={item.caption ?? 'Gallery item'}
                  className="h-16 w-16 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-navy truncate">
                  {item.category || 'Uncategorized'}
                </p>
                <p className="text-xs text-gray-400 capitalize">{item.type}</p>
              </div>
              <button
                onClick={() => handleDelete(item)}
                aria-label="Delete"
                className="rounded-lg p-2 hover:bg-red-50 shrink-0"
              >
                <Trash2 size={15} className="text-red-500" />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}
