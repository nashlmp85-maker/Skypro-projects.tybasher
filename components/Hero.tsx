'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const slides = [
  { src: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231', alt: 'Borehole drilling' },
  { src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', alt: 'Irrigation' },
  { src: 'https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea', alt: 'Solar pumping' }
]

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <motion.div
            key={s.src}
            initial={{ opacity: i === 0 ? 1 : 0 }}
            animate={{ opacity: i === 0 ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image src={s.src} alt={s.alt} fill style={{ objectFit: 'cover' }} placeholder="blur" blurDataURL="/placeholder.png" sizes="100vw" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">Building the Future, One Project at a Time</h1>
        <p className="mt-4 text-lg text-white/90">Smart Water Solutions • Borehole Drilling • Irrigation • Construction • Engineering Excellence</p>

        <div className="mt-8 flex justify-center gap-4">
          <a href="tel:0777984454" className="px-6 py-3 bg-skyblue text-white rounded-lg shadow hover:translate-y-[-2px] transition">Call: 0777 984 454</a>
          <a href="https://wa.me/263777984454" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/90 text-navy rounded-lg shadow">WhatsApp</a>
        </div>

        <div className="absolute right-8 bottom-12 glass-card p-4 rounded-2xl w-64">
          <div className="text-white">
            <div className="text-sm">100+ Boreholes Drilled</div>
            <div className="text-sm">Zimbabwe-Wide Service</div>
          </div>
        </div>
      </div>
    </section>
  )
}
