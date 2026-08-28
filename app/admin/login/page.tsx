'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2, Droplets } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      if (signInError.message.toLowerCase().includes('confirm')) {
        setError('Please confirm your email address before signing in.')
      } else if (signInError.message.toLowerCase().includes('rate')) {
        setError('Too many attempts. Please wait a moment and try again.')
      } else {
        setError('Invalid email or password.')
      }
      setLoading(false)
      return
    }

    const redirect = params.get('redirect') || '/admin/dashboard'
    router.push(redirect)
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #0B72E7 0, transparent 40%), radial-gradient(circle at 80% 80%, #0B72E7 0, transparent 40%)',
        }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-skyblue flex items-center justify-center mb-4">
              <Droplets className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-navy">Skypro Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:border-skyblue focus:ring-2 focus:ring-skyblue/30 outline-none transition"
                  placeholder="admin@skyproprojects.co.zw"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 focus:border-skyblue focus:ring-2 focus:ring-skyblue/30 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-skyblue py-2.5 text-white font-medium hover:bg-skyblue/90 disabled:opacity-60 transition"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-6">
            Authorized administrators only.
          </p>
        </div>
      </motion.div>
    </main>
  )
}
