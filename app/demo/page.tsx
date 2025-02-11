"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, ArrowRight, Rocket, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import ReactPlayer from 'react-player'
import React from 'react'

const demoVideos = [
    {
        id: 7,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/fd3de4cc-ce16-4d71-9f72-5075b68ab71d/playlist.m3u8",
    },
    {
        id: 8,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/d930aca8-7374-43db-8b9c-c998c58bdc73/playlist.m3u8",
    },
    {
        id: 9,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/29e1e221-581e-474e-924e-8fd8fa634dfb/playlist.m3u8",
    },
    {
        id: 10,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/e870e529-60c5-4722-88a3-de24f8c7f480/playlist.m3u8",
    },
    {
        id: 11,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/4fc36cc4-27e6-4363-8da2-a8d2cf10768b/playlist.m3u8",
    },
    {
        id: 12,
        videoUrl: "https://vz-c509880b-3e0.b-cdn.net/29bb6715-7b0d-4b20-8c8f-292b5c49e884/playlist.m3u8",
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
                            Transform Your Brand With<br />
                            <span className="text-primary">Proven UGC Strategies</span>
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                            Used by brands to increase conversions by 42% on average.
                        </p>
                        <Link href="/#pricing">
                            <Button className="px-6 py-6 text-lg font-bold">
                                Create your own video&nbsp;&nbsp;&rarr;
                            </Button>
                        </Link>
                    </div>

                    {/* Demo Videos Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full">
                        {[...demoVideos].reverse().map((video) => (
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
                                            preload="metadata"
                                            config={{
                                                file: {
                                                    attributes: {
                                                        playsInline: true,
                                                        preload: "metadata",
                                                        controlsList: "nodownload",
                                                        disablePictureInPicture: true,
                                                    }
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
                    <div className="mt-24 w-full">
                        <Card className="relative overflow-hidden border-2 border-primary/20 bg-primary/5 py-16 shadow-lg hover:shadow-xl transition-all">
                            <div className="mx-auto max-w-2xl text-center px-4">
                                <Badge variant="secondary" className="mb-6 px-4 py-2 font-bold text-sm bg-primary/10 text-primary hover:bg-primary/20">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Start Creating Today
                                </Badge>
                                <h2 className="text-5xl font-[900] text-[#1a1a1a] mb-6">
                                    Ready to Transform Your Content?
                                </h2>
                                <p className="text-xl text-[#1a1a1a]/60 mb-8 font-[500]">
                                    Boost your conversions with AI-powered UGC
                                </p>
                                <Link href="/#pricing">
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="h-[50px] px-8 py-6 text-lg font-bold hover:scale-105 transition-transform duration-300"
                                    >
                                        <Zap className="mr-2 h-5 w-5" />
                                        Launch Your First Campaign
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    )
}
