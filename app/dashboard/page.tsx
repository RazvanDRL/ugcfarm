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
import { useEffect, useState, useCallback } from "react"
import { PhotoList } from "@/components/videos"
import { DemoList } from "@/components/demos"
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, Loader, PlayIcon, WandSparkles } from "lucide-react"
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
import { Player } from "@remotion/player"
import { Main } from "@/remotion/MyComp/Main"
import { supabase, type User } from "@/lib/supabase/client/supabase"
import { useRouter } from "next/navigation"
import { useRendering } from "@/helpers/use-rendering"
import { COMP_NAME } from "@/types/constants"
import { toast } from "sonner"
import Link from "next/link"
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface InputProps {
    text: string;
    videoUrl: string;
    textStyle: {
        fontSize: number;
        fontWeight: number;
        fontFamily: string;
        textColor: string;
        strokeColor: string;
        shadowColor: string;
        uppercase: boolean;
    };
    videoProps: {
        uuid: string;
    };
    demos: string;
}

type Profile = {
    name: string
    email: string
    avatar: string
    credits: number
}

export default function Page() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
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
    const [loading, setLoading] = useState(false)
    const [videoDuration, setVideoDuration] = useState(5)
    const [textStyle, setTextStyle] = useState({
        fontSize: 48,
        fontWeight: 700,
        fontFamily: "TikTok",
        textColor: "#ffffff",
        strokeColor: "#000000",
        shadowColor: "#000000",
        uppercase: false,
    })
    const [inputProps, setInputProps] = useState<InputProps>({
        text: sentences[index],
        videoUrl: "https://ugcfarm.b-cdn.net/p0wJwTiPwMzqMXq9dm-5c_output.mp4",
        textStyle,
        videoProps: {
            uuid: "54be6352-a357-4b3d-a35b-c14c72c4263e"
        },
        demos: ""
    });
    const [video, setVideo] = useState<string>("")
    const [demos, setDemos] = useState<any[]>([])
    const [demoVideos, setDemoVideos] = useState<any[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [open, setOpen] = useState(false)
    const { renderMedia, state, setToken, token } = useRendering(COMP_NAME, inputProps);

    async function fetchVideo(id: string, access_token: string, bucket: string) {
        try {
            const response = await fetch(`/api/generate-signed-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ key: `${id}.mp4`, bucket: bucket }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch signed URL');
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Error fetching video:', error);
        }
    }

    async function fetchDemos(user: User, access_token: string) {
        if (!user) {
            toast.error("No user found");
            return;
        }

        let tempDemos: any[] = [];

        const { data: demos, error: demosError } = await supabase
            .from('user_demos')
            .select('*')
            .eq('user_id', user.id);

        if (demosError) {
            throw new Error('Failed to fetch demos');
        }

        for (const [index, demo] of demos.entries()) {
            setDemoVideos(prev => [...prev, demo.key.split('/')[1]])

            const response = await fetch(`/api/generate-signed-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ key: `${demo.key.split('/')[1].replace('.mp4', '')}-thumb.webp`, bucket: 'upload-bucket' }),
            });

            const data = await response.json();

            tempDemos.push({
                id: index + 1,
                url: data.url,
                alt: `Demo ${index + 1}`
            });
        }
        setDemos(tempDemos);
    }

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profileError) {
                    throw new Error('Failed to fetch profile');
                }

                setProfile(profile)

                const session = await supabase.auth.refreshSession()
                if (session.data.session?.access_token) {
                    fetchDemos(user, session.data.session?.access_token)
                    setToken(session.data.session?.access_token)
                    fetchVideo(inputProps.videoProps.uuid, session.data.session?.access_token, "output-bucket").then((url) => {
                        setVideo(url)
                    })
                    console.log("session data token found")
                } else {
                    toast.error("No access token found")
                }
            } else {
                router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
            }
        }

        getUser()
    }, [])

    useEffect(() => {
        if (state.status === "done") {
            fetchVideo(inputProps.videoProps.uuid, token, "output-bucket").then((url) => {
                setVideo(url)
            })
        }
    }, [state])

    useEffect(() => {
        setInputProps({
            text: sentences[index],
            videoUrl: "https://ugcfarm.b-cdn.net/p0wJwTiPwMzqMXq9dm-5c_output.mp4",
            textStyle,
            videoProps: {
                uuid: uuidv4()
            },
            demos: demoVideos[selectedDemoId]
        });
    }, [index, selectedPhotoId, textStyle, demos, selectedDemoId]);

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

    const onPhotoSelect = (id: number) => {
        setSelectedPhotoId(id)
    }

    const onDemoSelect = (id: number) => {
        setSelectedDemoId(id)
        const startTime = performance.now()
        const videoKey = demoVideos[selectedDemoId].replace('.mp4', '')
        console.log(videoKey)
        fetchVideo(videoKey, token, "upload-bucket").then((url) => {
            const endTime = performance.now()
            const duration = endTime - startTime
            console.log(`Fetching video took ${duration} milliseconds`)
            console.log(url)
            setInputProps({
                ...inputProps,
                demos: url
            })
        })
    }

    const nextDemoPage = () => {
        if (demoPage < Math.ceil(demos.length / 5)) {
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

    const createVideo = async () => {
        setLoading(true);
        try {
            await renderMedia();
        } catch (error) {
            console.error("Error rendering video:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setTextStyle(prev => ({
            ...prev,
            fontSize: value,
        }));
    }

    const handleFontWeightChange = (value: string) => {
        setTextStyle(prev => ({
            ...prev,
            fontWeight: parseInt(value),
        }));
    }

    const handleFontFamilyChange = (value: string) => {
        setTextStyle(prev => ({
            ...prev,
            fontFamily: value,
        }));
    }

    const handleStrokeColorChange = (color: string) => {
        setTextStyle(prev => ({
            ...prev,
            strokeColor: color,
        }));
    }

    const handleShadowColorChange = (color: string) => {
        setTextStyle(prev => ({
            ...prev,
            shadowColor: color,
        }));
    }

    const handleUppercaseChange = (checked: boolean) => {
        setTextStyle(prev => ({
            ...prev,
            uppercase: checked,
        }));
    }

    const generateHooks = async () => {
        setIsGenerating(true)

        if (!prompt) {
            toast.error('Please enter a prompt')
            setIsGenerating(false)
            return
        }

        try {
            const response = await fetch('/api/generate-hooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt,
                    platform: 'tiktok',
                    intent: 'engagement'
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate hooks')
            }

            const data = await response.json()

            // Update the sentences state with the new hooks
            setSentences(data.hooks)
            setIndex(0) // Reset to first hook
            toast.success('Successfully generated new hooks!')
        } catch (error) {
            toast.error('Failed to generate hooks')
            console.error('Error generating hooks:', error)
        } finally {
            setOpen(false)
            setIsGenerating(false)
            setPrompt("")
        }
    }

    if (!user || !profile) {
        return <div>Loading...</div>
    }

    return (
        <SidebarProvider>
            <AppSidebar user={
                {
                    name: profile.name,
                    email: profile.email,
                    avatar: profile.avatar,
                    credits: profile.credits,
                }
            } />
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
                            <div className="h-auto aspect-square rounded-xl bg-[#A4A4A4]/10 overflow-hidden">
                                <div className="relative w-full h-full aspect-[9/16]">
                                    <Player
                                        component={Main}
                                        inputProps={inputProps}
                                        durationInFrames={150}
                                        fps={30}
                                        compositionWidth={1080}
                                        compositionHeight={1920}
                                        style={{
                                            height: '100%',
                                        }}
                                        controls
                                        className="mx-auto h-full"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row gap-6 items-center justify-end w-full">
                                {video && state.status !== "invoking" && state.status !== "rendering" && state.status !== "done" && (
                                    <Link href={video}>
                                        <Button variant="outline" onClick={() => toast.success("Video downloaded")} className="w-fit">
                                            Download video
                                            <DownloadIcon className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                )}
                                {state.status === "done" ? (
                                    <Button variant="outline" className="w-fit" onClick={() => toast.success("Video downloaded")} asChild>
                                        <a href={video} download>
                                            Download video
                                            <DownloadIcon className="w-5 h-5 ml-2" />
                                        </a>
                                    </Button>
                                ) : loading ? (
                                    <Button variant="outline" className="w-fit">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <TextShimmer className='font-mono text-sm' duration={2}>
                                            Generating video...
                                        </TextShimmer>
                                        {state.status === "rendering" && state.progress && (
                                            <div className="text-sm font-[500] text-[#1a1a1a]/60">
                                                {Math.round(state.progress * 100)}%
                                            </div>
                                        )}
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
                                        <div className="flex flex-row items-center gap-4">
                                            <p className="text-base font-[500] text-[#1a1a1a]/60">
                                                1. Choose a hook
                                            </p>
                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogTrigger asChild>
                                                    <button className="flex flex-row items-center gap-2 text-[12px] font-[500] bg-primary text-white px-2 py-1 rounded-md">
                                                        <WandSparkles className="w-3 h-3" />
                                                        Generate with AI
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Generate TikTok Hooks</DialogTitle>
                                                        <DialogDescription>
                                                            Provide information about your product or service to generate engaging TikTok hooks.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="prompt" className="flex flex-row items-center gap-2">
                                                                Tell us about your product/service
                                                                <span className="text-xs text-red-500">
                                                                    (Required)
                                                                </span>
                                                            </Label>
                                                            <Textarea
                                                                id="prompt"
                                                                placeholder="Example: My product is a course that teaches people how to start dropshipping. The target audience is 18-25 year olds who want to start an online business."
                                                                value={prompt}
                                                                onChange={(e) => setPrompt(e.target.value)}
                                                                className="h-32"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            onClick={generateHooks}
                                                            disabled={!prompt || isGenerating}
                                                        >
                                                            {isGenerating ? (
                                                                <>
                                                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                                    Generating...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <WandSparkles className="w-4 h-4 mr-2" />
                                                                    Generate Hooks
                                                                </>
                                                            )}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
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
                                        token={token}
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
                                                    value={textStyle.fontSize}
                                                    min={1}
                                                    max={100}
                                                    step={1}
                                                    className="w-full bg-background pl-3 pr-8 font-[500]"
                                                    onChange={handleFontSizeChange}
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
                                            <Select
                                                value={textStyle.fontWeight.toString()}
                                                onValueChange={handleFontWeightChange}
                                                disabled={textStyle.fontFamily === "TheBoldFont" || textStyle.fontFamily === "Komika" || textStyle.fontFamily === "TikTok"}
                                            >
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
                                            <Select
                                                value={textStyle.fontFamily}
                                                onValueChange={handleFontFamilyChange}
                                            >
                                                <SelectTrigger className="w-full bg-background font-[500] truncate">
                                                    <SelectValue placeholder="Select font" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-background font-[500]">
                                                    <SelectItem value="TikTok" className="truncate">TikTok Font</SelectItem>
                                                    <SelectItem value="Montserrat" className="truncate">Montserrat</SelectItem>
                                                    <SelectItem value="Inter" className="truncate">Inter</SelectItem>
                                                    <SelectItem value="Komika" className="truncate">MrBeast Font</SelectItem>
                                                    <SelectItem value="TheBoldFont" className="truncate">Alex Hormozi Font</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* TEXT COLOR */}
                                        <div className="flex flex-col items-start">
                                            <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                Text Color
                                            </label>
                                            <div className="w-full">
                                                <ColorPicker
                                                    value={textStyle.textColor}
                                                    onChange={(c) => {
                                                        setTextStyle(prev => ({
                                                            ...prev,
                                                            textColor: c.toHexString(),
                                                        }))
                                                    }}
                                                    showText
                                                    allowClear
                                                    className="p-[0.325rem] hover:border-primary/80" />
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
                                            <Switch
                                                checked={textStyle.uppercase || textStyle.fontFamily === "TheBoldFont" || textStyle.fontFamily === "Komika"}
                                                disabled={textStyle.fontFamily === "TheBoldFont" || textStyle.fontFamily === "Komika"}
                                                onCheckedChange={handleUppercaseChange}
                                            />
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
