import './globals.css'
import type { Metadata } from 'next'
import { Poppins, Montserrat } from 'next/font/google'
import ThemeProvider from '../components/ThemeProvider'

const poppins = Poppins({ subsets: ['latin'], weight: ['300','400','600','700'], variable: '--font-poppins' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-montserrat' })

export const metadata: Metadata = {
  title: 'Skypro Projects Water Solutions',
  description: 'Engineering & Water Solutions — Borehole drilling, Irrigation, Solar pumping, Construction across Zimbabwe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body>
        {/* ThemeProvider handles dark/light toggle and persists theme */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
