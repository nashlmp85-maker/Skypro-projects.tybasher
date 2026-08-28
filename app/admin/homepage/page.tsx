'use client'

import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { PageHeader, Card, Field, Input, Textarea, Button } from '@/components/admin/ui'
import { SingleMediaInput } from '@/components/admin/MediaInput'
import { useToast } from '@/components/admin/Toast'
import { loadSettings, saveSettings } from '@/lib/settings'
import { SETTINGS_KEYS, type HomepageSettings } from '@/lib/cms-types'

export default function HomepageEditor() {
  const { toast } = useToast()
  const { data, isLoading, mutate } = useSWR(SETTINGS_KEYS.homepage, () =>
    loadSettings<HomepageSettings>(SETTINGS_KEYS.homepage),
  )
  const [form, setForm] = useState<HomepageSettings>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const set = (k: keyof HomepageSettings, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  async function handleSave() {
    setSaving(true)
    try {
      await saveSettings(SETTINGS_KEYS.homepage, form)
      await mutate(form, false)
      toast('Homepage saved. Changes are live.', 'success')
    } catch {
      toast('Could not save. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <PageHeader
        title="Homepage"
        description="Edit branding, hero content, buttons and colors."
        action={
          <Button onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-navy mb-4">Branding</h2>
          <div className="space-y-4">
            <Field label="Logo">
              <SingleMediaInput
                value={form.logo}
                onChange={(url) => set('logo', url)}
                folder="branding"
                label="Upload logo"
              />
            </Field>
            <Field label="Business Name">
              <Input
                value={form.businessName ?? ''}
                onChange={(e) => set('businessName', e.target.value)}
                placeholder="Skypro Projects"
              />
            </Field>
            <Field label="Tagline">
              <Input
                value={form.tagline ?? ''}
                onChange={(e) => set('tagline', e.target.value)}
                placeholder="Smart Water Solutions"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-navy mb-4">Brand Colors</h2>
          <div className="space-y-4">
            <Field label="Primary (Sky Blue)">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.brandColor ?? '#0B72E7'}
                  onChange={(e) => set('brandColor', e.target.value)}
                  className="h-10 w-14 rounded border border-gray-300"
                />
                <Input
                  value={form.brandColor ?? '#0B72E7'}
                  onChange={(e) => set('brandColor', e.target.value)}
                />
              </div>
            </Field>
            <Field label="Secondary (Navy)">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.navyColor ?? '#0A2540'}
                  onChange={(e) => set('navyColor', e.target.value)}
                  className="h-10 w-14 rounded border border-gray-300"
                />
                <Input
                  value={form.navyColor ?? '#0A2540'}
                  onChange={(e) => set('navyColor', e.target.value)}
                />
              </div>
            </Field>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-navy mb-4">Hero Section</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Hero Heading">
              <Input
                value={form.heroHeading ?? ''}
                onChange={(e) => set('heroHeading', e.target.value)}
                placeholder="Building the Future, One Project at a Time"
              />
            </Field>
            <Field label="Hero Subheading">
              <Input
                value={form.heroSubheading ?? ''}
                onChange={(e) => set('heroSubheading', e.target.value)}
                placeholder="Borehole Drilling • Irrigation • Construction"
              />
            </Field>
            <Field label="Hero Image">
              <SingleMediaInput
                value={form.heroImage}
                onChange={(url) => set('heroImage', url)}
                folder="hero"
                label="Upload image"
              />
            </Field>
            <Field label="Hero Video (optional)">
              <SingleMediaInput
                value={form.heroVideo}
                onChange={(url) => set('heroVideo', url)}
                folder="hero"
                accept="video/*"
                label="Upload video"
              />
            </Field>
            <Field label="Background Image (optional)">
              <SingleMediaInput
                value={form.backgroundImage}
                onChange={(url) => set('backgroundImage', url)}
                folder="hero"
                label="Upload background"
              />
            </Field>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-navy mb-4">
            Call-to-action Buttons
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary Button Text">
              <Input
                value={form.primaryButtonText ?? ''}
                onChange={(e) => set('primaryButtonText', e.target.value)}
                placeholder="Call: 071 490 9020"
              />
            </Field>
            <Field label="Primary Button Link">
              <Input
                value={form.primaryButtonLink ?? ''}
                onChange={(e) => set('primaryButtonLink', e.target.value)}
                placeholder="tel:0714909020"
              />
            </Field>
            <Field label="Secondary Button Text">
              <Input
                value={form.secondaryButtonText ?? ''}
                onChange={(e) => set('secondaryButtonText', e.target.value)}
                placeholder="WhatsApp"
              />
            </Field>
            <Field label="Secondary Button Link">
              <Input
                value={form.secondaryButtonLink ?? ''}
                onChange={(e) => set('secondaryButtonLink', e.target.value)}
                placeholder="https://wa.me/..."
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  )
}
