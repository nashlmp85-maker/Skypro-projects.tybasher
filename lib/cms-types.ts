// Shared types for CMS content, matching the Supabase schema.

export type Service = {
  id: string
  title: string
  description: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

export type Project = {
  id: string
  title: string
  slug: string
  description: string | null
  excerpt: string | null
  category: string | null
  date: string | null
  cover: string | null
  images: string[]
  videos: string[]
  client_testimonial: string | null
  sort_order: number
  created_at: string
}

export type GalleryItem = {
  id: string
  url: string
  type: 'image' | 'video'
  category: string | null
  caption: string | null
  sort_order: number
  created_at: string
}

export type VideoItem = {
  id: string
  title: string
  description: string | null
  url: string
  source: 'upload' | 'youtube' | 'facebook' | 'tiktok'
  thumbnail: string | null
  sort_order: number
  created_at: string
}

export type Testimonial = {
  id: string
  name: string
  review: string | null
  rating: number
  location: string | null
  project_type: string | null
  sort_order: number
  created_at: string
}

export type Promotion = {
  id: string
  title: string
  description: string | null
  discount: number | null
  expiry_date: string | null
  featured: boolean
  image: string | null
  sort_order: number
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  image: string | null
  category: string | null
  published: boolean
  publish_date: string | null
  seo_title: string | null
  seo_description: string | null
  created_at: string
}

// site_settings key/value payloads
export type HomepageSettings = {
  logo?: string
  businessName?: string
  tagline?: string
  heroHeading?: string
  heroSubheading?: string
  heroImage?: string
  heroVideo?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  backgroundImage?: string
  brandColor?: string
  navyColor?: string
}

export type ContactSettings = {
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  mapEmbed?: string
}

export type SocialSettings = {
  facebook?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  linkedin?: string
  whatsapp?: string
  phone?: string
}

export type SeoSettings = {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  favicon?: string
}

export type NavItem = { label: string; href: string }
export type NavigationSettings = { items: NavItem[] }

export const SETTINGS_KEYS = {
  homepage: 'homepage',
  contact: 'contact',
  social: 'social',
  seo: 'seo',
  navigation: 'navigation',
} as const
