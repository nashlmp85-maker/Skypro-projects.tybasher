'use client'

import { useState, useEffect } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = window.localStorage.getItem('theme')
    if (!stored) return
    if (stored === 'dark') document.documentElement.classList.add('dark')
  }, [])

  if (!mounted) return <>{children}</>

  return <>{children}</>
}
