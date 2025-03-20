import Link from "next/link";
import { Card } from "@/components/ui/card";
import { freeTools } from "@/constants";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Free AI Writing Tools",
    description: "Access our collection of free AI-powered writing tools. Enhance your content creation workflow with tools designed for modern creators.",
    alternates: {
        canonical: "https://ugc.farm/free-tools"
    },
    openGraph: {
        title: "Free AI Writing Tools | UGC Farm",
        description: "Boost your content creation with our free AI writing tools. Designed for modern creators and marketers.",
        url: "https://ugc.farm/free-tools",
        type: "website",
        siteName: "UGC Farm",
        locale: "en_US",
        images: [
            {
                url: "https://ugc.farm/opengraph-image.png", // Add your actual OG image path
                width: 1200,
                height: 630,
                alt: "UGC Farm Free AI Writing Tools",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI Writing Tools | UGC Farm",
        description: "Boost your content creation with our free AI writing tools. Designed for modern creators and marketers.",
        images: ["https://ugc.farm/opengraph-image.png"], // Same as OG image
    },
    keywords: "AI writing tools, free AI tools, content creation, UGC Farm, writing assistant, AI content",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
}

export default function FreeToolsPage() {
    return (
        <>
            <Navbar />
            <main className="mt-40 mb-20 px-8">
                <div className="flex flex-col items-center justify-center mx-auto max-w-5xl space-y-12">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center justify-center space-y-8 text-center">
                        <Badge variant="secondary" className="px-4 py-1 font-bold">
                            Free Tools
                        </Badge>
                        <h1 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            AI-Powered Tools for<br />
                            <span className="text-primary">Modern Creators</span>
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                            Enhance your content creation workflow with our collection of free AI tools <br />
                            Built to boost productivity and creativity
                        </p>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {freeTools.map((tool) => (
                            <Link
                                key={tool.title}
                                href={tool.href}
                                className="group"
                            >
                                <Card className="relative p-6 border-2 hover:scale-[1.02] transition-all duration-300 h-full">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2 rounded-lg bg-primary/10`}>
                                                <tool.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                                {tool.title}
                                            </h3>
                                        </div>
                                        <p className="text-[#1a1a1a]/60 font-[500]">
                                            {tool.description}
                                        </p>
                                        <div className="flex items-center text-primary font-semibold text-sm pt-2">
                                            Try it now
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

        </>
    );
}
