"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/button";
import Link from "next/link";
import { VideoPreview } from "@/components/video-preview";
import { Footer } from "@/components/footer";
import Pricing from "@/components/pricing";
import { ArrowRight, Smile, Frown, Star, ClipboardList, Upload, Zap } from "lucide-react";
import { ROICalculator } from "@/components/roi-calculator"
import FlickeringGrid from "@/components/ui/flickering-grid";
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import Image from "next/image";
import Bento from "@/components/bento";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FAQ } from "@/components/faq";
import { Card } from "@/components/ui/card"
import { jsonLd } from './json-ld'
import { metadata } from './metadata'


const withoutUGC = [{
    title: "Traditional agencies",
    list: [
        "$80-150 per video",
        "3-day delivery time",
        "Inconsistent quality",
        "Communication barriers",
        "Unscalable",
    ]
}]

const withUGC = [{
    title: "You with UGC Farm",
    list: [
        "Low video costs",
        "Instant delivery",
        "Consistent brand voice",
        "Zero-effort",
        "Scaleable",
    ]
}]

interface Review {
    img_url: string;
    rotation: number;
}

const reviews: Review[] = [
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/1.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/2.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/3.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/4.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/5.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/6.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/7.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/8.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/9.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/10.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/11.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/12.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/13.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/14.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/15.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/16.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/17.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/18.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/19.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/20.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/21.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/22.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/23.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/24.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/25.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/26.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/27.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/28.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/29.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/30.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/31.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/32.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/33.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/34.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/35.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/36.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/37.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/38.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/39.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/40.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/41.webp",
        "rotation": 1
    },
]

// const factor = 1.5;

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img_url,
    rotation,
}: Review) => {
    return (
        <figure
            style={{
                width: `135px`,
                height: `240px`,
                transform: `rotate(${rotation}deg)`,
            }}
            className={cn(
                "relative aspect-[9/16] cursor-pointer rounded-2xl overflow-hidden hover:shadow-md border-4 border-white",
            )}
        >
            <div className="relative flex flex-col h-full">
                <Image
                    src={img_url + "?class=landing"}
                    alt="UGC content preview"
                    width={135}
                    height={240}
                    className="rounded-2xl border-4 border-white object-cover"
                    loading="eager"
                    priority={true}
                />
            </div>
        </figure>
    );
};

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

