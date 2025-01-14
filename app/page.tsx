import { Navbar } from "@/components/navbar";
import { Button } from "@/components/button";
import Link from "next/link";
import { VideoPreview } from "@/components/video-preview";
import { Footer } from "@/components/footer";
import Pricing from "@/components/pricing";
import { ArrowRight } from "lucide-react";

export default function Landing() {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const ref = params ? params.get('ref') : null;

    return (
        <>
            <Navbar />
            <main className="mt-20 mb-20">
                <div className="flex flex-col items-center justify-center mx-auto max-w-5xl space-y-12">
                    <div className="flex flex-col items-center justify-center space-y-8">
                        <h1 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            Automate TikToks that drive<br />
                            traffic to your website
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                            it&apos;s like a gen z marketing team, but way cheaper
                        </p>
                        <Link href="/pricing">
                            <Button
                                variant="default"
                                className="hover:scale-[1.05] transition-all duration-300"
                            >
                                Start now
                            </Button>
                        </Link>
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

                    {/* pricing */}
                    <Pricing className="w-full px-6 lg:px-0" referral={ref} />

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
