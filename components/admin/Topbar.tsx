'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Menu, LogOut, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './Toast'

// Auto-logout after this many ms of inactivity.
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

export default function Topbar({
  email,
  onMenuClick,
}: {
  email: string
  onMenuClick: () => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loggingOut, setLoggingOut] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const logout = useCallback(
    async (expired = false) => {
      setLoggingOut(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      if (expired) toast('Session expired. Please sign in again.', 'info')
      router.push('/admin/login')
      router.refresh()
    },
    [router, toast],
  )

  // Session inactivity timeout
  useEffect(() => {
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => logout(true), SESSION_TIMEOUT_MS)
    }
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [logout])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-navy"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="text-sm font-medium text-navy -mt-0.5">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-navy hover:bg-lightgrey transition"
        >
          <ExternalLink size={16} />
          <span className="hidden sm:inline">View Site</span>
        </Link>
        <button
          onClick={() => logout(false)}
          disabled={loggingOut}
          className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-60 transition"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">
            {loggingOut ? 'Signing out...' : 'Logout'}
          </span>
        </button>
      </div>
    </header>
  )
}
