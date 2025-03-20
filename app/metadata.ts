import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "UGC Farm | AI-Powered UGC Content Creation Platform",
    description: "Transform your marketing with AI-generated UGC content. Create authentic, engaging videos 100x faster than traditional methods. Perfect for e-commerce brands and busy business owners.",
    openGraph: {
        title: "UGC Farm | Turn Reels into Website Visitors",
        description: "Create professional UGC content instantly with AI. Save time and money while scaling your content creation. Perfect for busy business owners who want more sales.",
        type: "website",
        url: "https://ugc.farm",
        siteName: "UGC Farm",
        locale: "en_US",
        images: [
            {
                url: "https://ugc.farm/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "UGC Farm - AI-Powered Content Creation",
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "UGC Farm | AI-Powered Content Creation",
        description: "Create professional UGC content instantly with AI. Perfect for busy business owners who want more sales.",
        images: ["https://ugc.farm/opengraph-image.png"],
    },
    alternates: {
        canonical: "https://ugc.farm",
    },
    keywords: "UGC content creation, AI content generation, user-generated content, UGC marketing, content automation, social media content, UGC videos, content creation platform",
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
}