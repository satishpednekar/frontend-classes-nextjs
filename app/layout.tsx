import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Noto_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import LcpObserver from "@/components/LcpObserver";
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
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/logo.svg`,
    width: 200,
    height: 60
  },
  description: 'Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.',
  foundingDate: '2024',
  sameAs: socialProfiles,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: `${baseUrl}/contact`
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US'
  }
};

// Social profiles are already included in the organizationLdJson object above

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
  title: {
    default: 'Frontendpedia',
    template: '%s | Frontendpedia'
  },
  description: `FrontendPedia – Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.`,
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: false
  },
  keywords: [
    'frontend development',
    'frontend/web development',
    'frontend architecture',
    'frontend architecture examples',
    'scalable frontend architecture patterns',
    'TypeScript native architecture',
    'UI/UX design architecture',
    'native javascript architecture',
    'web performance architecture',
    'responsive design architecture',
    'progressive web apps architecture',
    'frontend architecture tutorials',
    'coding architecture tutorials',
    'web development architecture blog',
    'frontend engineering architecture',
    'modern web development architecture',
    'frontend best practices architecture',
    'frontend architecture consulting',
    'frontend consulting',
    'frontend architecture services',
    'web application architecture reviews',
  ],
  authors: [{ name: 'Frontendpedia', url: baseUrl }],
  creator: 'Frontendpedia',
  publisher: 'Frontendpedia',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'Frontendpedia RSS Feed' }
      ]
    }
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Frontendpedia',
    locale: 'en_US',
    title: "Frontendpedia - Master Frontend Development",
    description: `FrontendPedia – Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.`,
    images: [
      { 
        url: '/opengraph.jpg', 
        alt: 'Frontendpedia - Master Frontend Development',
        width: 1200,
        height: 630,
        type: 'image/jpeg'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontendpedia - Master Frontend Development',
    description: `FrontendPedia – Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.`,
    images: ['/opengraph.jpg'],
    site: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@Frontendpedia',
    creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@Frontendpedia',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: '07e488dc1de89449',
    yahoo: process.env.YAHOO_SITE_VERIFICATION,
  },
  other: {
    'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
  },
  category: 'technology',
  classification: 'Technology Blog',
  referrer: 'origin-when-cross-origin',
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
            description: 'Master frontend engineering, design & architecture with expert insights, tutorials & guides that transform learning into real impact.',
            inLanguage: 'en-US',
            isAccessibleForFree: true,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            mainEntity: {
              '@type': 'Blog',
              name: 'Frontendpedia Blog',
              description: 'A comprehensive blog about frontend development, web technologies, and modern web development practices.',
              url: `${baseUrl}/archive`,
              publisher: {
                '@type': 'Organization',
                name: 'Frontendpedia',
                url: baseUrl
              }
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
      </head>
      <body className="antialiased text-gray-800 dark:bg-black dark:text-gray-400" suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
        <LcpObserver />
        <Script
          id="hydration-fix"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Fix hydration issues caused by browser extensions
              if (typeof window !== 'undefined') {
                // Suppress hydration warnings for browser extension attributes and multiple elements
                const originalConsoleError = console.error;
                const originalConsoleWarn = console.warn;
                
                console.error = function(...args) {
                  const message = args[0];
                  if (typeof message === 'string') {
                    // Suppress specific hydration warnings
                    if (message.includes('Extra attributes from the server') ||
                        message.includes('data-new-gr-c-s-check-loaded') ||
                        message.includes('data-gr-ext-installed') ||
                        message.includes('Hydration failed because the initial UI does not match') ||
                        message.includes('You are mounting a new html component') ||
                        message.includes('You are mounting a new body component')) {
                      return;
                    }
                  }
                  originalConsoleError.apply(console, args);
                };

                console.warn = function(...args) {
                  const message = args[0];
                  if (typeof message === 'string') {
                    // Suppress specific hydration warnings
                    if (message.includes('Extra attributes from the server') ||
                        message.includes('data-new-gr-c-s-check-loaded') ||
                        message.includes('data-gr-ext-installed') ||
                        message.includes('Hydration failed because the initial UI does not match') ||
                        message.includes('You are mounting a new html component') ||
                        message.includes('You are mounting a new body component')) {
                      return;
                    }
                  }
                  originalConsoleWarn.apply(console, args);
                };

                // Clean up browser extension attributes
                const cleanExtensionAttributes = () => {
                  const body = document.body;
                  if (body) {
                    // Remove Grammarly attributes
                    body.removeAttribute('data-new-gr-c-s-check-loaded');
                    body.removeAttribute('data-gr-ext-installed');
                    
                    // Remove other common extension attributes
                    const extensionAttributes = [
                      'data-grammarly-shadow-root',
                      'data-grammarly-ignore',
                      'data-grammarly-original-text',
                      'data-grammarly-original-html'
                    ];
                    
                    extensionAttributes.forEach(attr => {
                      body.removeAttribute(attr);
                    });
                  }
                };

                // Run immediately and on DOM changes
                cleanExtensionAttributes();
                
                const observer = new MutationObserver(() => {
                  cleanExtensionAttributes();
                });
                
                observer.observe(document.body, {
                  attributes: true,
                  childList: true,
                  subtree: true
                });

                // Clean up on page unload
                window.addEventListener('beforeunload', () => {
                  observer.disconnect();
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
