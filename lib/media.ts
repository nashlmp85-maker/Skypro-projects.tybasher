'use client'

import { createClient } from '@/lib/supabase/client'

export const MEDIA_BUCKET = 'media'

/**
 * Compress + resize an image file in the browser using a canvas before upload.
 * Non-image files (e.g. videos) are returned untouched.
 */
export async function compressImage(
  file: File,
  maxDimension = 1920,
  quality = 0.8,
): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = dataUrl
  })

  let { width, height } = img
  if (width > maxDimension || height > maxDimension) {
    if (width >= height) {
      height = Math.round((height * maxDimension) / width)
      width = maxDimension
    } else {
      width = Math.round((width * maxDimension) / height)
      height = maxDimension
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/webp', quality),
  )
  if (!blob) return file

  const newName = file.name.replace(/\.[^.]+$/, '') + '.webp'
  return new File([blob], newName, { type: 'image/webp' })
}

export type UploadResult = {
  url: string
  path: string
  type: 'image' | 'video'
}

/**
 * Upload a file to the "media" bucket. Images are auto-compressed.
 * Returns the public URL and storage path.
 */
export async function uploadMedia(
  file: File,
  folder = 'uploads',
): Promise<UploadResult> {
  const supabase = createClient()
  const isImage = file.type.startsWith('image/')
  const finalFile = isImage ? await compressImage(file) : file

  const ext = finalFile.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}.${ext}`

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, finalFile, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)

  return {
    url: publicUrl,
    path,
    type: isImage ? 'image' : 'video',
  }
}

export async function deleteMedia(path: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path])
  if (error) throw error
}
