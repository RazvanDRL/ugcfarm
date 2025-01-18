import { FAQ, faq } from "@/components/faq"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Frequently Asked Questions | UGC Farm Help Center",
    description: "Find answers to common questions about UGC Farm's services, content creation, pricing, and platform features. Get the support you need to succeed as a UGC creator.",
    openGraph: {
        title: "FAQ | UGC Farm Help Center",
        description: "Get instant answers to your questions about UGC Farm's services, content creation, and platform features.",
        type: "website",
        url: "https://ugc.farm/faq",
        siteName: "UGC Farm",
        locale: "en_US",
        images: [
            {
                url: "https://ugc.farm/og-image.png", // Create this image
                width: 1200,
                height: 630,
                alt: "UGC Farm FAQ and Help Center",
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "UGC Farm FAQ - Get Quick Answers to Common Questions",
        description: "Find answers to common questions about UGC Farm's services, content creation, and platform features.",
        images: ["https://ugc.farm/og-image.png"],
    },
    alternates: {
        canonical: "https://ugc.farm/faq",
    },
    keywords: "UGC Farm FAQ, UGC creator help, content creation FAQ, UGC platform questions, UGC Farm support, user-generated content help",
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


const generateFaqJsonLd = (faqs: typeof faq) => {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(faq => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
            }
        })),
        publisher: {
            "@type": "Organization",
            name: "UGC Farm",
            logo: {
                "@type": "ImageObject",
                url: "https://ugc.farm/logo.svg"
            }
        }
    }
}

export default function FAQPage() {
    const jsonLd = generateFaqJsonLd(faq)

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="pt-[12rem] max-w-3xl mx-auto flex flex-col items-center justify-center space-y-8">
                <h1 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                    Frequently Asked Questions
                </h1>
                <FAQ />
            </main>
            <Footer />
        </>
    )
}