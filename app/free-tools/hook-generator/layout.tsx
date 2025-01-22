import { Metadata } from "next"

export const metadata: Metadata = {
    metadataBase: new URL("https://ugc.farm"),
    title: "Free Social Media Hook Generator | Create Converting Hooks",
    description: "Generate scroll-stopping hooks for Facebook, Instagram, and TikTok that drive traffic and sales. Free AI-powered tool for creating engaging social media content that converts.",

    keywords: [
        "hook generator",
        "social media hooks",
        "e-commerce content",
        "Facebook hooks",
        "Instagram hooks",
        "TikTok hooks",
        "social media marketing",
        "content generator",
        "viral hooks",
        "content creation tool",
        "social media copywriting",
        "marketing hooks",
        "hook writing",
        "social media engagement",
        "hook generator",
        "social media hooks",
        "e-commerce content",
        "Facebook hooks",
        "Instagram hooks",
        "TikTok hooks",
        "social media marketing",
        "content generator"
    ],

    openGraph: {
        title: "Free Social Media Hook Generator | Create Converting Hooks",
        description: "Generate scroll-stopping hooks for Facebook, Instagram, and TikTok that drive traffic and sales. Free AI-powered tool for creating engaging social media content that converts.",
        type: "website",
        url: "https://ugc.farm/free-tools/hook-generator",
        siteName: "UGC Farm",
        locale: "en_US",
        images: [
            {
                url: "/og-image.png", // Create a custom OG image
                width: 1200,
                height: 630,
                alt: "Social Media Hook Generator Tool",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Social Media Hook Generator | Create Converting Hooks",
        description: "Generate scroll-stopping hooks for Facebook, Instagram, and TikTok that drive traffic and sales.",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: "https://ugc.farm/free-tools/hook-generator",
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
    }
}

// Add structured data for the tool
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Social Media Hook Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    "description": "Generate scroll-stopping hooks for Facebook, Instagram, and TikTok that drive traffic and sales to your e-commerce store.",
    "creator": {
        "@type": "Organization",
        "name": "UGC Farm"
    },
    "featureList": [
        "Facebook hooks generation",
        "Instagram hooks generation",
        "TikTok hooks generation",
        "E-commerce optimized",
        "AI-powered content creation",
        "Instant results"
    ]
}

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    )
} 