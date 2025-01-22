import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClipboardList, Upload, Zap } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Metadata } from 'next'

const steps = [
    {
        title: "Choose Your Plan",
        description: "Select how many videos you need per month based on your content strategy.",
        icon: ClipboardList,
        color: "bg-blue-500/10",
        textColor: "text-blue-500"
    },
    {
        title: "Input Your Details",
        description: "Share your product info & target audience. Upload your own demo footage to use alongside generated content.",
        icon: Upload,
        color: "bg-green-500/10",
        textColor: "text-green-500"
    },
    {
        title: "Generate Content",
        description: "Get instant, professional UGC videos in minutes - 100x faster than traditional methods.",
        icon: Zap,
        color: "bg-amber-500/10",
        textColor: "text-amber-500"
    }
]

export const metadata: Metadata = {
    title: "How It Works | AI-Powered UGC Creation",
    description: "Learn how UGC Farm's AI platform helps you generate professional UGC content 100x faster. Create weeks worth of authentic content in minutes with our innovative technology.",
    openGraph: {
        title: "How UGC Farm Works - Generate UGC Content 100x Faster",
        description: "Discover how our AI-powered platform revolutionizes UGC creation. Create professional, authentic content in minutes instead of weeks.",
        type: "website",
        url: "https://ugc.farm/how-it-works",
        siteName: "UGC Farm",
        locale: "en_US",
        images: [
            {
                url: "https://ugc.farm/og-image.png", // Create this image
                width: 1200,
                height: 630,
                alt: "UGC Farm Platform Overview",
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "How UGC Farm Works - Generate Content 100x Faster",
        description: "Discover how our AI-powered platform revolutionizes UGC creation. Create professional, authentic content in minutes instead of weeks.",
        images: ["https://ugc.farm/og-image.png"],
    },
    alternates: {
        canonical: "https://ugc.farm/how-it-works",
    },
    keywords: "UGC creation, AI content generation, UGC platform, content creation tool, UGC Farm process, automated content creation, UGC automation, professional UGC",
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

// Add HowTo JSON-LD structured data
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate Professional UGC Content with UGC Farm",
    description: "Learn how to create professional UGC content 100x faster using UGC Farm's AI-powered platform.",
    totalTime: "PT5M",
    step: [
        {
            "@type": "HowToStep",
            name: "Choose Your Plan",
            text: "Select how many videos you need per month based on your content strategy.",
            image: "https://ugc.farm/images/step-1.jpg",
            url: "https://ugc.farm/how-it-works#step1"
        },
        {
            "@type": "HowToStep",
            name: "Input Your Details",
            text: "Share your product info & target audience. Upload your own demo footage to use alongside generated content.",
            image: "https://ugc.farm/images/step-2.jpg",
            url: "https://ugc.farm/how-it-works#step2"
        },
        {
            "@type": "HowToStep",
            name: "Generate Content",
            text: "Get instant, professional UGC videos in minutes - 100x faster than traditional methods.",
            image: "https://ugc.farm/images/step-3.jpg",
            url: "https://ugc.farm/how-it-works#step3"
        }
    ],
    tool: [
        {
            "@type": "HowToTool",
            name: "UGC Farm Platform"
        }
    ],
    supply: [
        {
            "@type": "HowToSupply",
            name: "Product Information"
        },
        {
            "@type": "HowToSupply",
            name: "Demo Footage (optional)"
        }
    ]
}

export default function HowItWorks() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="mt-40 mb-20 px-8">
                <div className="flex flex-col items-center justify-center mx-auto max-w-5xl space-y-12">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center justify-center space-y-8 text-center">
                        <h1 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            Generate Professional UGC<br />
                            <span className="text-primary">100x Faster</span>
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center max-w-2xl">
                            Our AI-powered platform generates weeks worth of content in minutes
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16">
                        {steps.map((step, index) => (
                            <Card
                                key={index}
                                className={cn(
                                    "relative p-6 border-2 hover:scale-[1.02] transition-all duration-300",
                                    "flex flex-col items-start space-y-4"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-lg",
                                    step.color
                                )}>
                                    <step.icon className={cn("w-6 h-6", step.textColor)} />
                                </div>
                                <h3 className="text-xl font-bold">{step.title}</h3>
                                <p className="text-[#1a1a1a]/60 font-[500]">{step.description}</p>
                            </Card>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center space-y-8">
                        <h2 className="text-4xl font-[900]">
                            Ready to 100x your content creation?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-[500]">
                            Start creating months of UGC in minutes
                        </p>
                        <Link href="/#pricing">
                            <Button
                                variant="default"
                                size="lg"
                                className="mt-8 hover:scale-[1.05] transition-all duration-300 font-[600] text-lg px-6 py-6"
                            >
                                Start Creating Now
                                <Zap className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

        </>
    )
} 