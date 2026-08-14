'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white dark:bg-[#071226] rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="mb-4">{error.message}</p>
        <button onClick={() => reset()} className="px-4 py-2 bg-skyblue text-white rounded">Try again</button>
      </div>
    </div>
  )
}
