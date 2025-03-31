"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/button";
import { Button as ButtonSmall } from "@/components/ui/button";
import Link from "next/link";
import { VideoPreview } from "@/components/video-preview";
import { Footer } from "@/components/footer";
import Pricing from "@/components/pricing";
import { ArrowRight, Smile, Frown, Star, X, Play, Wand2, MoveRight, Send } from "lucide-react";
import FlickeringGrid from "@/components/ui/flickering-grid";
import Image from "next/image";
import { FAQ } from "@/components/faq";
import { Card } from "@/components/ui/card"
import { jsonLd } from './json-ld'
import { useState, useEffect, useRef } from "react";
import { PurchaseNotification } from "@/components/purchase-notification";
import { Input } from "@/components/ui/input";

const withoutUGC = [{
    title: "Traditional UGC",
    list: [
        "expensive to scale ($50-$90/video)",
        "takes 3-5 days to complete",
        "can't control the quality",
        "risk unwanted drama",
    ]
}]

const withUGC = [{
    title: "UGC Farm",
    list: [
        "scalable (~ $1/video)",
        "done in a 5 clicks",
        "tweak anything to your liking",
        "no creator drama",
    ]
}]

interface Review {
    img_url: string;
    vid_url: string;
    rotation: number;
}

const reviews: Review[] = [
    {
        "img_url": "https://cdn.ugc.farm/photos/079.webp",
        "vid_url": "https://cdn.ugc.farm/landing/1.mp4",
        "rotation": -1
    },
    {
        "img_url": "https://cdn.ugc.farm/photos/082.webp",
        "vid_url": "https://cdn.ugc.farm/landing/2.mp4",
        "rotation": 0
    },
    {
        "img_url": "https://cdn.ugc.farm/photos/112.webp",
        "vid_url": "https://cdn.ugc.farm/landing/3.mp4",
        "rotation": -2
    },
    {
        "img_url": "https://cdn.ugc.farm/photos/grasu_3.webp",
        "vid_url": "https://cdn.ugc.farm/landing/4.mp4",
        "rotation": 2
    },
    {
        "img_url": "https://cdn.ugc.farm/photos/036.webp",
        "vid_url": "https://cdn.ugc.farm/landing/5.mp4",
        "rotation": -1
    },
    {
        "img_url": "https://cdn.ugc.farm/photos/grasu_2.webp",
        "vid_url": "https://cdn.ugc.farm/landing/6.mp4",
        "rotation": 0
    },
]

const to_quote = (text: React.ReactNode) => {
    return (
        <span>
            <span className="font-bold opacity-50">“</span>
            {text}
            <span className="font-bold opacity-50">”</span>
        </span>
    )
}

