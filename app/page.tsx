"use client"
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/button";
import Link from "next/link";
import { VideoPreview } from "@/components/video-preview";
import { Footer } from "@/components/footer";
import Pricing from "@/components/pricing";
import { ArrowRight, Smile, Frown } from "lucide-react";

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
                            Automate TikToks that drive<br />
                            traffic to your website
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                            it&apos;s like a gen z marketing team, but way cheaper
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Link href="/pricing">
                                <Button
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300"
                                >
                                    Start now
                                </Button>
                            </Link>
                            {/* <Link href="/demo" className="text-sm opacity-80 font-[600] text-primary flex items-center hover:underline">
                                See demo <ArrowRight className="ml-1 w-4 h-4" />
                            </Link> */}
                        </div>
                    </div>

                    {/* videos */}
                    <div className="flex justify-center gap-2 w-full overflow-x-auto px-4 py-8 mx-auto">
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
                    </div>

                    {/* problem agitation */}
                    <div className="flex flex-col items-center justify-center space-y-8">
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
                    <Pricing className="w-full px-6 lg:px-0.5" referral={ref} />

                    {/* cta */}
                    <div className="bg-primary rounded-lg p-16 w-full items-center justify-center flex flex-col space-y-8">
                        <h2 className="text-5xl font-[900] text-background text-center">
                            Ready to get started?
                        </h2>
                        <Link href="/pricing">
                            <Button variant="default" className="hover:scale-[1.05] hover:bg-background/90 bg-background text-primary transition-all duration-300">
                                Start now
                                <ArrowRight />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main >
            <Footer />
        </>
    );
}
