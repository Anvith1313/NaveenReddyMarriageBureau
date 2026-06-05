import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Montserrat, Inter, Cormorant_Garamond, EB_Garamond, Cinzel, Josefin_Sans } from 'next/font/google'
import { AuthProvider } from '@/lib/AuthProvider'
import SocialStack from '@/components/SocialStack/SocialStack'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

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
  maximumScale: 1,
  themeColor: '#7B1F2E',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${playfair.variable} ${inter.variable} ${cormorant.variable} ${ebGaramond.variable} ${cinzel.variable} ${josefin.variable}`}
    >
      <body><AuthProvider>{children}<SocialStack /></AuthProvider></body>
    </html>
  )
}
