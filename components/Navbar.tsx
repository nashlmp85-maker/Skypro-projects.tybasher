'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<'light'|'dark'>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem('theme') as 'light'|'dark'|null
    if (stored) setTheme(stored)
    else setTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <header className="sticky top-0 z-40 bg-white/60 dark:bg-[#071226]/60 glass-card backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-xl text-navy dark:text-white">Skypro Projects Water Solutions</Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link href="#">Home</Link>
          <Link href="#about">About Us</Link>
          <Link href="#services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/videos">Videos</Link>
          <Link href="/testimonials">Testimonials</Link>
          <Link href="/promotions">Promotions</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md bg-slate-100 dark:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>

        <div className="md:hidden flex items-center">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-md">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6">
          <div className="flex flex-col gap-3">
            <Link href="/">Home</Link>
            <Link href="/#about">About Us</Link>
            <Link href="/#services">Services</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/videos">Videos</Link>
            <Link href="/testimonials">Testimonials</Link>
            <Link href="/promotions">Promotions</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      )}
    </header>
  )
}
