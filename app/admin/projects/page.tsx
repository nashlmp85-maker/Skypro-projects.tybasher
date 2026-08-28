'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
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
import { SingleMediaInput, MultiMediaInput } from '@/components/admin/MediaInput'
import { useToast } from '@/components/admin/Toast'
import { useCollection, slugify } from '@/lib/use-collection'
import type { Project } from '@/lib/cms-types'

type FormState = {
  title: string
  slug: string
  category: string
  date: string
  excerpt: string
  description: string
  cover: string
  images: string[]
  videos: string[]
  client_testimonial: string
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  category: '',
  date: '',
  excerpt: '',
  description: '',
  cover: '',
  images: [],
  videos: [],
  client_testimonial: '',
}

export default function ProjectsEditor() {
  const { items, isLoading, insert, update, remove } =
    useCollection<Project>('projects')
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setSlugTouched(false)
    setOpen(true)
  }

  function openEdit(p: Project) {
    setEditing(p)
    setForm({
      title: p.title,
      slug: p.slug,
      category: p.category ?? '',
      date: p.date ?? '',
      excerpt: p.excerpt ?? '',
      description: p.description ?? '',
      cover: p.cover ?? '',
      images: p.images ?? [],
      videos: p.videos ?? [],
      client_testimonial: p.client_testimonial ?? '',
    })
    setSlugTouched(true)
    setOpen(true)
  }

  function onTitle(v: string) {
    setForm((prev) => ({
      ...prev,
      title: v,
      slug: slugTouched ? prev.slug : slugify(v),
    }))
  }

  async function handleSave() {
    if (!form.title.trim()) return toast('Title is required', 'error')
    const slug = form.slug.trim() || slugify(form.title)
    setSaving(true)
    try {
      const payload = {
        ...form,
        slug,
        date: form.date || null,
        cover: form.cover || form.images[0] || null,
      }
      if (editing) {
        await update(editing.id, payload)
        toast('Project updated', 'success')
      } else {
        await insert({ ...payload, sort_order: items.length })
        toast('Project added', 'success')
      }
      setOpen(false)
    } catch (err) {
      const msg =
        err instanceof Error && err.message.includes('duplicate')
          ? 'That slug is already used. Choose another.'
          : 'Could not save project'
      toast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(p: Project) {
    if (!confirm(`Delete "${p.title}"?`)) return
    try {
      await remove(p.id)
      toast('Project deleted', 'success')
    } catch {
      toast('Could not delete', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Each project gets its own page on the live site."
        action={
          <Button onClick={openNew}>
            <Plus size={16} /> Add Project
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <EmptyState message="No projects yet. Add your first project." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Card key={p.id} className="flex flex-col p-0 overflow-hidden">
              <div className="h-40 bg-lightgrey">
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.cover || '/placeholder.svg'}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300 text-sm">
                    No cover image
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                {p.category && (
                  <span className="text-xs font-medium text-skyblue">
                    {p.category}
                  </span>
                )}
                <h3 className="font-semibold text-navy mt-0.5">{p.title}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-2">
                  {p.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="ghost" onClick={() => openEdit(p)}>
                    <Pencil size={15} /> Edit
                  </Button>
                  <Link
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    <ExternalLink size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p)}
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
        title={editing ? 'Edit Project' : 'Add Project'}
      >
        <div className="space-y-4">
          <Field label="Title">
            <Input value={form.title} onChange={(e) => onTitle(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setForm({ ...form, slug: e.target.value })
                }}
              />
            </Field>
            <Field label="Category">
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Borehole"
              />
            </Field>
          </div>
          <Field label="Date">
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>
          <Field label="Short excerpt">
            <Input
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="One-line summary for cards"
            />
          </Field>
          <Field label="Full description">
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Field>
          <Field label="Cover image">
            <SingleMediaInput
              value={form.cover}
              onChange={(url) => setForm({ ...form, cover: url })}
              folder="projects"
            />
          </Field>
          <Field label="Gallery images & videos">
            <MultiMediaInput
              values={form.images}
              onChange={(urls) => setForm({ ...form, images: urls })}
              folder="projects"
            />
          </Field>
          <Field label="Client testimonial">
            <Textarea
              value={form.client_testimonial}
              onChange={(e) =>
                setForm({ ...form, client_testimonial: e.target.value })
              }
              placeholder="What the client said..."
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? 'Update' : 'Add'} Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
