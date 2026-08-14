'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Phone } from 'lucide-react'

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div>
      <a href="https://wa.me/263777984454" target="_blank" rel="noreferrer" className="fixed right-6 bottom-24 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg pulse">
        <MessageSquare />
      </a>

      <a href="tel:0777984454" className="fixed right-6 bottom-36 z-40 bg-skyblue text-white p-4 rounded-full shadow-lg">
        <Phone />
      </a>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed right-6 bottom-10 z-50 bg-gray-800 text-white p-3 rounded-full shadow">
          ↑
        </button>
      )}
    </div>
  )
}
