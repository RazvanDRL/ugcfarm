"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/button";
import { Button as ButtonSmall } from "@/components/ui/button";
import Link from "next/link";
import { VideoPreview } from "@/components/video-preview";
import { Footer } from "@/components/footer";
import Pricing from "@/components/pricing";
import { ArrowRight, Smile, Frown, Star, X, Play, Wand2, MoveRight } from "lucide-react";
import FlickeringGrid from "@/components/ui/flickering-grid";
import Image from "next/image";
import { FAQ } from "@/components/faq";
import { Card } from "@/components/ui/card"
import { jsonLd } from './json-ld'
import { useState, useEffect, useRef } from "react";

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
    vid_url: string;
    rotation: number;
}

const reviews: Review[] = [
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/079.webp",
        "vid_url": "https://ugcfarm.b-cdn.net/landing/1.mp4",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/082.webp",
        "vid_url": "https://ugcfarm.b-cdn.net/landing/2.mp4",
        "rotation": 0
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/112.webp",
        "vid_url": "https://ugcfarm.b-cdn.net/landing/3.mp4",
        "rotation": -2
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/grasu_3.webp",
        "vid_url": "https://ugcfarm.b-cdn.net/landing/4.mp4",
        "rotation": 2
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/036.webp",
        "vid_url": "https://ugcfarm.b-cdn.net/landing/5.mp4",
        "rotation": -1
    },
    {
        "img_url": "https://ugcfarm.b-cdn.net/photos/grasu_2.webp",
        "vid_url": "https://ugcfarm.b-cdn.net/landing/6.mp4",
        "rotation": 0
    },
]

export default function Landing() {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const ref = params ? params.get('ref') : null;
    const [showCornerCard, setShowCornerCard] = useState(true);
    const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);
    const videoRefs = useRef<{ video1: HTMLVideoElement | null; video2: HTMLVideoElement | null }>({ video1: null, video2: null });
    const [isVideosPlaying, setIsVideosPlaying] = useState(false);
    const [videosEnded, setVideosEnded] = useState(false);

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
                                <h3 className="text-xl font-bold mb-4 text-center">Choose Your AI Influencer</h3>
                                <div className="bg-primary/10 rounded-lg p-8 w-full flex items-center justify-center mb-6 overflow-hidden flex-grow">
                                    <div className="w-[95%] max-w-md items-center justify-center grid grid-cols-3 grid-rows-2 gap-2">
                                        {/* Row 1 */}
                                        <div className="outline outline-4 outline-primary relative aspect-square bg-white rounded-lg overflow-hidden group cursor-pointer">
                                            <Image
                                                src={reviews[0].img_url}
                                                alt="Female avatar option"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="opacity-50 relative aspect-square bg-white rounded-lg overflow-hidden group cursor-pointer">
                                            <Image
                                                src={reviews[1].img_url}
                                                alt="Male avatar option"
                                                fill
                                                className="object-cover"
                                            />

                                        </div>

                                        <div className="opacity-50 relative aspect-square bg-white rounded-lg overflow-hidden group cursor-pointer">
                                            <Image
                                                src={reviews[2].img_url}
                                                alt="Female avatar option"
                                                fill
                                                className="object-cover"
                                            />

                                        </div>

                                        {/* Row 2 */}
                                        <div className="opacity-50 relative aspect-square bg-white rounded-lg overflow-hidden group cursor-pointer">
                                            <Image
                                                src={reviews[3].img_url}
                                                alt="Male avatar option"
                                                fill
                                                className="object-cover"
                                            />

                                        </div>

                                        <div className="opacity-50 relative aspect-square bg-white rounded-lg overflow-hidden group cursor-pointer">
                                            <Image
                                                src={reviews[4].img_url}
                                                alt="Female avatar option"
                                                fill
                                                className="object-cover"
                                            />

                                        </div>

                                        <div className="opacity-50 relative aspect-square bg-white rounded-lg overflow-hidden group cursor-pointer">
                                            <Image
                                                src={reviews[5].img_url}
                                                alt="Male avatar option"
                                                fill
                                                className="object-cover"
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 h-full" style={{ animationDelay: '150ms', animationDuration: '600ms' }}>
                                <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center">Customize Your Hook</h3>
                                <div className="bg-primary/10 rounded-lg p-6 w-full flex flex-col items-center justify-center mb-6 flex-grow">
                                    <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col">
                                        <p className="font-semibold text-gray-800 mb-2">Hook</p>
                                        <div className="relative flex-grow bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                            <textarea
                                                className="w-full h-full p-4 text-gray-600 bg-transparent outline-none resize-none min-h-[120px] focus:outline-none"
                                                placeholder="Type your hook here"
                                            />
                                            <div className="absolute bottom-3 right-3">
                                                <ButtonSmall
                                                    className="bg-white hover:bg-gray-50 text-primary border border-gray-200 shadow-sm"
                                                >
                                                    <span className="flex items-center">
                                                        <Wand2 className="w-4 h-4 mr-2 text-primary" />
                                                        Generate with AI
                                                    </span>
                                                </ButtonSmall>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms', animationDuration: '600ms' }}>
                                <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center">Generate & Perfect Your Video</h3>
                                <div className="bg-primary/10 rounded-lg p-4 w-full flex items-center justify-center mb-6 overflow-hidden flex-grow">
                                    <div className="max-w-[50%] max-h-[200px] shadow-xl overflow-hidden" style={{ transform: 'translateY(10%)' }}>
                                        <div className="relative">
                                            <div className="">
                                                <Image
                                                    src="https://ugcfarm.b-cdn.net/feature_3.webp"
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
                                Dress AI with your clothes
                            </h2>
                            <p className="text-lg font-[600] text-[#1a1a1a] opacity-60">
                                Display your product 100% with AI, our creators can now dress up in your brand&apos;s clothing.
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
                                        src="https://ugcfarm.b-cdn.net/avatar.webp"
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
                                            src="https://ugcfarm.b-cdn.net/garment.jpg"
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
                                        src="https://ugcfarm.b-cdn.net/avatar_dressed.webp"
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
                                        src="https://ugcfarm.b-cdn.net/avatars/010.mp4"
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
                                        src="https://ugcfarm.b-cdn.net/010_lipsync.mp4"
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
