import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, EB_Garamond, Cinzel, Josefin_Sans } from 'next/font/google'
import { AuthProvider } from '@/lib/AuthProvider'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
})

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-josefin',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Naveen Reddy Marriage Bureau — Est. 2000',
  description: 'Reddy Elite Matrimony — exclusive matchmaking for the Reddy community since 2000.',
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7B1F2E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ebGaramond.variable} ${cinzel.variable} ${josefin.variable}`}
    >
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
