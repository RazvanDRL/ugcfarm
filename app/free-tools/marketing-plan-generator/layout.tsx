import { Metadata } from "next"

export const metadata: Metadata = {
    metadataBase: new URL("https://ugc.farm"),
    title: "Free Marketing Plan Generator | AI-Powered Business Strategy Tool",
    description: "Generate comprehensive, data-driven marketing plans instantly with our free AI marketing plan generator. Perfect for startups, small businesses, and marketing professionals.",

    keywords: [
        "marketing plan generator",
        "free marketing tool",
        "business strategy generator",
        "AI marketing plan",
        "digital marketing strategy",
        "marketing strategy template",
        "business marketing plan",
        "marketing goals",
        "marketing automation",
        "strategic planning tool",
        "business planning",
        "marketing roadmap",
        "marketing strategy generator",
        "business growth plan",
        "marketing objectives",
        "marketing tactics",
        "marketing KPIs",
        "business marketing strategy",
        "marketing plan template",
        "marketing automation tool"
    ],

    openGraph: {
        title: "Free Marketing Plan Generator | AI-Powered Business Strategy Tool",
        description: "Generate comprehensive, data-driven marketing plans instantly with our free AI marketing plan generator. Perfect for startups, small businesses, and marketing professionals.",
        type: "website",
        url: "https://ugc.farm/free-tools/marketing-plan-generator",
        siteName: "UGC Farm",
        locale: "en_US",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "AI Marketing Plan Generator Tool",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Marketing Plan Generator | AI-Powered Business Strategy Tool",
        description: "Generate comprehensive, data-driven marketing plans instantly. Transform your business strategy with AI.",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: "https://ugc.farm/free-tools/marketing-plan-generator",
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
    "name": "AI Marketing Plan Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    "description": "Generate comprehensive, data-driven marketing plans instantly with our AI-powered marketing plan generator. Perfect for businesses of all sizes.",
    "creator": {
        "@type": "Organization",
        "name": "UGC Farm"
    },
    "featureList": [
        "Custom marketing strategy generation",
        "Industry-specific recommendations",
        "Goal-oriented planning",
        "Marketing channel strategy",
        "KPI and metrics planning",
        "Action step creation",
        "Budget allocation guidance",
        "Timeline recommendations"
    ],
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "156"
    },
    "review": {
        "@type": "Review",
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
        },
        "author": {
            "@type": "Person",
            "name": "Marketing Professional"
        },
        "reviewBody": "An excellent tool for quickly generating comprehensive marketing plans. Saves hours of planning time."
    }
}

// Add HowTo structured data
const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate a Marketing Plan",
    "description": "Create a comprehensive marketing plan using our AI-powered generator",
    "step": [
        {
            "@type": "HowToStep",
            "name": "Enter Business Information",
            "text": "Input your business name and detailed description"
        },
        {
            "@type": "HowToStep",
            "name": "Specify Industry",
            "text": "Select your business industry for targeted recommendations"
        },
        {
            "@type": "HowToStep",
            "name": "Define Marketing Goals",
            "text": "Outline your specific marketing objectives and targets"
        },
        {
            "@type": "HowToStep",
            "name": "Generate Plan",
            "text": "Click generate to receive your customized marketing plan"
        }
    ],
    "totalTime": "PT5M"
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
            />
            {children}
        </>
    )
} 