import type { Metadata } from "next";
import { satoshi } from "@/fonts/satoshi";
import PlausibleProvider from 'next-plausible'
import "./globals.css";
import { PostHogProvider } from "@/components/posthog";
import { IntercomScript } from "@/app/components/IntercomScript";
import { Toaster } from "sonner";
import { Footer } from "@/components/footer";
export const metadata: Metadata = {
  metadataBase: new URL("https://ugc.farm"),
  title: {
    template: "%s | UGC Farm - Automated UGC Content Creation Platform",
    default: "UGC Farm - Automated UGC Content Creation Platform",
  },
  description: "Automate your Reels content to drive real website traffic. Stop waiting for creators, start driving sales. Join smart brands scaling their growth with UGC.FARM",
  applicationName: "UGC Farm",
  authors: [{ name: "UGC Farm Team" }],
  generator: "Next.js",
  keywords: [
    "UGC",
    "user generated content",
    "content automation",
    "social media marketing",
    "Instagram Reels",
    "TikTok content",
    "brand growth",
    "content creation",
    "social media automation",
    "digital marketing",
    "influencer marketing",
    "content strategy",
    "social media ROI",
    "brand awareness",
    "marketing automation"
  ],
  alternates: {
    canonical: "https://ugc.farm",
    languages: {
      "en-US": "https://ugc.farm",
    },
  },
  openGraph: {
    title: "UGC Farm",
    description: "Automate your Reels content to drive real website traffic. Stop waiting for creators, start driving sales. Join smart brands scaling their growth with UGC.FARM",
    url: "https://ugc.farm",
    type: "website",
    siteName: "UGC Farm",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "UGC Farm - Automated UGC Content Creation Platform",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UGC Farm",
    description: "Automate your Reels content to drive real website traffic. Stop waiting for creators, start driving sales. Join smart brands scaling their growth with UGC.FARM",
    // creator: "@ugcfarm",
    // site: "@ugcfarm",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "UGC Farm - Automated UGC Content Creation Platform",
        type: "image/png",
      },
    ],
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
  category: "technology",
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
        <meta name="apple-mobile-web-app-title" content="UGC Farm" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
              },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
              twq('config','p1g9z');
            `
          }}
        />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '638462682040860');
              fbq('track', 'PageView');
            `
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=638462682040860&ev=PageView&noscript=1" />`
          }}
        />
        {/* End Meta Pixel Code */}

      </head>
      <PostHogProvider>
        <body className={`${satoshi.className}`}>
          <PlausibleProvider
            domain="ugc.farm"
            customDomain="https://plausible.longtoshort.tech"
            selfHosted={true}
            enabled={true}
          >
            <Toaster position="top-right" closeButton richColors />
            {children}
          </PlausibleProvider>
        </body>
      </PostHogProvider>
    </html>
  );
}
