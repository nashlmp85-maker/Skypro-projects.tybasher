'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
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
import { useToast } from '@/components/admin/Toast'
import { useCollection } from '@/lib/use-collection'
import type { Testimonial } from '@/lib/cms-types'

const emptyForm = {
  name: '',
  review: '',
  rating: 5,
  location: '',
  project_type: '',
}

function Stars({
  value,
  onChange,
}: {
  value: number
  onChange?: (v: number) => void
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${n} star`}
        >
          <Star
            size={onChange ? 24 : 16}
            className={
              n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  )
}

export default function TestimonialsEditor() {
  const { items, isLoading, insert, update, remove } =
    useCollection<Testimonial>('testimonials')
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(t: Testimonial) {
    setEditing(t)
    setForm({
      name: t.name,
      review: t.review ?? '',
      rating: t.rating,
      location: t.location ?? '',
      project_type: t.project_type ?? '',
    })
    setOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return toast('Name is required', 'error')
    setSaving(true)
    try {
      if (editing) {
        await update(editing.id, form)
        toast('Testimonial updated', 'success')
      } else {
        await insert({ ...form, sort_order: items.length })
        toast('Testimonial added', 'success')
      }
      setOpen(false)
    } catch {
      toast('Could not save', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(t: Testimonial) {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return
    try {
      await remove(t.id)
      toast('Deleted', 'success')
    } catch {
      toast('Could not delete', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Customer reviews shown on your site."
        action={
          <Button onClick={openNew}>
            <Plus size={16} /> Add Testimonial
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <EmptyState message="No testimonials yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card key={t.id} className="flex flex-col">
              <Stars value={t.rating} />
              <p className="text-sm text-gray-600 mt-3 flex-1 italic">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="mt-4">
                <p className="font-semibold text-navy">{t.name}</p>
                <p className="text-xs text-gray-400">
                  {[t.project_type, t.location].filter(Boolean).join(' • ')}
                </p>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <Button variant="ghost" onClick={() => openEdit(t)}>
                  <Pencil size={15} /> Edit
                </Button>
                <button
                  onClick={() => handleDelete(t)}
                  aria-label="Delete"
                  className="ml-auto rounded-lg p-2.5 hover:bg-red-50"
                >
                  <Trash2 size={15} className="text-red-500" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <div className="space-y-4">
          <Field label="Customer Name">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Rating">
            <Stars
              value={form.rating}
              onChange={(rating) => setForm({ ...form, rating })}
            />
          </Field>
          <Field label="Review">
            <Textarea
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location">
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Harare"
              />
            </Field>
            <Field label="Project Type">
              <Input
                value={form.project_type}
                onChange={(e) =>
                  setForm({ ...form, project_type: e.target.value })
                }
                placeholder="Borehole Drilling"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
