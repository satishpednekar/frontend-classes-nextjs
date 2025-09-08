import { Analytics } from "@vercel/analytics/react"
import Script from "next/script"

import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import { urlForImage } from "@/lib/sanity/image";
import Navbar from "@/components/navbar";

async function sharedMetaData(params) {
  const settings = await getSettings();

  return {
    // enable this for resolving opengraph image
    metadataBase: new URL(settings.url),
    title: {
      default:
        settings?.title,
      template: "%s | Frontendpedia"
    },
    description:
      settings?.description,
    keywords: ["JavaScript", "HTML", "CSS", "Frontend Development", "Web Development", "Generative AI frontend development", "Frontend Architecture", "Frontend Design Patterns", "Frontend design thinking"],
    authors: [{ name: "Frontendpedia" }],
    canonical: settings?.url,
    openGraph: {
      images: [
        {
          url:
            urlForImage(settings?.openGraphImage)?.src ||
            "/img/opengraph.jpg",
          width: 800,
          height: 600
        }
      ]
    },
    twitter: {
      title: settings?.title,
      card: "summary_large_image"
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export async function generateMetadata({ params }) {
  return await sharedMetaData(params);
}

export default async function Layout({ children, params }) {
  const settings = await getSettings();
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-HB34KD62K8"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HB34KD62K8');
        `}
      </Script>

      <Navbar {...settings} />

      <div>{children}</div>

      <Footer {...settings} />
    </>
  );
}
// enable revalidate for all pages in this layout
export const revalidate = 0;
