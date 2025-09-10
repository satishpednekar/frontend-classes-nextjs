import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Noto_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import LcpObserver from "@/components/LcpObserver";
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const noto = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alata"
});

export const metadata: Metadata = {
  title: 'Frontendpedia',
  description: 'Learn frontend development with comprehensive tutorials and guides',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
      <body className="antialiased text-gray-800 dark:bg-black dark:text-gray-400">
        <Providers>{children}</Providers>
        <SpeedInsights />
        <LcpObserver />
      </body>
    </html>
  );
}
