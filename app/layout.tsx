import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Noto_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import LcpObserver from "@/components/LcpObserver";
import AdblockRedirect from "@/components/AdblockRedirect";
import Script from "next/script";
import type { Metadata, Viewport } from 'next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const noto = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alata"
});

const baseUrl = process.env.SITE_URL || "https://www.frontendpedia.com";

// Default social profiles and optional overrides via env vars
const defaultSocialProfiles: string[] = [
  'https://x.com/Frontendpedia',
  'https://www.linkedin.com/company/frontendpedia',
];

// Optional social profile URLs. Set any of these env vars to have them included automatically.
const adminProfileUrl = (process.env.NEXT_PUBLIC_ADMIN_PROFILE_URL as string | undefined) || 'https://www.frontendpedia.com/author/administrator';

const envSocialProfiles: string[] = [
  process.env.NEXT_PUBLIC_SOCIAL_TWITTER as string,
  process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN as string,
  process.env.NEXT_PUBLIC_SOCIAL_GITHUB as string,
  process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE as string,
  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK as string,
  process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM as string,
  process.env.NEXT_PUBLIC_SOCIAL_DRIBBBLE as string,
  process.env.NEXT_PUBLIC_SOCIAL_BEHANCE as string,
  adminProfileUrl as string,
].filter(Boolean);

const socialProfiles: string[] = Array.from(new Set([...defaultSocialProfiles, ...envSocialProfiles]));

const organizationLdJson: Record<string, any> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Frontendpedia',
  url: baseUrl,
  logo: `${baseUrl}/logo.svg`,
};

if (socialProfiles.length > 0) {
  organizationLdJson.sameAs = socialProfiles;
}

if (adminProfileUrl) {
  organizationLdJson.founder = {
    '@type': 'Person',
    url: adminProfileUrl,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Frontendpedia',
  description: `FrontendPedia – Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.`,
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true
  },
  formatDetection: {
    telephone: false
  },
  keywords: [
    'frontend architecture',
    'web development',
    'UI/UX',
    'design patterns'
  ],
  authors: [{ name: 'Frontendpedia' }],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Frontendpedia',
    locale: 'en_US',
    title: "Frontendpedia",
    description: `FrontendPedia – Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.`,
    images: [{ url: '/opengraph.jpg', alt: 'Frontendpedia Open Graph Image' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontendpedia',
    description: `FrontendPedia – Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.`,
    images: ['/opengraph.jpg'],
    site: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@Frontendpedia',
    creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@Frontendpedia',
  },
  verification: {
    yandex: '07e488dc1de89449',
  },
  other: {
    'google-adsense-account': 'ca-pub-3296825399852834',
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(noto.variable, inter.variable)}>
      <head>
        <Script
          id="ldjson-website"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Frontendpedia',
            url: baseUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          })}
        </Script>
        <Script
          id="ldjson-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(organizationLdJson)}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3296825399852834"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased text-gray-800 dark:bg-black dark:text-gray-400">
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
        <LcpObserver />
        <AdblockRedirect 
          enabled={true}
          checkDelay={2000}
          excludePaths={['/adblock']}
        />
      </body>
    </html>
  );
}
