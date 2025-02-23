"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/button";
import { Button as ButtonSmall } from "@/components/ui/button";
import Link from "next/link";
import { VideoPreview } from "@/components/video-preview";
import { Footer } from "@/components/footer";
import Pricing from "@/components/pricing";
import { ArrowRight, Smile, Frown, Star, ClipboardList, Upload, Zap, X, Play, Pause } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client/supabase";
import { toast } from "sonner";
import { PurchaseNotification } from "@/components/purchase-notification";

const withoutUGC = [{
    title: "Other UGC platforms",
    list: [
        "not focused on ecommerce",
        "can't wear your clothes",
        "require video editing skills",
        "annoying subscription",
    ]
}]

const withUGC = [{
    title: "UGC Farm",
    list: [
        "made for ecom",
        "can wear AND talk about your product",
        "NO video editing skills required",
        "pay only for the videos you use",
    ]
}]

interface Review {
    img_url: string;
    rotation: number;
}



const reviews: Review[] = [
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/001.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/002.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/003.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/004.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/005.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/006.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/007.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/008.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/009.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/010.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/011.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/012.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/013.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/015.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/016.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/017.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/018.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/019.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/020.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/026.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/027.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/031.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/032.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/033.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/034.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/035.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/036.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/037.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/038.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/039.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/040.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/041.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/042.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/043.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/064.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/065.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/066.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/067.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/068.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/069.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/070.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/071.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/072.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/073.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/074.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/075.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/076.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/077.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/078.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/079.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/080.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/081.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/082.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/083.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/086.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/087.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/088.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/089.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/090.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/091.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/092.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/093.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/094.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/095.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/096.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/097.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/099.webp",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/100.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/101.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/102.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/109.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/110.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/111.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/112.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/113.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/114.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/115.webp",
        "rotation": 1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/116.webp",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/117.webp",
        "rotation": 1
    }
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
    const [showDialog, setShowDialog] = useState(false);
    const [email, setEmail] = useState("");
    const [showCornerCard, setShowCornerCard] = useState(true);
    const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Check localStorage only after component mounts
        const emailSubmitted = localStorage.getItem('ugcfarm_email_submitted');
        setHasSubmittedEmail(!!emailSubmitted);

        if (!emailSubmitted) {
            const timer = setTimeout(() => {
                setShowDialog(true);
            }, 60000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('free_videos')
            .insert({ email });
        if (error) {
            console.error(error);
        } else {
            localStorage.setItem('ugcfarm_email_submitted', 'true');
            setHasSubmittedEmail(true);
            toast.success("You'll receive a video in your inbox shortly 🎉");
            setShowDialog(false);
        }
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

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
                                No subscription required
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center justify-center gap-[0.5px]">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-base font-[600] text-[#1a1a1a] opacity-60 text-center">
                                Ads that show MY product
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center justify-center gap-[0.5px]">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-base font-[600] text-[#1a1a1a] opacity-60 text-center">
                                All languages supported
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-8">
                        <h1 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                            Automated UGC for e-commerce brands
                        </h1>
                        <p className="text-lg md:text-xl font-[600] text-[#1a1a1a] opacity-60 text-center">
                            Create 60+ viral ads with AI UGC in minutes
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            {/* <MagneticButton> */}
                            <Link href="/#pricing">

                                <Button
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300"
                                >
                                    Start now
                                </Button>

                            </Link>
                            {/* </MagneticButton> */}
                            <Link href="/demo" className="text-sm font-[600] text-[#1a1a1a]/40 flex items-center hover:underline">
                                View demo&nbsp;&rarr;
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

                    <Link href="/demo">
                        <ButtonSmall className="py-6 px-6 text-lg font-[600]">
                            See demos&nbsp;&nbsp;&rarr;
                        </ButtonSmall>
                    </Link>

                    {/* video from founder */}
                    <div className="flex flex-col items-center justify-center space-y-8 py-12 w-full">
                        <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                            How it works
                        </h2>
                        <div className="w-full aspect-video">
                            <iframe className="rounded-lg w-full h-full" src="https://www.youtube.com/embed/HzXjI-P_nKY?si=ijWwN30LG3MRCHWN" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                            </iframe>
                        </div>
                        <Link href="/#pricing">

                            <Button
                                variant="default"
                                className="hover:scale-[1.05] transition-all duration-300"
                            >
                                Start now
                            </Button>

                        </Link>
                    </div>

                    {/* calculator */}
                    {/* <div className="flex flex-col items-center justify-center space-y-8 py-12">
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
                    </div> */}

                    {/* problem agitation */}
                    <div className="flex flex-col items-center justify-center space-y-8 py-12 w-full">
                        <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                            Why choose us for your ecommerce brand?
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
                    {/* <div className="flex flex-col items-center justify-center space-y-8 py-12">
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
                    </div> */}

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
            {/* <PurchaseNotification /> */}

            {/* Corner Card */}
            {showCornerCard && !hasSubmittedEmail && (
                <Card className="hidden md:block fixed bottom-20 right-4 p-4 w-[300px] shadow-lg z-50 animate-in slide-in-from-right">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-[#1a1a1a]">
                            Get a <span className="text-primary font-black">FREE</span> UGC Video
                        </h3>
                        <button
                            onClick={() => setShowCornerCard(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-sm text-[#1a1a1a]/60 mb-4">
                        Login to receive a free professional UGC video for your brand.
                    </p>
                    {/* <form onSubmit={handleSubmit} className="space-y-3"> */}
                    {/* <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="placeholder:font-[500]"
                        /> */}
                    <Link href="/login">
                        <ButtonSmall type="submit" className="w-full font-[600] text-sm">
                            Get my free video&nbsp;&nbsp;&rarr;
                        </ButtonSmall>
                    </Link>
                    {/* </form> */}
                </Card>
            )}

            {/* <Dialog open={showDialog && !hasSubmittedEmail} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md gap-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">Get a <span className="text-primary font-black">FREE</span> UGC Video 👇</DialogTitle>
                        <DialogDescription className="text-base">
                            Enter your email to receive a <span className="font-bold">free</span> professional UGC video for your brand.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="placeholder:font-[500]"
                        />
                        <ButtonSmall type="submit" className="w-full font-[600]">
                            Get My Free Videos&nbsp;&nbsp;&rarr;
                        </ButtonSmall>
                    </form>
                </DialogContent>
            </Dialog> */}
        </>
    );
}