export default function Landing() {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const ref = params ? params.get('ref') : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="mt-40 mb-20 px-8">
                <div className="flex flex-col items-center justify-center mx-auto max-w-5xl space-y-12">

                    {/* social proof */}
                    <div className="flex w-full justify-around pb-4">
                        {/* Reviews */}
                        {/* <div className="flex items-center justify-center gap-[0.5px]">
                            {[...Array(5)].map((_, index) => (
                                <Star key={index} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                            ))}
                            <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                                <span className="text-primary">&nbsp;&nbsp;5 stars</span> from 100+ customers
                            </p>
                        </div> */}

                        {/* Reviews v2 */}
                        {/* <div className="flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center justify-center gap-[0.5px]">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                                <span className="text-primary">5 stars</span> from 100+ customers
                            </p>
                        </div> */}
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center justify-center gap-[0.5px]">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-base font-[600] text-[#1a1a1a] opacity-60 text-center">
                                73% of brands overpay for UGC
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center justify-center gap-[0.5px]">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-base font-[600] text-[#1a1a1a] opacity-60 text-center">
                                48% of creators miss deadlines
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center justify-center gap-[0.5px]">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-base font-[600] text-[#1a1a1a] opacity-60 text-center">
                                Average creator raises prices 3x/year
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-8">
                        <h1 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                            Turn Reels into Website Visitors
                        </h1>
                        <p className="text-lg md:text-xl font-[600] text-[#1a1a1a] opacity-60 text-center">
                            perfect for busy owners who want more sales
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <MagneticButton>
                                <Link href="/#pricing">

                                    <Button
                                        variant="default"
                                        className="hover:scale-[1.05] transition-all duration-300"
                                    >
                                        Start now
                                    </Button>

                                </Link>
                            </MagneticButton>
                            <Link href="/#pricing" className="text-sm opacity-80 font-[600] text-[#1a1a1a]/60 flex items-center hover:underline">
                                {/* See demo <ArrowRight className="ml-1 w-4 h-4" /> */}
                                Lock in&nbsp;<span className="hover:no-underline underline underline-offset-2 decoration-dashed">lifetime pricing</span>&nbsp;before launch
                            </Link>
                        </div>
                    </div>

                    {/* videos */}
                    {/* <div className="flex justify-center gap-2 w-full overflow-x-auto px-4 py-8 mx-auto">
                        <VideoPreview
                            imageUrl="/homepage/previews/1.png"
                            alt="Preview 1"
                            rotation={-1}
                        />
                        <VideoPreview
                            imageUrl="/homepage/previews/2.png"
                            alt="Preview 2"
                            rotation={1}
                            className="-mt-6 mb-6"
                        />
                        <VideoPreview
                            imageUrl="/homepage/previews/3.png"
                            alt="Preview 3"
                            rotation={1}
                        />
                        <VideoPreview
                            imageUrl="/homepage/previews/4.png"
                            alt="Preview 4"
                            rotation={2}
                            className="-mt-6 mb-6"
                        />
                        <VideoPreview
                            imageUrl="/homepage/previews/5.png"
                            alt="Preview 5"
                            rotation={1}
                        />
                    </div> */}

                    {/* marquee */}
                    <div className="relative flex my-12 h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg -rotate-[7deg]">
                        <Marquee pauseOnHover className="[--duration:20s]">
                            {firstRow.map((review) => (
                                <ReviewCard key={review.img_url} {...review} />
                            ))}
                        </Marquee>
                        <Marquee reverse pauseOnHover className="[--duration:20s]">
                            {secondRow.map((review) => (
                                <ReviewCard key={review.img_url} {...review} />
                            ))}
                        </Marquee>
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
                    </div>

                    {/* calculator */}
                    <div className="flex flex-col items-center justify-center space-y-8 py-12">
                        <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                            See how much you are saving
                        </h2>
                        <ROICalculator />
                        <Link href="/#pricing">
                            <Button
                                variant="default"
                                className="hover:scale-[1.05] transition-all duration-300"
                            >
                                Start saving now
                            </Button>
                        </Link>
                    </div>

                    {/* problem agitation */}
                    <div className="flex flex-col items-center justify-center space-y-8 py-12 w-full">
                        <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                            Never pay <span className="text-primary decoration-primary underline underline-offset-4 decoration-dashed">extra</span> again.
                        </h2>
                        {/* 2 cards side by side */}
                        <div className="mt-16 flex flex-col sm:flex-row items-stretch justify-center gap-6 w-full">
                            <div className="flex flex-col items-left text-left justify-start p-6 sm:p-8 bg-red-50 rounded-xl w-full sm:w-1/2">
                                <Frown className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                                <h3 className="mt-4 text-lg sm:text-xl font-extrabold text-red-500">{withoutUGC[0].title}</h3>
                                <ul className="mt-4 text-sm sm:text-base font-[600] text-red-700 list-disc list-inside">
                                    {withoutUGC[0].list.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col items-top text-left justify-start p-6 sm:p-8 bg-green-50 rounded-xl w-full sm:w-1/2">
                                <Smile className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                                <h3 className="mt-4 text-lg sm:text-xl font-extrabold text-green-500">{withUGC[0].title}</h3>
                                <ul className="mt-4 text-sm sm:text-base font-[600] text-green-700 list-disc list-inside">
                                    {withUGC[0].list.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* features */}
                    <Bento />

                    {/* how it workss */}
                    <div className="flex flex-col items-center justify-center space-y-8 py-12">
                        <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                            Generate Professional UGC<br />
                            <span className="text-primary">100x Faster</span>
                        </h2>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center max-w-2xl">
                            Our AI-powered platform generates weeks worth of content in minutes
                        </p>

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
                    </div>

                    {/* pricing */}
                    <Pricing id="pricing" className="w-full py-12 px-6 lg:px-0.5" referral={ref} />


                    {/* faq */}
                    <div id="faq" className="max-w-3xl w-full mx-auto py-12">
                        <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center mb-12">
                            Frequently asked questions
                        </h2>
                        <FAQ />
                    </div>

                    {/* cta */}
                    <div className="py-12 size-[300px] rounded-lg w-full bg-background overflow-hidden border relative">
                        <FlickeringGrid
                            className="z-0 relative inset-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
                            squareSize={4}
                            gridGap={6}
                            color="#FF7538"
                            maxOpacity={0.5}
                            flickerChance={0.1}
                            height={500}
                            width={2000}
                        />
                        <div className="absolute inset-0 flex flex-col items-center space-y-8 justify-center z-10">
                            <h2 className="text-4xl md:text-5xl text-primary font-[900] text-center">
                                Ready to get started?
                            </h2>
                            <Link href="/#pricing">
                                <Button variant="default" className="hover:scale-[1.05] hover:bg-primary/90 bg-primary text-background transition-all duration-300">
                                    Start now
                                    <ArrowRight />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main >
            <Footer />
        </>
    );
}