export default function Landing() {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const ref = params ? params.get('ref') : null;
    const videoRefs = useRef<{ video1: HTMLVideoElement | null; video2: HTMLVideoElement | null }>({ video1: null, video2: null });
    const [isVideosPlaying, setIsVideosPlaying] = useState(false);
    const [videosEnded, setVideosEnded] = useState(false);
    const [userCountry, setUserCountry] = useState<{ country_flag: string, country_name: string, language: string | null } | null>(null);

    const handlePlayVideos = () => {
        if (videoRefs.current.video1 && videoRefs.current.video2) {
            // Reset videos if they were already played
            if (videosEnded) {
                videoRefs.current.video1.currentTime = 0;
                videoRefs.current.video2.currentTime = 0;
                setVideosEnded(false);
            }

            if (isVideosPlaying) {
                videoRefs.current.video1.pause();
                videoRefs.current.video2.pause();
            } else {
                videoRefs.current.video1.play();
                videoRefs.current.video2.play();
            }
            setIsVideosPlaying(!isVideosPlaying);
        }
    };

    useEffect(() => {
        const video1 = videoRefs.current.video1;
        const video2 = videoRefs.current.video2;

        if (video1 && video2) {
            const handleEnded = () => {
                // Check if both videos have ended
                if (video1.ended && video2.ended) {
                    setVideosEnded(true);
                    setIsVideosPlaying(false);
                }
            };

            video1.addEventListener('ended', handleEnded);
            video2.addEventListener('ended', handleEnded);

            return () => {
                video1.removeEventListener('ended', handleEnded);
                video2.removeEventListener('ended', handleEnded);
            };
        }
    }, []);

    // fetch user country
    useEffect(() => {
        const fetchUserCountry = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) {
                    throw new Error('Failed to fetch location data');
                }
                const data = await response.json();
                console.log(data);
                const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
                const languageName = data.languages ? displayNames.of(data.languages.split(',')[0]) : null;

                setUserCountry({
                    country_flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${data.country}.svg`,
                    country_name: data.country_name,
                    language: languageName || data.country_name
                });
            } catch (error) {
                console.error('Error fetching user country:', error);
            }
        };

        // Only run in browser environment
        if (typeof window !== 'undefined') {
            fetchUserCountry();
        }
    }, []);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="mt-40 mb-20 px-8 overflow-x-hidden">
                <div className="flex flex-col items-center justify-center mx-auto max-w-5xl space-y-12 overflow-x-hidden">

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
                        {[
                            { text: to_quote(<span>Got a 43% better CPC</span>), className: "flex" },
                            { text: to_quote("Helps me create On-Brand content in just a few clicks"), className: "hidden md:flex" },
                            { text: to_quote("AI UGC that shows my product"), className: "hidden md:flex" }
                        ].map((review, reviewIndex) => (
                            <div key={reviewIndex} className={`${review.className} flex-col items-center justify-center gap-1`}>
                                <div className="flex items-center justify-center gap-[0.5px]">
                                    {[...Array(5)].map((_, index) => (
                                        <Star key={index} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-base font-[600] text-[#1a1a1a]/75 text-center">
                                    {review.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-8">
                        <h1 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                            Reduce Content Creation Costs by 1000%
                        </h1>
                        <p className="text-lg md:text-xl font-[600] text-[#1a1a1a] opacity-60 text-center">
                            No wasted time. No wasted money. Perfect for online clothing stores.
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            {/* <MagneticButton> */}
                            <Link href="/#pricing">

                                <Button
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300"
                                >
                                    Start creating
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

                    {/* video demos */}
                    <div className="relative flex h-auto w-full flex-col items-center justify-center rounded-lg my-8">
                        {/* Left gradient overlay */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-20 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>

                        <div className="flex py-8 rounded-xl flex-row items-center justify-center gap-4 md:gap-6 overflow-x-auto w-full no-scrollbar pb-4">
                            {reviews.slice(0, 5).map((review, index) => (
                                <div
                                    key={index}
                                    className={`min-w-[164px] max-w-[180px] flex-shrink-0 animate-in fade-in zoom-in group ${index % 2 === 0 ? 'md:mt-8' : 'md:mb-8'} ${index % 3 === 1 ? 'lg:scale-110 z-10' : 'z-0'}`}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animationDuration: '300ms',
                                        transform: `translateY(${index % 2 === 0 ? '-8px' : '8px'})`,
                                    }}
                                >
                                    <VideoPreview
                                        imageUrl={review.img_url}
                                        videoUrl={review.vid_url}
                                        alt={`Preview ${index + 1}`}
                                        rotation={review.rotation}
                                        className="transition-all duration-300 hover:scale-110 hover:z-20 shadow-xl hover:shadow-2xl cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Right gradient overlay */}
                        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-20 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
                    </div>

                    {/* video from founder */}
                    {/* <div className="flex flex-col items-center justify-center space-y-8 py-12 w-full">
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
                    </div> */}

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
                            Why choose us for your store?
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
                            <div className="flex flex-col items-top text-left justify-start p-6 sm:p-8 border-2 border-green-500 bg-green-50 rounded-xl w-full sm:w-1/2">
                                <Smile className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                                <h3 className="mt-4 text-lg sm:text-xl font-extrabold text-green-500">{withUGC[0].title}</h3>
                                <ul className="mt-4 text-sm sm:text-base font-[600] text-green-700 list-disc list-inside">
                                    {withUGC[0].list.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link href="/#pricing" className="pt-12">
                            <Button
                                variant="default"
                                className="hover:scale-[1.05] transition-all duration-300"
                            >
                                Try it now&nbsp;&nbsp;&rarr;
                            </Button>
                        </Link>
                    </div>

                    {/* features */}
                    <div className="flex flex-col items-center justify-center space-y-12 py-16 w-full">
                        <div className="text-center">
                            {/* <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">HOW IT WORKS</p> */}
                            <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center max-w-4xl">
                                Create Viral AI Video Ads
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 h-full" style={{ animationDelay: '0ms', animationDuration: '600ms' }}>
                                <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold text-white">1</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center">Drop your product link</h3>
                                <div className="bg-primary/10 rounded-lg p-8 w-full flex items-center justify-center mb-6 overflow-hidden flex-grow">
                                    <p className="">
                                        <label htmlFor="product-url" className="text-sm font-[500] text-gray-600">Product</label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="product-url"
                                                placeholder="Enter your product url"
                                                className="w-full bg-white"
                                                required
                                                type="url"
                                            />
                                            <Button
                                                size="icon"
                                                className="w-12"
                                            >
                                                <Send className="w-4 h-4 text-white p-1" />
                                            </Button>
                                        </div>
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 h-full" style={{ animationDelay: '150ms', animationDuration: '600ms' }}>
                                <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center">Choose your script</h3>
                                <div className="bg-primary/10 rounded-lg p-6 w-full flex flex-col items-center justify-center mb-6 flex-grow">
                                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                                        <div className="w-full bg-white rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                            <p className="font-semibold text-gray-800 mb-2 flex items-center justify-between">Problem-Solution Hook <span className="text-sm text-primary lowercase">Selected</span></p>
                                            <p className="text-sm text-gray-600">Highlight a pain point and show how your product solves it</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms', animationDuration: '600ms' }}>
                                <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center">Get Your Perfect Video</h3>
                                <div className="bg-primary/10 rounded-lg p-4 w-full flex items-center justify-center mb-6 overflow-hidden flex-grow">
                                    <div className="max-w-[50%] max-h-[200px] shadow-xl overflow-hidden" style={{ transform: 'translateY(10%)' }}>
                                        <div className="relative">
                                            <div className="">
                                                <Image
                                                    src="https://ugcfarm.b-cdn.net/Group%201.png"
                                                    alt="AI avatar"
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/#pricing">
                            <ButtonSmall
                                variant="default"
                                className="hover:scale-[1.05] transition-all duration-300 mt-4 px-10 py-8 text-2xl font-bold"
                            >
                                Try it now&nbsp;&nbsp;&rarr;
                            </ButtonSmall>
                        </Link>
                    </div>

                    {/* language support */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8 py-16 w-full">
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a]">
                                29 languages
                            </h2>
                            <span className="text-base font-[600] flex items-center gap-2">
                                &rarr;&nbsp;&nbsp;yes, even in<span className="underline">{userCountry?.language || userCountry?.country_name + " language"}</span>
                                {userCountry?.country_flag && (
                                    <img src={userCountry?.country_flag} alt={userCountry?.language || userCountry?.country_name} className="w-6 h-4 inline-block rounded-[2px]" />
                                )}
                            </span>
                            <p className="text-lg font-[600] text-[#1a1a1a] opacity-60">
                                Break language barriers and scale your brand worldwide. Create UGC videos in any language to connect with customers on every continent.
                            </p>
                            <Link href="/#pricing">
                                <ButtonSmall
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300 font-bold mt-4"
                                >
                                    Get started&nbsp;&nbsp;&rarr;
                                </ButtonSmall>
                            </Link>
                        </div>
                        <div className="w-full md:w-1/2 bg-primary/5 p-6 rounded-xl">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { flag: "🇳🇱", name: "Dutch" },
                                    { flag: "🇪🇸", name: "Spanish" },
                                    { flag: "🇫🇷", name: "French" },
                                    { flag: "🇵🇹", name: "Portuguese" },
                                    { flag: "🇮🇳", name: "Hindi" },
                                    { flag: "🇦🇪", name: "Arabic" },
                                    { flag: "🇩🇪", name: "German" },
                                    { flag: "🇮🇹", name: "Italian" },
                                    { flag: "🇯🇵", name: "Japanese" },
                                ].map((lang, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-100 shadow-sm animate-in fade-in"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className="font-medium">{lang.name}</span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center p-3 bg-primary/10 rounded-lg border border-primary/20 shadow-sm">
                                    <span className="font-medium text-primary">+20 more</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* try on */}
                    <div className="flex flex-col md:flex-row-reverse items-start justify-between gap-8 py-16 w-full">
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a]">
                                Dress models with your products
                            </h2>
                            <p className="text-lg font-[600] text-[#1a1a1a] opacity-60">
                                Simply Drag & Drop your item and a model of your choice will wear it in a static photo, or actual video
                            </p>
                            <Link href="/#pricing">
                                <ButtonSmall
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300 font-bold mt-4"
                                >
                                    Try it now&nbsp;&nbsp;&rarr;
                                </ButtonSmall>
                            </Link>
                        </div>
                        <div className="w-full md:w-1/2 bg-primary/5 p-6 rounded-xl">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-md">
                                    <Image
                                        src="https://cdn.ugc.farm/avatar.webp"
                                        alt="AI holding product"
                                        width={300}
                                        height={534}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    {/* T-shirt/garment image */}
                                    <div className="w-20 h-20 rounded-md overflow-hidden shadow-sm border-2 border-primary/20">
                                        <Image
                                            src="https://cdn.ugc.farm/garment.jpg"
                                            alt="Garment to try on"
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-contain bg-[#F6F6F6]"
                                        />
                                    </div>
                                    {/* Arrow */}
                                    <MoveRight className="w-[60px] h-[60px] object-cover text-primary" />
                                </div>
                                <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-md">
                                    <Image
                                        src="https://cdn.ugc.farm/avatar_dressed.webp"
                                        alt="AI holding product"
                                        width={300}
                                        height={534}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* lipsync */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8 py-16 w-full">
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a]">
                                Perfect lip sync technology
                            </h2>
                            <p className="text-lg font-[600] text-[#1a1a1a] opacity-60">
                                Our AI perfectly synchronizes lips with your script in any language. Create natural-looking videos that connect with your audience on a deeper level.
                            </p>
                            <Link href="/#pricing">
                                <ButtonSmall
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300 font-bold mt-4"
                                >
                                    Get started&nbsp;&nbsp;&rarr;
                                </ButtonSmall>
                            </Link>
                        </div>
                        <div className="w-full md:w-1/2 bg-primary/5 p-6 rounded-xl">
                            <div className="grid grid-cols-3 gap-3 relative">
                                <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-md relative">
                                    <video
                                        ref={el => { if (el) videoRefs.current.video1 = el }}
                                        src="https://cdn.ugc.farm/avatars/010.mp4"
                                        width={300}
                                        height={534}
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    {/* Arrow */}
                                    <MoveRight className="w-[60px] h-[60px] object-cover text-primary" />
                                </div>
                                <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-md relative">
                                    <video
                                        ref={el => { if (el) videoRefs.current.video2 = el }}
                                        src="https://cdn.ugc.farm/010_lipsync.mp4"
                                        width={300}
                                        height={534}
                                        className="w-full h-full object-cover"
                                        playsInline
                                    />
                                </div>

                                {/* Show Me button overlay */}
                                {!isVideosPlaying && !videosEnded && (
                                    <button
                                        onClick={handlePlayVideos}
                                        className="absolute inset-0 flex items-center justify-center bg-black/80 hover:bg-black/85 transition-colors z-10 col-span-3 rounded-lg"
                                    >
                                        <div className="relative group">
                                            {/* Pulsing background effect */}
                                            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75 group-hover:opacity-100"></div>
                                            {/* Glow effect */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            {/* Main button */}
                                            <div className="relative bg-gradient-to-br from-primary to-primary/90 text-white font-bold py-4 px-8 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(255,117,56,0.5)] transform hover:scale-105 transition-all duration-300 border border-primary/20">
                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-70">
                                                        <Play className="w-6 h-6 fill-white" />
                                                    </div>
                                                    <Play className="w-6 h-6 fill-white" />
                                                </div>
                                                <span className="text-lg">Show Me the Magic</span>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {/* Play Again button that appears after videos end */}
                                {videosEnded && (
                                    <button
                                        onClick={handlePlayVideos}
                                        className="absolute inset-0 flex items-center justify-center bg-black/80 hover:bg-black/85 transition-colors z-10 col-span-3 rounded-lg"
                                    >
                                        <div className="relative group">
                                            {/* Subtle glow effect */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            {/* Main button */}
                                            <div className="relative bg-gradient-to-br from-primary to-primary/90 text-white font-bold py-4 px-8 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(255,117,56,0.5)] transform hover:scale-105 transition-all duration-300 border border-primary/20">
                                                <div className="relative">
                                                    <Play className="w-6 h-6 fill-white" />
                                                </div>
                                                <span className="text-lg">Play Again</span>
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>
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

                    {/* <div className="flex flex-col items-center justify-center rounded-md gap-8 py-12 w-full bg-primary/5">
                        <img
                            src="https://placehold.co/1000"
                            alt="Avatar"
                            className="w-28 h-28 rounded-full"
                        />
                        <h2 className="text-xl md:text-2xl font-[900] text-[#1a1a1a] text-center">
                            Hi, it's Arthur from UGC Farm
                        </h2>

                        <p className="text-lg font-[450] text-black/80 max-w-xl mx-auto">
                            <strong>{"I used to hate marketing."}</strong>
                            <br /><br />
                            {"Creating landing pages, writing emails, recording videos — everything felt like torture."}
                            <br /><br />
                            {"It was a naive mistake."}
                            <br /><br />
                            {"I did everything from scratch myself. I tried to work harder, not smarter."}
                            <br /><br />
                            {"As a result, I got tired quickly. And instead of 10 marketing tasks, I only finished 2."}
                            <br /><br />
                            <strong>{"AI fixed that."}</strong>
                            <br /><br />
                            {"I went from anxious 'I don't have enough time' to calm 'I focus on what matters.'"}
                            <br /><br />
                            {"That’s why I built FounderPal. "}
                            <strong>{"An AI marketing platform that is available 24/7 to GROW your business."}</strong>
                            <br /><br />
                            {"It understands your context. It knows what’s working in your industry. It is made for Founders like you."}
                            <br /><br />
                            {"FounderPal will save you 100+ hours of marketing procrastination EVERY MONTH."}
                            <br /><br />
                            <strong>{"Tired of hating marketing?"}</strong>
                            <br /><br />
                            {"Get an AI marketing partner today."}
                        </p>

                        <Link href="/#pricing">
                            <ButtonSmall
                                variant="default"
                                className="hover:scale-[1.05] transition-all duration-300 font-bold mt-4"
                            >
                                Get started&nbsp;&nbsp;&rarr;
                            </ButtonSmall>
                        </Link>

                        <div className="flex flex-row gap-4">
                            <p className="text-lg font-[450] text-black/80 max-w-xl mx-auto">
                                "FounderPal is a game-changer for me. It saves me so much time and effort."
                            </p>
                            <p className="text-lg font-[450] text-black/80 max-w-xl mx-auto bg-primary/50">
                                "FounderPal is a game-changer for me. It saves me so much time and effort."
                            </p>
                            <p className="text-lg font-[450] text-black/80 max-w-xl mx-auto">
                                "FounderPal is a game-changer for me. It saves me so much time and effort."
                            </p>
                        </div>
                    </div> */}

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
                                Get better results, faster.
                            </h2>
                            <Link href="/#pricing">
                                <Button variant="default" className="hover:scale-[1.05] hover:bg-primary/90 bg-primary text-background transition-all duration-300">
                                    Start Creating Today
                                    <ArrowRight />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main >
            <Footer />
            <PurchaseNotification />
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
