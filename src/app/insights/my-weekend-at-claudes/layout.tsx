import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "My Weekend at Claude's | L7 Shift",
  description: "How a Strategic Leader Built a Production SaaS in 24 Hours — And What It Means for Your Business. A case study in the SymbAIotic Shift™.",
  openGraph: {
    title: "My Weekend at Claude's",
    description: "How a Strategic Leader Built a Production SaaS in 24 Hours",
    url: 'https://l7shift.com/insights/my-weekend-at-claudes',
    siteName: 'L7 Shift',
    images: [
      {
        url: 'https://l7shift.com/images/weekend-at-claudes-og.png',
        width: 1200,
        height: 630,
        alt: "My Weekend at Claude's - L7 Shift Case Study",
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "My Weekend at Claude's",
    description: "How a Strategic Leader Built a Production SaaS in 24 Hours",
    images: ['https://l7shift.com/images/weekend-at-claudes-og.png'],
  },
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
