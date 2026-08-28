'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Play } from 'lucide-react'
import {
  PageHeader,
  Card,
  Field,
  Input,
  Textarea,
  Button,
  EmptyState,
} from '@/components/admin/ui'
import Modal from '@/components/admin/Modal'
import { SingleMediaInput } from '@/components/admin/MediaInput'
import { useToast } from '@/components/admin/Toast'
import { useCollection } from '@/lib/use-collection'
import type { VideoItem } from '@/lib/cms-types'

type Source = 'upload' | 'youtube' | 'facebook' | 'tiktok'

function detectSource(url: string): Source {
  if (/youtu\.?be/.test(url)) return 'youtube'
  if (/facebook\.com|fb\.watch/.test(url)) return 'facebook'
  if (/tiktok\.com/.test(url)) return 'tiktok'
  return 'upload'
}

const emptyForm = {
  title: '',
  description: '',
  url: '',
  source: 'upload' as Source,
  thumbnail: '',
}

export default function VideosEditor() {
  const { items, isLoading, insert, update, remove } =
    useCollection<VideoItem>('videos')
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VideoItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [mode, setMode] = useState<'upload' | 'link'>('link')
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setMode('link')
    setOpen(true)
  }

  function openEdit(v: VideoItem) {
    setEditing(v)
    setForm({
      title: v.title,
      description: v.description ?? '',
      url: v.url,
      source: v.source,
      thumbnail: v.thumbnail ?? '',
    })
    setMode(v.source === 'upload' ? 'upload' : 'link')
    setOpen(true)
  }

  async function handleSave() {
    if (!form.title.trim()) return toast('Title is required', 'error')
    if (!form.url.trim()) return toast('A video URL or upload is required', 'error')
    setSaving(true)
    try {
      const source = mode === 'upload' ? 'upload' : detectSource(form.url)
      const payload = { ...form, source }
      if (editing) {
        await update(editing.id, payload)
        toast('Video updated', 'success')
      } else {
        await insert({ ...payload, sort_order: items.length })
        toast('Video added', 'success')
      }
      setOpen(false)
    } catch {
      toast('Could not save video', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(v: VideoItem) {
    if (!confirm(`Delete "${v.title}"?`)) return
    try {
      await remove(v.id)
      toast('Video deleted', 'success')
    } catch {
      toast('Could not delete', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Videos"
        description="Upload MP4 files or paste YouTube, Facebook, or TikTok links."
        action={
          <Button onClick={openNew}>
            <Plus size={16} /> Add Video
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <EmptyState message="No videos yet. Add your first video." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v) => (
            <Card key={v.id} className="flex flex-col p-0 overflow-hidden">
              <div className="relative h-40 bg-navy flex items-center justify-center">
                {v.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.thumbnail || '/placeholder.svg'}
                    alt={v.title}
                    className="h-full w-full object-cover opacity-80"
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-skyblue/90 flex items-center justify-center">
                    <Play className="text-white ml-0.5" size={22} />
                  </div>
                </div>
                <span className="absolute top-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white capitalize">
                  {v.source}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-navy">{v.title}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-2">
                  {v.description}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" onClick={() => openEdit(v)}>
                    <Pencil size={15} /> Edit
                  </Button>
                  <button
                    onClick={() => handleDelete(v)}
                    aria-label="Delete"
                    className="ml-auto rounded-lg p-2.5 hover:bg-red-50"
                  >
                    <Trash2 size={15} className="text-red-500" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Video' : 'Add Video'}
      >
        <div className="space-y-4">
          <Field label="Title">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Field>

          <div className="flex gap-2 rounded-lg bg-lightgrey p-1">
            <button
              type="button"
              onClick={() => setMode('link')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                mode === 'link' ? 'bg-white text-navy shadow-sm' : 'text-gray-500'
              }`}
            >
              Paste Link
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                mode === 'upload'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Upload MP4
            </button>
          </div>

          {mode === 'link' ? (
            <Field
              label="Video URL"
              hint="YouTube, Facebook, or TikTok link."
            >
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </Field>
          ) : (
            <Field label="Upload MP4">
              <SingleMediaInput
                value={form.url}
                onChange={(url) => setForm({ ...form, url })}
                folder="videos"
                accept="video/*"
                label="Upload video"
              />
            </Field>
          )}

          <Field label="Thumbnail (optional)">
            <SingleMediaInput
              value={form.thumbnail}
              onChange={(url) => setForm({ ...form, thumbnail: url })}
              folder="videos"
              label="Upload thumbnail"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? 'Update' : 'Add'} Video
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
