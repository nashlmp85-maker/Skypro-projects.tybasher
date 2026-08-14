'use client'
import { motion } from 'framer-motion'

export default function ServiceCard({ title, description, features }: { title: string; description: string; features?: string[] }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="p-6 rounded-2xl glass-card shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-3">{description}</p>
      {features && (
        <ul className="text-sm space-y-1 list-disc list-inside">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </motion.article>
  )
}
