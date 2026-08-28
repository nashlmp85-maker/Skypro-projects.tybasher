import Link from 'next/link'
import {
  Wrench,
  FolderKanban,
  Images,
  Video,
  MessageSquareQuote,
  BadgePercent,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getCount(table: string) {
  const supabase = await createClient()
  const { count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  return count ?? 0
}

const STATS = [
  { table: 'services', label: 'Services', href: '/admin/services', icon: Wrench },
  { table: 'projects', label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { table: 'gallery', label: 'Gallery Items', href: '/admin/gallery', icon: Images },
  { table: 'videos', label: 'Videos', href: '/admin/videos', icon: Video },
  { table: 'testimonials', label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { table: 'promotions', label: 'Promotions', href: '/admin/promotions', icon: BadgePercent },
  { table: 'blog_posts', label: 'Blog Posts', href: '/admin/blog', icon: FileText },
]

export default async function DashboardPage() {
  const counts = await Promise.all(STATS.map((s) => getCount(s.table)))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
        <p className="text-gray-500 mt-1">
          Manage all content for the Skypro Projects website from here.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.table}
              href={stat.href}
              className="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-skyblue/40 transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-skyblue/10 flex items-center justify-center">
                  <Icon className="text-skyblue" size={20} />
                </div>
                <ArrowRight
                  className="text-gray-300 group-hover:text-skyblue transition"
                  size={18}
                />
              </div>
              <p className="mt-4 text-3xl font-bold text-navy">{counts[i]}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-navy mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/admin/homepage', label: 'Edit Homepage' },
            { href: '/admin/projects', label: 'Add a Project' },
            { href: '/admin/gallery', label: 'Upload to Gallery' },
            { href: '/admin/blog', label: 'Write a Blog Post' },
            { href: '/admin/contact', label: 'Update Contact Info' },
            { href: '/admin/seo', label: 'Manage SEO' },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-lightgrey/50 px-4 py-3 text-sm font-medium text-navy hover:bg-skyblue hover:text-white transition"
            >
              {a.label}
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
