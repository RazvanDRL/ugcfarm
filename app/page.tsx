"use client"
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/button";
import Link from "next/link";
import { VideoPreview } from "@/components/video-preview";
import { Footer } from "@/components/footer";
import Pricing from "@/components/pricing";
import { ArrowRight, Smile, Frown } from "lucide-react";
import { ROICalculator } from "@/components/roi-calculator"
import FlickeringGrid from "@/components/ui/flickering-grid";
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import Image from "next/image";

const withoutUGC = [{
    title: "You without UGC Farm",
    list: [
        "Stuck on tutorials instead of actually writing",
        "Doubting your skills",
        "Getting generic, one-size-fits-all advice",
        "Struggling to a land client with an empty portfolio",
    ]
}]

const withUGC = [{
    title: "You with UGC Farm",
    list: [
        "Able to put your skills into practice",
        "Building confidence with every exercise",
        "Getting personalized feedback that matters",
        "Landing clients with a professional portfolio",
    ]
}]

const reviews = [
    {
        img_url: "/homepage/previews/1.webp",
        rotation: -1,
    },
    {
        img_url: "/homepage/previews/2.webp",
        rotation: 1,
    },
    {
        img_url: "/homepage/previews/3.webp",
        rotation: 1,
    },
    {
        img_url: "/homepage/previews/4.webp",
        rotation: 2,
    },
    {
        img_url: "/homepage/previews/5.webp",
        rotation: 1,
    },
    {
        img_url: "/homepage/previews/1.webp",
        rotation: 1,
    },
    {
        img_url: "/homepage/previews/2.webp",
        rotation: 1,
    },
];

const factor = 1.5;

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img_url,
    rotation,
}: {
    img_url: string;
    rotation: number;
}) => {
    return (
        <figure
            style={{
                width: `${Math.round(90 * factor)}px`,
                height: `${Math.round(160 * factor)}px`,
                transform: `rotate(${rotation}deg)`,
            }}
            className={cn(
                "relative aspect-[9/16] cursor-pointer rounded-2xl overflow-hidden hover:shadow-md border-4 border-white",
            )}
        >
            <div className="relative flex flex-col h-full">
                <Image
                    src={img_url}
                    alt="Preview"
                    fill
                    className="rounded-2xl border-4 border-white object-cover"
                />
            </div>
        </figure>
    );
};

export default function Landing() {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const ref = params ? params.get('ref') : null;

    return (
        <>
            <Navbar />
            <main className="mt-40 mb-20 px-8">
                <div className="flex flex-col items-center justify-center mx-auto max-w-5xl space-y-12">
                    <div className="flex flex-col items-center justify-center space-y-8">
                        <h1 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            Create months of TikTok <br />content in minutes
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                            perfect for busy owners who want to drive clicks to their website
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Link href="/#pricing">
                                <Button
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300"
                                >
                                    Start now
                                </Button>
                            </Link>
                            <Link href="/demo" className="text-sm opacity-80 font-[600] text-[#1a1a1a]/60 flex items-center hover:underline">
                                {/* See demo <ArrowRight className="ml-1 w-4 h-4" /> */}
                                Lock in lifetime pricing before launch
                            </Link>
                        </div>
                    </div>

                    {/* videos */}
                    {/* <div className="flex justify-center gap-2 w-full overflow-x-auto px-4 py-8 mx-auto">
                        <VideoPreview
                            imageUrl="/homepage/previews/1.webp"
                            alt="Preview 1"
                            rotation={-1}
                        />
                        <VideoPreview
                            imageUrl="/homepage/previews/2.webp"
                            alt="Preview 2"
                            rotation={1}
                            className="-mt-6 mb-6"
                        />
                        <VideoPreview
                            imageUrl="/homepage/previews/3.webp"
                            alt="Preview 3"
                            rotation={1}
                        />
                        <VideoPreview
                            imageUrl="/homepage/previews/4.webp"
                            alt="Preview 4"
                            rotation={2}
                            className="-mt-6 mb-6"
                        />
                        <VideoPreview
                            imageUrl="/homepage/previews/5.webp"
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
                        <h2 className="text-5xl font-[900] text-[#1a1a1a] text-center">
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
                    <div className="flex flex-col items-center justify-center space-y-8 py-12">
                        <h2 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            Never pay <span className="text-primary decoration-primary underline underline-offset-4 decoration-dashed">extra</span> again.
                        </h2>
                        {/* 2 cards side by side */}
                        <div className="mt-16 flex flex-col sm:flex-row items-stretch justify-center gap-6 w-full">
                            <div className="flex flex-col items-left text-left justify-center p-6 sm:p-8 bg-red-50 rounded-xl w-full sm:w-1/2">
                                <Frown className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                                <h3 className="mt-4 text-lg sm:text-xl font-extrabold text-red-500">{withoutUGC[0].title}</h3>
                                <ul className="mt-4 text-sm sm:text-base font-medium text-red-700 list-disc list-inside">
                                    {withoutUGC[0].list.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col items-top text-left justify-start p-6 sm:p-8 bg-green-50 rounded-xl w-full sm:w-1/2">
                                <Smile className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                                <h3 className="mt-4 text-lg sm:text-xl font-extrabold text-green-500">{withUGC[0].title}</h3>
                                <ul className="mt-4 text-sm sm:text-base font-medium text-green-700 list-disc list-inside">
                                    {withUGC[0].list.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* pricing */}
                    <Pricing id="pricing" className="w-full py-12 px-6 lg:px-0.5" referral={ref} />

                    {/* cta */}
                    <div className="size-[300px] rounded-lg w-full bg-background overflow-hidden border relative">
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
                            <h2 className="text-5xl text-primary font-[900] text-center">
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
