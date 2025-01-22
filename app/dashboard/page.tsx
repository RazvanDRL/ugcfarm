"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { WordSlider } from "@/components/slider"
import { useEffect, useState } from "react"
import { PhotoList } from "@/components/videos"
import { DemoList } from "@/components/demos"
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, Loader, PlayIcon } from "lucide-react"
import { CommandShortcut } from "@/components/ui/command"
import { ColorPicker } from 'antd';
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { TextShimmer } from "@/components/ui/text-shimmer"

export default function Page() {
    const [index, setIndex] = useState(0)
    const [demoPage, setDemoPage] = useState(1)
    const [videoPage, setVideoPage] = useState(1)
    const [sentences, setSentences] = useState([
        "One decision can change your life",
        "How to start dropshipping for $10 (in 2025)",
        "This simple trick doubles your sales, immediately!",
        "How much is a smart brand owner making per month?",
        "Learn how to get your first 100K views on TikTok",
    ])
    const [selectedPhotoId, setSelectedPhotoId] = useState<number>(1)
    const [selectedDemoId, setSelectedDemoId] = useState<number>(1)
    const [location, setLocation] = useState<string>("http://localhost:3000")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLocation(window.location.origin)
    }, [])

    const photos = [
        {
            "id": 1,
            "url": "https://ugcfarm.b-cdn.net/photos/1.webp?class=dashboard",
            "alt": "UGC Avatar 1"
        },
        {
            "id": 2,
            "url": "https://ugcfarm.b-cdn.net/photos/2.webp?class=dashboard",
            "alt": "UGC Avatar 2"
        },
        {
            "id": 3,
            "url": "https://ugcfarm.b-cdn.net/photos/3.webp?class=dashboard",
            "alt": "UGC Avatar 3"
        },
        {
            "id": 4,
            "url": "https://ugcfarm.b-cdn.net/photos/4.webp?class=dashboard",
            "alt": "UGC Avatar 4"
        },
        {
            "id": 5,
            "url": "https://ugcfarm.b-cdn.net/photos/5.webp?class=dashboard",
            "alt": "UGC Avatar 5"
        },
        {
            "id": 6,
            "url": "https://ugcfarm.b-cdn.net/photos/6.webp?class=dashboard",
            "alt": "UGC Avatar 6"
        },
        {
            "id": 7,
            "url": "https://ugcfarm.b-cdn.net/photos/7.webp?class=dashboard",
            "alt": "UGC Avatar 7"
        },
        {
            "id": 8,
            "url": "https://ugcfarm.b-cdn.net/photos/8.webp?class=dashboard",
            "alt": "UGC Avatar 8"
        },
        {
            "id": 9,
            "url": "https://ugcfarm.b-cdn.net/photos/9.webp?class=dashboard",
            "alt": "UGC Avatar 9"
        },
        {
            "id": 10,
            "url": "https://ugcfarm.b-cdn.net/photos/10.webp?class=dashboard",
            "alt": "UGC Avatar 10"
        },
        {
            "id": 11,
            "url": "https://ugcfarm.b-cdn.net/photos/11.webp?class=dashboard",
            "alt": "UGC Avatar 11"
        },
        {
            "id": 12,
            "url": "https://ugcfarm.b-cdn.net/photos/12.webp?class=dashboard",
            "alt": "UGC Avatar 12"
        },
        {
            "id": 13,
            "url": "https://ugcfarm.b-cdn.net/photos/13.webp?class=dashboard",
            "alt": "UGC Avatar 13"
        },
        {
            "id": 14,
            "url": "https://ugcfarm.b-cdn.net/photos/14.webp?class=dashboard",
            "alt": "UGC Avatar 14"
        },
        {
            "id": 15,
            "url": "https://ugcfarm.b-cdn.net/photos/15.webp?class=dashboard",
            "alt": "UGC Avatar 15"
        },
        {
            "id": 16,
            "url": "https://ugcfarm.b-cdn.net/photos/16.webp?class=dashboard",
            "alt": "UGC Avatar 16"
        },
        {
            "id": 17,
            "url": "https://ugcfarm.b-cdn.net/photos/17.webp?class=dashboard",
            "alt": "UGC Avatar 17"
        },
        {
            "id": 18,
            "url": "https://ugcfarm.b-cdn.net/photos/18.webp?class=dashboard",
            "alt": "UGC Avatar 18"
        },
        {
            "id": 19,
            "url": "https://ugcfarm.b-cdn.net/photos/19.webp?class=dashboard",
            "alt": "UGC Avatar 19"
        },
        {
            "id": 20,
            "url": "https://ugcfarm.b-cdn.net/photos/20.webp?class=dashboard",
            "alt": "UGC Avatar 20"
        },
        {
            "id": 21,
            "url": "https://ugcfarm.b-cdn.net/photos/21.webp?class=dashboard",
            "alt": "UGC Avatar 21"
        },
        {
            "id": 22,
            "url": "https://ugcfarm.b-cdn.net/photos/22.webp?class=dashboard",
            "alt": "UGC Avatar 22"
        },
        {
            "id": 23,
            "url": "https://ugcfarm.b-cdn.net/photos/23.webp?class=dashboard",
            "alt": "UGC Avatar 23"
        },
        {
            "id": 24,
            "url": "https://ugcfarm.b-cdn.net/photos/24.webp?class=dashboard",
            "alt": "UGC Avatar 24"
        },
        {
            "id": 25,
            "url": "https://ugcfarm.b-cdn.net/photos/25.webp?class=dashboard",
            "alt": "UGC Avatar 25"
        },
        {
            "id": 26,
            "url": "https://ugcfarm.b-cdn.net/photos/26.webp?class=dashboard",
            "alt": "UGC Avatar 26"
        },
        {
            "id": 27,
            "url": "https://ugcfarm.b-cdn.net/photos/27.webp?class=dashboard",
            "alt": "UGC Avatar 27"
        },
        {
            "id": 28,
            "url": "https://ugcfarm.b-cdn.net/photos/28.webp?class=dashboard",
            "alt": "UGC Avatar 28"
        },
        {
            "id": 29,
            "url": "https://ugcfarm.b-cdn.net/photos/29.webp?class=dashboard",
            "alt": "UGC Avatar 29"
        },
        {
            "id": 30,
            "url": "https://ugcfarm.b-cdn.net/photos/30.webp?class=dashboard",
            "alt": "UGC Avatar 30"
        },
        {
            "id": 31,
            "url": "https://ugcfarm.b-cdn.net/photos/31.webp?class=dashboard",
            "alt": "UGC Avatar 31"
        },
        {
            "id": 32,
            "url": "https://ugcfarm.b-cdn.net/photos/32.webp?class=dashboard",
            "alt": "UGC Avatar 32"
        },
        {
            "id": 33,
            "url": "https://ugcfarm.b-cdn.net/photos/33.webp?class=dashboard",
            "alt": "UGC Avatar 33"
        },
        {
            "id": 34,
            "url": "https://ugcfarm.b-cdn.net/photos/34.webp?class=dashboard",
            "alt": "UGC Avatar 34"
        },
        {
            "id": 35,
            "url": "https://ugcfarm.b-cdn.net/photos/35.webp?class=dashboard",
            "alt": "UGC Avatar 35"
        },
        {
            "id": 36,
            "url": "https://ugcfarm.b-cdn.net/photos/36.webp?class=dashboard",
            "alt": "UGC Avatar 36"
        },
        {
            "id": 37,
            "url": "https://ugcfarm.b-cdn.net/photos/37.webp?class=dashboard",
            "alt": "UGC Avatar 37"
        },
        {
            "id": 38,
            "url": "https://ugcfarm.b-cdn.net/photos/38.webp?class=dashboard",
            "alt": "UGC Avatar 38"
        },
        {
            "id": 39,
            "url": "https://ugcfarm.b-cdn.net/photos/39.webp?class=dashboard",
            "alt": "UGC Avatar 39"
        },
        {
            "id": 40,
            "url": "https://ugcfarm.b-cdn.net/photos/40.webp?class=dashboard",
            "alt": "UGC Avatar 40"
        },
        {
            "id": 41,
            "url": "https://ugcfarm.b-cdn.net/photos/41.webp?class=dashboard",
            "alt": "UGC Avatar 41"
        },
    ]

    const demos = [
        {
            "id": 1,
            "url": "https://ugcfarm.b-cdn.net/demo/demo_2.webp?class=landing",
            "alt": "UGC Demo 1"
        },
        {
            "id": 2,
            "url": "https://ugcfarm.b-cdn.net/demo/demo_1.webp?class=landing",
            "alt": "UGC Demo 2"
        },
        {
            "id": 3,
            "url": "https://ugcfarm.b-cdn.net/demo/demo_3.webp?class=landing",
            "alt": "UGC Demo 3"
        },
    ]

    const onPhotoSelect = (id: number) => {
        setSelectedPhotoId(id)
    }

    const onDemoSelect = (id: number) => {
        setSelectedDemoId(id)
    }

    const nextDemoPage = () => {
        if (demoPage < Math.ceil(photos.length / 5)) {
            setDemoPage((prev) => prev + 1)
        }
    }

    const nextVideoPage = () => {
        if (videoPage < Math.ceil(photos.length / 21)) {
            setVideoPage((prev) => prev + 1)
        }
    }

    const previousDemoPage = () => {
        if (demoPage > 1) {
            setDemoPage((prev) => prev - 1)
        }
    }

    const previousVideoPage = () => {
        if (videoPage > 1) {
            setVideoPage((prev) => prev - 1)
        }
    }

    const nextButton = () => {
        setIndex((prev) => (prev + 1) % sentences.length);
    }

    const previousButton = () => {
        setIndex((prev) => (prev - 1 + sentences.length) % sentences.length);
    }

    const updateSentence = (newText: string) => {
        setSentences(prev => {
            const newSentences = [...prev];
            newSentences[index] = newText;
            return newSentences;
        });
    }

    const createVideo = () => {
        setLoading(true)
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Platform
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Create Video</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-10 pt-6">
                    <CommandShortcut className="hidden md:flex rounded-l-none max-w-fit border-l-0 bg-secondary px-2 py-0.5">
                        Pro Tip: Use (Shift + ← or Shift + →) to navigate between hooks
                    </CommandShortcut>
                    <div className="grid auto-rows-min md:grid-cols-2 grid-cols-1 gap-4 h-[calc(100vh-5rem)]">
                        {/* Video Preview */}
                        <div className="md:col-start-2 space-y-4 order-first md:order-last">
                            <div className="h-auto aspect-square relative rounded-xl bg-[#A4A4A4]/10">
                                <div className="relative w-full h-full">
                                    {/* <video
                                        src={`${location}/video/vid1.mp4`}
                                        autoPlay
                                        // loop
                                        muted
                                        playsInline
                                        // controls
                                        className="h-full w-auto object-contain absolute top-0 left-1/2 -translate-x-1/2 shadow-inner"
                                    /> */}
                                    <img
                                        src={`https://ugcfarm.b-cdn.net/photos/34.webp`}
                                        className="h-full w-auto object-contain absolute top-0 left-1/2 -translate-x-1/2 shadow-inner"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="p-4 rounded-full bg-black/50 cursor-pointer hover:bg-black/70 transition-colors">
                                            <PlayIcon className="w-12 h-12 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-end w-full">
                                {loading ? (
                                    <Button variant="outline" className="w-fit">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <TextShimmer className='font-mono text-sm' duration={2}>
                                            Generating video...
                                        </TextShimmer>
                                    </Button>
                                ) : (
                                    <Button onClick={createVideo} className="w-fit">
                                        Create video
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 order-last md:order-first">
                            {/* 1. Choose a hook */}
                            <div className="h-fit w-full rounded-xl bg-[#A4A4A4]/10">
                                <div className="flex flex-col items-start p-6">
                                    <div className="flex flex-row items-center justify-between w-full mb-6 md:mb-4">
                                        <p className="text-base font-[500] text-[#1a1a1a]/60">
                                            1. Choose a hook
                                        </p>
                                        <div className="text-sm font-[500] text-[#1a1a1a]/60">
                                            {index + 1}/{sentences.length}
                                        </div>
                                    </div>
                                    <WordSlider
                                        sentences={sentences}
                                        nextButton={nextButton}
                                        previousButton={previousButton}
                                        index={index}
                                        onTextChange={updateSentence}
                                    />
                                </div>
                            </div>

                            {/* 2. UGC Video */}
                            <div className="h-fit w-full rounded-xl bg-[#A4A4A4]/10">
                                <div className="flex flex-col items-start p-6">
                                    <div className="flex flex-row items-center justify-between w-full mb-6 md:mb-4">
                                        <p className="text-base font-[500] text-[#1a1a1a]/60">
                                            2. Choose your UGC avatar
                                        </p>
                                        <div className="flex flex-row items-center gap-2">
                                            <button className="text-[#1a1a1a]/50" onClick={previousVideoPage}>
                                                <ChevronLeftIcon className="w-5 h-5" />
                                            </button>
                                            <span className="text-sm font-[500] text-[#1a1a1a]/60">
                                                {videoPage}/{Math.ceil(photos.length / 21)}
                                            </span>
                                            <button className="text-[#1a1a1a]/50" onClick={nextVideoPage}>
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <PhotoList
                                        photos={photos}
                                        selectedPhotoId={selectedPhotoId}
                                        onPhotoSelect={onPhotoSelect}
                                        currentPage={videoPage}
                                    />
                                </div>
                            </div>

                            {/* 3. Demo */}
                            <div className="h-fit w-full rounded-xl bg-[#A4A4A4]/10">
                                <div className="flex flex-col items-start p-6">
                                    <div className="flex flex-row items-center justify-between w-full mb-6 md:mb-4">
                                        <p className="text-base font-[500] text-[#1a1a1a]/60">
                                            3. Choose your video
                                        </p>
                                        <div className="flex flex-row items-center gap-2">
                                            <button className="text-[#1a1a1a]/50" onClick={previousDemoPage}>
                                                <ChevronLeftIcon className="w-5 h-5" />
                                            </button>
                                            <span className="text-sm font-[500] text-[#1a1a1a]/60">
                                                {demoPage}/{Math.ceil(demos.length / 5)}
                                            </span>
                                            <button className="text-[#1a1a1a]/50" onClick={nextDemoPage}>
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <DemoList
                                        photos={demos}
                                        selectedPhotoId={selectedDemoId}
                                        onPhotoSelect={onDemoSelect}
                                        currentPage={demoPage}
                                    />
                                </div>
                            </div>

                            {/* 4. Text Settings */}
                            <div className="h-fit w-full rounded-xl bg-[#A4A4A4]/10">
                                <div className="flex flex-col items-start p-6">
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <p className="text-base font-[500] text-[#1a1a1a]/60 mb-4">
                                            4. Text Settings
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* FONT SIZE */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Font Size
                                            </label>
                                            <div className="relative w-full">
                                                <Input
                                                    type="number"
                                                    defaultValue={16}
                                                    min={1}
                                                    max={100}
                                                    step={1}
                                                    className="w-full bg-background pl-3 pr-8 font-[500]"
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        if (value < 1) e.target.value = "1";
                                                        if (value > 100) e.target.value = "100";
                                                    }}
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                    px
                                                </span>
                                            </div>
                                        </div>

                                        {/* FONT WEIGHT */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Font Weight
                                            </label>
                                            <Select defaultValue="500">
                                                <SelectTrigger className="w-full bg-background font-[500] truncate">
                                                    <SelectValue placeholder="Select weight" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-background font-[500]">
                                                    <SelectItem value="100" className="truncate">Thin (100)</SelectItem>
                                                    <SelectItem value="200" className="truncate">Extra Light (200)</SelectItem>
                                                    <SelectItem value="300" className="truncate">Light (300)</SelectItem>
                                                    <SelectItem value="400" className="truncate">Regular (400)</SelectItem>
                                                    <SelectItem value="500" className="truncate">Medium (500)</SelectItem>
                                                    <SelectItem value="600" className="truncate">Semi Bold (600)</SelectItem>
                                                    <SelectItem value="700" className="truncate">Bold (700)</SelectItem>
                                                    <SelectItem value="800" className="truncate">Extra Bold (800)</SelectItem>
                                                    <SelectItem value="900" className="truncate">Black (900)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* FONT FAMILY */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Font Family
                                            </label>
                                            <Select defaultValue="TikTok Font">
                                                <SelectTrigger className="w-full bg-background font-[500] truncate">
                                                    <SelectValue placeholder="Select font" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-background font-[500]">
                                                    <SelectItem value="TikTok Font" className="truncate">TikTok Font</SelectItem>
                                                    <SelectItem value="Arial" className="truncate">Arial</SelectItem>
                                                    <SelectItem value="Montserrat" className="truncate">Montserrat</SelectItem>
                                                    <SelectItem value="Inter" className="truncate">Inter</SelectItem>
                                                    <SelectItem value="Iman Gadzhi Font" className="truncate">Iman Gadzhi Font</SelectItem>
                                                    <SelectItem value="Alex Hormozi Font" className="truncate">Alex Hormozi Font</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* TEXT COLOR */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Text Color
                                            </label>
                                            <div className="w-full">
                                                <ColorPicker defaultValue="#fff" showText allowClear className="p-[0.325rem] hover:border-primary/80" />
                                            </div>
                                        </div>

                                        {/* STROKE COLOR */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Stroke Color
                                            </label>
                                            <div className="w-full">
                                                <ColorPicker defaultValue="#000" showText allowClear className="p-[0.325rem] hover:border-primary/80" />
                                            </div>
                                        </div>

                                        {/* SHADOW COLOR */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Shadow Color
                                            </label>
                                            <div className="w-full">
                                                <ColorPicker defaultValue="#000" showText allowClear className="p-[0.325rem] hover:border-primary/80" />
                                            </div>
                                        </div>

                                        {/* UPPERCASE */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Uppercase
                                            </label>
                                            <Switch />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
