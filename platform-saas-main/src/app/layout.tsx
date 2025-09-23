import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Script from 'next/script';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="hydration-fix"
          strategy="afterInteractive"
        >{`
          // Remove common browser extension attributes that can cause hydration mismatch
          (function(){
            try {
              var body = document.body;
              if (!body) return;
              var attrs = [
                'data-new-gr-c-s-check-loaded',
                'data-gr-ext-installed',
                'data-qb-installed'
              ];
              attrs.forEach(function(attr){
                if (body.hasAttribute(attr)) body.removeAttribute(attr);
              });
            } catch (_) {}
          })();
        `}</Script>
      </head>
      <body suppressHydrationWarning className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
