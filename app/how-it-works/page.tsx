"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClipboardList, Upload, Zap } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

export default function HowItWorks() {
    return (
        <>
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
            <Footer />
        </>
    )
} 