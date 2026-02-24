import type { Metadata } from 'next'
import './globals.css'
import { TimeTracker } from '@/components/shared/TimeTracker'

export const metadata: Metadata = {
  title: 'L7 Shift | Strategy. Systems. Solutions.',
  description: 'The AI-native development platform that replaces agencies. AI agent teams deliver complete digital products in days, not months. Based in Indian Trail, NC.',
  metadataBase: new URL('https://l7shift.com'),
  manifest: '/manifest.json',
  openGraph: {
    title: 'L7 Shift | Strategy. Systems. Solutions.',
    description: 'AI-native development platform from Indian Trail, NC. AI agent teams replace agencies. Products delivered in days.',
    siteName: 'L7 Shift',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'L7 Shift | Strategy. Systems. Solutions.',
    description: 'AI-native development platform from Indian Trail, NC. AI agent teams deliver products in days, not months.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <TimeTracker />
      </body>
    </html>
  )
}
