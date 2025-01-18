import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Arthur Luca | Writer & Entrepreneur | Personal Website",
    description: "Arthur Luca is a writer and entrepreneur focused on technology and innovation. Explore his work, thoughts, and latest projects in software development and business.",
    openGraph: {
        title: "Arthur Luca - Writer & Entrepreneur",
        description: "Discover Arthur Luca's insights on technology, entrepreneurship, and innovation. Read his latest articles and learn about his projects.",
        type: "profile",
        url: "https://ugc.farm/author/arthur-luca",
        images: [
            {
                url: "/public/assets/blog/authors/arthur.webp",
                width: 1200,
                height: 630,
                alt: "Arthur Luca - Writer & Entrepreneur",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Arthur Luca - Writer & Entrepreneur",
        description: "Discover Arthur Luca's insights on technology, entrepreneurship, and innovation.",
        creator: "@arthurluca101",
        images: ["/public/assets/blog/authors/arthur.webp"],
    },
    alternates: {
        canonical: "https://ugc.farm/author/arthur-luca",
    },
    keywords: "Arthur Luca, writer, entrepreneur, technology, innovation, software development, business insights",
    authors: [{ name: "Arthur Luca" }],
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

// Add JSON-LD structured data
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arthur Luca",
    description: "Writer and entrepreneur focused on technology and innovation",
    url: "https://ugc.farm/author/arthur-luca",
    image: "/public/assets/blog/authors/arthur.webp",
    sameAs: [
        "https://twitter.com/arthurluca101",
    ],
    jobTitle: "Entrepreneur",
    worksFor: {
        "@type": "Organization",
        name: "UGC Farm"
    }
}

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div>
                <h1>Arthur Luca</h1>
                <p>Arthur Luca is a writer and entrepreneur.</p>
            </div>
        </>
    );
}