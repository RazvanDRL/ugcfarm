import type { Metadata } from "next";
import { satoshi } from "@/fonts/satoshi";
import PlausibleProvider from 'next-plausible'
import "./globals.css";
import { PostHogProvider } from "@/components/posthog";
import { IntercomScript } from "@/app/components/IntercomScript";

export const metadata: Metadata = {
  metadataBase: new URL("https://ugc.farm"),
  title: "UGC Farm",
  description: "UGC Farm - AI-powered video generation for your brand",
  alternates: {
    canonical: "https://ugc.farm",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "UGC Farm",
    description: "UGC Farm - AI-powered video generation for your brand",
    url: "https://ugc.farm",
    type: "website",
    siteName: "UGC Farm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UGC Farm",
    description: "UGC Farm - AI-powered video generation for your brand",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  // verification: {
  //   google: "google-site-verification=1234567890",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <IntercomScript />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="UGC Farm" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <PostHogProvider>
        <body className={`${satoshi.className}`}>
          <PlausibleProvider
            domain="ugc.farm"
            customDomain="https://plausible.longtoshort.tech"
            selfHosted={true}
            enabled={true}
          >
            {children}
          </PlausibleProvider>
        </body>
      </PostHogProvider>
    </html>
  );
}
