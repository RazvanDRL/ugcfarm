"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import ReactPlayer from 'react-player'
import React from 'react'

const demoVideos = [
    {
        id: 1,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/a8df55e3-6397-46cb-b843-785107e734e9/playlist.m3u8",
    },
    {
        id: 2,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/3fbc0835-637d-4153-9083-295b925922d4/playlist.m3u8",
    },
    {
        id: 3,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/f2bccb6f-bcad-4345-b68c-badd82ce54b4/playlist.m3u8",
    },
    {
        id: 4,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/8d6bedc0-fbd3-45b3-902b-c0b58745cd85/playlist.m3u8",
    },
    {
        id: 5,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/cd000198-f3b0-49df-b043-1bd21169edb4/playlist.m3u8",
    },
    {
        id: 6,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/d07fda19-350f-404b-9104-d8c902029ae9/playlist.m3u8",
    },
    {
        id: 7,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/02ca629e-6fee-453a-b425-8f82a9586160/playlist.m3u8",
    },
    {
        id: 8,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/d13b7bf5-f4d8-42c3-8d07-ae8c9300134b/playlist.m3u8",
    },
]

export default function DemoPage() {
    const [playingId, setPlayingId] = React.useState<number | null>(null);

    return (
        <>
            <Navbar />
            <main className="mt-40 mb-20 px-8">
                <div className="flex flex-col items-center justify-center mx-auto max-w-5xl space-y-12">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center justify-center space-y-8 text-center">
                        <Badge variant="secondary" className="px-4 py-1 font-bold">
                            Demo Videos
                        </Badge>
                        <h1 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            See UGC Farm<br />
                            <span className="text-primary">In Action</span>
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                            Watch how brands are using UGC Farm to create converting content
                        </p>
                    </div>

                    {/* Demo Videos Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {demoVideos.map((video) => (
                            <Card key={video.id} className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                                <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                                    <div className="absolute inset-0">
                                        <ReactPlayer
                                            url={video.videoUrl}
                                            width="100%"
                                            height="100%"
                                            playing={playingId === video.id}
                                            muted
                                            loop
                                            controls={false}
                                            playsinline
                                            config={{
                                                file: {
                                                    forceHLS: true,
                                                }
                                            }}
                                        />
                                        <div
                                            className={`absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all cursor-pointer
                                                ${playingId === video.id ? 'opacity-0' : 'opacity-100'}`}
                                            onClick={() => setPlayingId(playingId === video.id ? null : video.id)}
                                        >
                                            <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center space-y-8">
                        <h2 className="text-4xl font-[900]">
                            Ready to create your own?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-[500]">
                            Start generating professional UGC content today
                        </p>
                        <Link href="/#pricing">
                            <Button
                                variant="default"
                                size="lg"
                                className="mt-8 hover:scale-[1.05] transition-all duration-300 font-[600] text-lg px-6 py-6"
                            >
                                Get Started Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    )
}
