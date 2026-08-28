'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  Images,
  Video,
  MessageSquareQuote,
  BadgePercent,
  FileText,
  Phone,
  Menu as MenuIcon,
  Search,
  Library,
  Droplets,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/homepage', label: 'Homepage', icon: Droplets },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/promotions', label: 'Promotions', icon: BadgePercent },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/contact', label: 'Contact', icon: Phone },
  { href: '/admin/navigation', label: 'Navigation', icon: MenuIcon },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/media', label: 'Media Library', icon: Library },
]

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? 'bg-skyblue text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-navy border-r border-white/10 h-screen sticky top-0">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-skyblue flex items-center justify-center">
            <Droplets className="text-white" size={20} />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">Skypro Projects</p>
            <p className="text-gray-400 text-xs">CMS Admin</p>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          <NavContent />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-navy lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-skyblue flex items-center justify-center">
                    <Droplets className="text-white" size={20} />
                  </div>
                  <p className="text-white font-semibold text-sm">Skypro CMS</p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="text-gray-300 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>
              <NavContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
