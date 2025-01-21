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
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from "lucide-react"
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
import { usePathname } from "next/navigation"
import { TextShimmer } from "@/components/ui/text-shimmer"

export default function Page() {
    const [index, setIndex] = useState(0)
    const [timer, setTimer] = useState(0)
    const [demoPage, setDemoPage] = useState(1)
    const [videoPage, setVideoPage] = useState(1)
    const [sentences, setSentences] = useState([
        "Customize your own sentences here 1",
        "Customize your own sentences here 2",
        "Customize your own sentences here 3",
        "Customize your own sentences here 4",
        "Customize your own sentences here 5",
    ])
    const [selectedPhotoId, setSelectedPhotoId] = useState<number>(1)
    const [location, setLocation] = useState<string>("http://localhost:3000")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLocation(window.location.origin)
    }, [])

    const photos = [
        { id: 1, url: `${location}/homepage/previews/1.png`, alt: "Photo 1" },
        { id: 2, url: `${location}/homepage/previews/2.png`, alt: "Photo 2" },
        { id: 3, url: `${location}/homepage/previews/3.png`, alt: "Photo 3" },
        { id: 4, url: `${location}/homepage/previews/4.png`, alt: "Photo 4" },
        { id: 5, url: `${location}/homepage/previews/5.png`, alt: "Photo 5" },
        { id: 6, url: `${location}/homepage/previews/1.png`, alt: "Photo 6" },
        { id: 7, url: `${location}/homepage/previews/2.png`, alt: "Photo 7" },
        { id: 8, url: `${location}/homepage/previews/3.png`, alt: "Photo 8" },
        { id: 9, url: `${location}/homepage/previews/4.png`, alt: "Photo 9" },
        { id: 10, url: `${location}/homepage/previews/5.png`, alt: "Photo 10" },
        { id: 11, url: `${location}/homepage/previews/1.png`, alt: "Photo 11" },
        { id: 12, url: `${location}/homepage/previews/2.png`, alt: "Photo 12" },
        { id: 13, url: `${location}/homepage/previews/3.png`, alt: "Photo 13" },
        { id: 14, url: `${location}/homepage/previews/4.png`, alt: "Photo 14" },
        { id: 15, url: `${location}/homepage/previews/5.png`, alt: "Photo 15" },
        { id: 16, url: `${location}/homepage/previews/1.png`, alt: "Photo 16" },
        { id: 17, url: `${location}/homepage/previews/2.png`, alt: "Photo 17" },
        { id: 18, url: `${location}/homepage/previews/3.png`, alt: "Photo 18" },
        { id: 19, url: `${location}/homepage/previews/4.png`, alt: "Photo 19" },
        { id: 20, url: `${location}/homepage/previews/5.png`, alt: "Photo 20" },
    ]

    const onPhotoSelect = (id: number) => {
        setSelectedPhotoId(id)
    }

    const nextDemoPage = () => {
        if (demoPage < Math.ceil(photos.length / 5)) {
            setDemoPage((prev) => prev + 1)
        }
    }

    const nextVideoPage = () => {
        if (videoPage < Math.ceil(photos.length / 5)) {
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
                                    <video
                                        src={`${location}/video/vid1.mp4`}
                                        autoPlay
                                        // loop
                                        muted
                                        playsInline
                                        // controls
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
                                                {videoPage}/{Math.ceil(photos.length / 10)}
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
                                                {demoPage}/{Math.ceil(photos.length / 5)}
                                            </span>
                                            <button className="text-[#1a1a1a]/50" onClick={nextDemoPage}>
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <DemoList
                                        photos={photos}
                                        selectedPhotoId={selectedPhotoId}
                                        onPhotoSelect={onPhotoSelect}
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
                                                    <SelectItem value="Helvetica" className="truncate">Helvetica</SelectItem>
                                                    <SelectItem value="Times New Roman" className="truncate">Times New Roman</SelectItem>
                                                    <SelectItem value="Georgia" className="truncate">Georgia</SelectItem>
                                                    <SelectItem value="Palatino" className="truncate">Palatino</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* TEXT COLOR */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Text Color
                                            </label>
                                            <div className="w-full">
                                                <ColorPicker defaultValue="#fff" showText allowClear className="p-[0.325rem]" />
                                            </div>
                                        </div>

                                        {/* STROKE COLOR */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Stroke Color
                                            </label>
                                            <div className="w-full">
                                                <ColorPicker defaultValue="#000" showText allowClear className="p-[0.325rem]" />
                                            </div>
                                        </div>

                                        {/* SHADOW COLOR */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Shadow Color
                                            </label>
                                            <div className="w-full">
                                                <ColorPicker defaultValue="#000" showText allowClear className="p-[0.325rem]" />
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
