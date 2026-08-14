import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ServicesSection from '../components/ServiceCard'
import FloatingButtons from '../components/FloatingButtons'
import { services } from '../lib/data'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#071226] text-gray-900 dark:text-gray-100">
      <Navbar />
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServicesSection key={s.slug} {...s} />
          ))}
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </main>
  )
}
