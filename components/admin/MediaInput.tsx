'use client'

import { useRef, useState } from 'react'
import { Upload, Loader2, X, ImageIcon, Film } from 'lucide-react'
import { uploadMedia } from '@/lib/media'
import { useToast } from './Toast'

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)$/i.test(url)
}

/** Single media upload with preview (used for logo, hero image, cover, etc.) */
export function SingleMediaInput({
  value,
  onChange,
  folder = 'uploads',
  accept = 'image/*',
  label = 'Upload',
}: {
  value?: string
  onChange: (url: string) => void
  folder?: string
  accept?: string
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleFile(file: File) {
    setLoading(true)
    try {
      const { url } = await uploadMedia(file, folder)
      onChange(url)
      toast('Media uploaded', 'success')
    } catch (err) {
      toast('Upload failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          {isVideo(value) ? (
            <video
              src={value}
              className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
              muted
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value || '/placeholder.svg'}
              alt="Preview"
              className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Remove media"
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            e.target.value = ''
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-navy hover:bg-lightgrey disabled:opacity-60 transition"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Upload size={16} />
          )}
          {loading ? 'Uploading...' : label}
        </button>
      </div>
    </div>
  )
}

/** Multi-file media upload returning an array of urls. */
export function MultiMediaInput({
  values,
  onChange,
  folder = 'uploads',
  accept = 'image/*,video/*',
}: {
  values: string[]
  onChange: (urls: string[]) => void
  folder?: string
  accept?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleFiles(files: FileList) {
    setLoading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const { url } = await uploadMedia(file, folder)
        uploaded.push(url)
      }
      onChange([...values, ...uploaded])
      toast(`${uploaded.length} file(s) uploaded`, 'success')
    } catch {
      toast('Some uploads failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={url + i} className="relative">
            {isVideo(url) ? (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-gray-200 bg-navy">
                <Film className="text-white" size={22} />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url || '/placeholder.svg'}
                alt={`Media ${i + 1}`}
                className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              aria-label="Remove"
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-skyblue hover:text-skyblue disabled:opacity-60 transition"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <ImageIcon size={20} />
          )}
          <span className="text-xs">{loading ? 'Uploading' : 'Add'}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
