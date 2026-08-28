'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import * as Icons from 'lucide-react'
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
import type { Service } from '@/lib/cms-types'

const emptyForm = { title: '', description: '', icon: 'Droplets' }

export default function ServicesEditor() {
  const { items, isLoading, insert, update, remove } =
    useCollection<Service>('services')
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(s: Service) {
    setEditing(s)
    setForm({
      title: s.title,
      description: s.description ?? '',
      icon: s.icon ?? 'Droplets',
    })
    setOpen(true)
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast('Title is required', 'error')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await update(editing.id, form)
        toast('Service updated', 'success')
      } else {
        await insert({ ...form, sort_order: items.length })
        toast('Service added', 'success')
      }
      setOpen(false)
    } catch {
      toast('Could not save service', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(s: Service) {
    if (!confirm(`Delete "${s.title}"?`)) return
    try {
      await remove(s.id)
      toast('Service deleted', 'success')
    } catch {
      toast('Could not delete', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage the service cards shown on your site."
        action={
          <Button onClick={openNew}>
            <Plus size={16} /> Add Service
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <EmptyState message="No services yet. Add your first service." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => {
            const Icon =
              (Icons[s.icon as keyof typeof Icons] as React.ComponentType<{
                size?: number
                className?: string
              }>) || Icons.Droplets
            return (
              <Card key={s.id} className="flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-skyblue/10 flex items-center justify-center mb-3">
                  <Icon className="text-skyblue" size={22} />
                </div>
                <h3 className="font-semibold text-navy">{s.title}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-3">
                  {s.description}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" onClick={() => openEdit(s)}>
                    <Pencil size={15} /> Edit
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(s)}>
                    <Trash2 size={15} className="text-red-500" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Service' : 'Add Service'}
      >
        <div className="space-y-4">
          <Field label="Title">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Borehole Drilling"
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe this service..."
            />
          </Field>
          <Field
            label="Icon name"
            hint="Any Lucide icon name, e.g. Droplets, Wrench, Hammer, Truck, Sprout."
          >
            <Input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="Droplets"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? 'Update' : 'Add'} Service
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
