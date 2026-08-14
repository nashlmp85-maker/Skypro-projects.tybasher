// TODO: Replace with CMS data (Supabase) later.

export type Service = {
  title: string
  slug: string
  description: string
  features: string[]
}

export type Project = {
  title: string
  slug: string
  category: string
  date: string
  cover: string
  gallery: string[]
  excerpt: string
}

export type Testimonial = {
  id: string
  name: string
  location: string
  rating: number
  message: string
  projectType: string
}

export const services: Service[] = [
  {
    title: 'Borehole Drilling',
    slug: 'borehole-drilling',
    description: 'Professional borehole drilling services across Zimbabwe.',
    features: ['Satellite surveys', 'Professional drilling', 'Casing installation', 'Pump installation', 'Solar installations']
  },
  {
    title: 'Irrigation Systems',
    slug: 'irrigation-systems',
    description: 'Design and installation of modern irrigation systems for farms of all sizes.',
    features: ['Drip Irrigation', 'Sprinkler Systems', 'Drag Hose', 'Centre Pivot', 'Farm Irrigation']
  },
  {
    title: 'Construction',
    slug: 'construction',
    description: 'Civil and water related construction works including dams and pump houses.',
    features: ['Small Dams', 'Fish Ponds', 'Pump Houses', 'Civil Engineering', 'Concrete Works']
  }
]

export const projects: Project[] = [
  {
    title: 'Harare Farm Borehole',
    slug: 'harare-farm-borehole',
    category: 'Borehole Drilling',
    date: '2025-05-12',
    cover: 'https://images.unsplash.com/photo-1558980664-10f8d1b1f2b4',
    gallery: ['https://images.unsplash.com/photo-1558980664-10f8d1b1f2b4','https://images.unsplash.com/photo-1509395176047-4a66953fd231'],
    excerpt: 'Successful borehole drilling project supplying water for irrigation.'
  }
]

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Mr. Chikodzi',
    location: 'Harare',
    rating: 5,
    message: 'Skypro delivered on time and the pump installation is flawless.',
    projectType: 'Borehole Drilling'
  }
]

export const galleryImages: string[] = [
  'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'
]

export const blogPosts = [
  {
    title: 'How to choose the right pump',
    slug: 'choose-right-pump',
    date: '2025-02-01',
    category: 'Guides',
    excerpt: 'Selecting the correct pump for your borehole ensures long term reliability.'
  }
]
