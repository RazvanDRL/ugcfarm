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
import { AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalJustifyStart, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, Loader, PlayIcon, WandSparkles } from "lucide-react"
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
import { Profile, supabase, type User } from "@/lib/supabase/client/supabase"
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
import { getSignedUrl } from "@/hooks/use-signed-url"
import { parseMedia } from '@remotion/media-parser';
import { Slider } from "@/components/ui/slider"
import Loading from "@/components/loading"
import { useDemoVideo } from "@/hooks/use-demo-video"
import { vids } from "@/constants"
import transformed_creators from "@/transformed_creators.json"
import transformed_vids from "@/transformed_vids.json"
const voices = {
    alice: "alice",
    aria: "aria",
    bill: "bill",
    brian: "brian",
    callum: "callum",
    charlie: "charlie",
    charlotte: "charlotte",
    chris: "chris",
    daniel: "daniel",
    eric: "eric",
    george: "george",
    jessica: "jessica",
    laura: "laura",
    liam: "liam",
    lily: "lily",
    matilda: "matilda",
    river: "river",
    roger: "roger",
    sarah: "sarah",
    will: "will"
} as const;

const voice_demos = {
    alice: "https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3",
    aria: "https://storage.googleapis.com/eleven-public-prod/premade/voices/9BWtsMINqrJLrRacOk9x/405766b8-1f4e-4d3c-aba1-6f25333823ec.mp3",
    bill: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3",
    brian: "https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd3e72c-4fd3-42f1-93ea-abc5d4e5aa1d.mp3",
    callum: "https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3",
    charlie: "https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3",
    charlotte: "https://storage.googleapis.com/eleven-public-prod/premade/voices/XB0fDUnXU5powFXDhCwa/942356dc-f10d-4d89-bda5-4f8505ee038b.mp3",
    chris: "https://storage.googleapis.com/eleven-public-prod/premade/voices/iP95p4xoKVk53GoZ742B/3f4bde72-cc48-40dd-829f-57fbf906f4d7.mp3",
    daniel: "https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3",
    eric: "https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/d098fda0-6456-4030-b3d8-63aa048c9070.mp3",
    george: "https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3",
    jessica: "https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3",
    laura: "https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3",
    liam: "https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3",
    lily: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3",
    matilda: "https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3",
    river: "https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3",
    roger: "https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3",
    sarah: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3",
    will: "https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3"
}

interface InputProps {
    text: string;
    videoUrl: string;
    video_duration: number;
    textStyle: {
        fontSize: number;
        fontWeight: number;
        fontFamily: string;
        textColor: string;
        strokeColor: string;
        shadowColor: string;
        uppercase: boolean;
        verticalAlignment: number;
    };
    videoProps: {
        uuid: string;
    };
    demos: {
        url: string;
        duration: number;
    } | null;
    hook_duration: number;
    lip_sync: boolean;
    voice: string;
}

export default function Page() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [index, setIndex] = useState(0)
    const [demoPage, setDemoPage] = useState(1)
    const [videoPage, setVideoPage] = useState(1)
    const [avatarPage, setAvatarPage] = useState(1)
    const [sentences, setSentences] = useState([
        "Edit this hook 1",
        "Edit this hook 2",
        "Edit this hook 3",
        "Edit this hook 4",
        "Edit this hook 5",
    ])
    const [selectedPhotoId, setSelectedPhotoId] = useState<number>(3)
    const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1)
    const [selectedDemoId, setSelectedDemoId] = useState<number>(1)
    const [loading, setLoading] = useState(false)
    const [textStyle, setTextStyle] = useState({
        fontSize: 36,
        fontWeight: 700,
        fontFamily: "TikTok",
        textColor: "#ffffff",
        strokeColor: "#000000",
        shadowColor: "#000000",
        uppercase: false,
        verticalAlignment: 50
    })
    const [video, setVideo] = useState<string>("")
    const [demos, setDemos] = useState<any[]>([])
    const [demoVideos, setDemoVideos] = useState<any[]>([])
    const [avatarVideos, setAvatarVideos] = useState<any[]>([])
    const [isGenerating, setIsGenerating] = useState({
        audio: false,
        hook: false
    })
    const [library, setLibrary] = useState<"library" | "my_avatars">("library")
    const [prompt, setPrompt] = useState("")
    const [open, setOpen] = useState(false)
    const [inputProps, setInputProps] = useState<InputProps>(() => {
        const hookDuration = Math.round((library === "library" ? vids.find(v => v.id === selectedPhotoId)?.duration : avatarVideos.find(v => v.id === selectedAvatarId)?.duration) || 5) * 30
        return {
            text: sentences[index],
            videoUrl: library === "library" ? vids.find(v => v.id === selectedPhotoId)?.url || "" : avatarVideos.find(v => v.id === selectedAvatarId)?.url || "",
            video_duration: hookDuration,
            textStyle,
            videoProps: {
                uuid: uuidv4()
            },
            demos: null,
            hook_duration: hookDuration,
            lip_sync: false,
            voice: "alice"
        }
    });
    const { renderMedia, state, setToken, token } = useRendering(COMP_NAME, inputProps);
    const {
        demoUrl,
        demoDuration,
        setDemo,
        resetDemo
    } = useDemoVideo();
    const [isDemoInitialized, setIsDemoInitialized] = useState(false);
    const [isLocal, setIsLocal] = useState(false);
    const [operationId, setOperationId] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [completed_video, setCompletedVideo] = useState<string | null>(null);

    async function fetchDemos(user: User, access_token: string) {
        if (!user) {
            toast.error("No user found");
            return;
        }

        if (demoVideos.length > 0) {
            console.log('demoVideos is already populated')
            return;
        }

        let tempDemos: any[] = [];

        const { data: demos, error: demosError } = await supabase
            .from('user_demos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (demosError) {
            throw new Error('Failed to fetch demos');
        }

        for (const [index, demo] of demos.entries()) {
            setDemoVideos(prev => [...prev, demo.key.split('/')[1]])

            const url = await getSignedUrl(demo.key.split('/')[1].replace('.mp4', '') + '-thumb.webp', 'upload-bucket', access_token)

            tempDemos.push({
                id: index + 1,
                url: url,
                alt: `Demo ${index + 1}`
            });
        }
        setDemos(tempDemos);
    }

    const preloadVideo = (url: string) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.src = url;
            video.muted = true;
            video.onloadeddata = () => resolve(url);
            video.onerror = (err) => reject(err);
            // Start loading the video
            video.load();
        });
    };

    async function fetchAvatars(user: User, access_token: string) {
        if (!user) {
            toast.error("No user found");
            return;
        }

        if (avatarVideos.length > 0) {
            console.log('avatarVideos is already populated')
            return;
        }

        let temp: any[] = [];
        const preloadPromises: Promise<any>[] = [];

        const { data: avatar_videos, error: avatar_videos_error } = await supabase
            .from('user_avatar_videos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (avatar_videos_error) {
            throw new Error('Failed to fetch avatar videos');
        }

        for (const [index, avatar_video] of avatar_videos.entries()) {
            if (avatar_video.thumbnail) {
                // get signed url from supabase storage
                const { data: thumbnail, error: thumbnailError } = await supabase
                    .from("user_avatars")
                    .select("*")
                    .eq("id", avatar_video.thumbnail)
                    .single()

                if (thumbnailError) {
                    throw new Error('Failed to fetch avatar video');
                }

                const ext = thumbnail.data.seed === undefined ? '.png' : '.jpg'

                const signed_url = await getSignedUrl(avatar_video.thumbnail + ext, 'user-avatars', access_token)
                console.log(signed_url)

                const videoUrl = await getSignedUrl(avatar_video.id + '.mp4', 'output-bucket', access_token)
                console.log(videoUrl)

                // Preload the video
                if (videoUrl) {
                    preloadPromises.push(preloadVideo(videoUrl));
                }

                // get metadata from video
                const metadata = await parseMedia({
                    src: videoUrl!,
                    fields: {
                        slowDurationInSeconds: true,
                    },
                });

                temp.push({
                    id: index + 1,
                    url: signed_url,
                    videoUrl: videoUrl,
                    duration: metadata.slowDurationInSeconds,
                    alt: `Avatar Video ${index + 1}`
                });
            }
        }

        // Set the avatar videos first, then handle preloading in the background
        setAvatarVideos(temp);

        // You can optionally await all preloads or let them continue in background
        try {
            await Promise.allSettled(preloadPromises);
            console.log('All avatar videos preloaded successfully');
        } catch (error) {
            console.error('Some videos failed to preload:', error);
        }
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

                if (profile.plan === null) {
                    router.replace('/#pricing')
                }

                setProfile(profile)

                const session = await supabase.auth.getSession()
                if (session.data.session?.access_token) {
                    fetchDemos(user, session.data.session?.access_token)
                    fetchAvatars(user, session.data.session?.access_token)
                    setToken(session.data.session?.access_token)

                    // Fetch the first demo video on load
                    const { data: demos, error: demosError } = await supabase
                        .from('user_demos')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (!demosError && demos) {
                        const videoKey = demos.key.split('/')[1].replace('.mp4', '')
                        const url = await getSignedUrl(videoKey + '.mp4', 'upload-bucket', session.data.session?.access_token)

                        if (url) {
                            const metadata = await parseMedia({
                                src: url,
                                fields: {
                                    slowDurationInSeconds: true,
                                },
                            });

                            const hookDuration = Math.round((vids.find(v => v.id === selectedPhotoId)?.duration || 5) * 30);
                            const demoDuration = Math.round(metadata.slowDurationInSeconds * 30);

                            setInputProps(prev => ({
                                ...prev,
                                video_duration: hookDuration + demoDuration,
                                demos: {
                                    url,
                                    duration: demoDuration
                                },
                                hook_duration: hookDuration
                            }));
                        }
                    }

                    console.log("session data token found")
                } else {
                    toast.error("No access token found")
                }

                // get the hook params
                const urlParams = new URLSearchParams(window.location.search);
                const hookId = urlParams.get('hook');

                if (hookId) {
                    const { data: hook, error: hookError } = await supabase
                        .from('hook_library')
                        .select('data')
                        .eq('id', hookId)
                        .single()

                    if (hookError) {
                        throw new Error('Failed to fetch hook');
                    }

                    setSentences(hook.data)
                    setInputProps(prev => ({
                        ...prev,
                        text: hook.data[0]
                    }))
                }
            } else {
                router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
            }
        }

        getUser()
    }, [])

    // if operationId is set, fetch the video from the creator
    useEffect(() => {
        if (operationId) {
            const fetchStatus = async () => {
                const data = await fetch(`/api/creator/poll?operationId=${operationId}`)
                const json = await data.json()
                console.log(json)
                setProgress(json.progress)
                if (json.state === "COMPLETE") {
                    clearInterval(intervalId)
                    setCompletedVideo(json.url)
                    setOperationId(null)
                }
            }

            // Call it once immediately
            fetchStatus()

            // Set up interval to call it every second
            const intervalId = setInterval(fetchStatus, 3000)

            // Clean up the interval when component unmounts
            return () => clearInterval(intervalId)
        }
    }, [operationId])

    useEffect(() => {
        if (state.status === "done") {
            getSignedUrl(inputProps.videoProps.uuid + '.mp4', 'output-bucket', token).then((url) => {
                setVideo(url || "")

                // Generate a new UUID for the next rendering to prevent conflicts
                setInputProps(prev => ({
                    ...prev,
                    videoProps: {
                        uuid: uuidv4()
                    }
                }))
            })
        }
    }, [state])

    useEffect(() => {
        if (selectedPhotoId >= 129) {
            setInputProps(prev => ({
                ...prev,
                text: sentences[index],
                videoUrl: transformed_vids.find(v => v.id === selectedPhotoId)?.url || "",
                video_duration: 125,
                hook_duration: 125,
                demos: null,
                textStyle,
            }));
            return;
        }

        const hookDuration = Math.round((vids.find(v => v.id === selectedPhotoId)?.duration || 5) * 30);
        const totalDuration = hookDuration + (demoDuration || 0);

        setInputProps(prev => ({
            ...prev,
            text: sentences[index],
            videoUrl: vids.find(v => v.id === selectedPhotoId)?.url || "",
            video_duration: totalDuration,
            textStyle,
            videoProps: {
                uuid: uuidv4()
            },
            demos: demoUrl ? {
                url: demoUrl,
                duration: demoDuration
            } : null,
            hook_duration: hookDuration,
        }));
    }, [index, selectedPhotoId, textStyle, demoUrl, demoDuration, selectedAvatarId, library]);

    // Modify the effect that handles demo initialization
    useEffect(() => {
        if (selectedDemoId > 0 && !isDemoInitialized && token && demoVideos.length > 0) {
            setDemo(selectedDemoId, demoVideos, token)
                .then(() => {
                    setIsDemoInitialized(true);
                })
                .catch(error => {
                    console.error('Error initializing demo:', error);
                });
        }
    }, [selectedDemoId, isDemoInitialized, token, demoVideos, setDemo]);

    // Add this useEffect to prevent updating videoUrl when there are no avatar videos
    useEffect(() => {
        if (library === "my_avatars" && avatarVideos.length > 0) {
            setInputProps(prev => ({
                ...prev,
                videoUrl: avatarVideos.find(v => v.id === selectedAvatarId)?.videoUrl || "",
                hook_duration: Math.round(avatarVideos.find(v => v.id === selectedAvatarId)?.duration ?? 5) * 30,
                total_duration: Math.round(avatarVideos.find(v => v.id === selectedAvatarId)?.duration ?? 5) * 30 + demoDuration,
            }));
        }
    }, [selectedAvatarId, library, avatarVideos, demoDuration]);

    const photos = [
        ...transformed_creators,
        {
            "id": 1,
            "url": "https://ugcfarm.b-cdn.net/photos/001.webp",
            "alt": "UGC Avatar 1",
            "name": "UGC Avatar 1"
        },
        {
            "id": 2,
            "url": "https://ugcfarm.b-cdn.net/photos/002.webp",
            "alt": "UGC Avatar 2",
            "name": "UGC Avatar 2"
        },
        {
            "id": 3,
            "url": "https://ugcfarm.b-cdn.net/photos/003.webp",
            "alt": "UGC Avatar 3",
            "name": "UGC Avatar 3"
        },
        {
            "id": 4,
            "url": "https://ugcfarm.b-cdn.net/photos/004.webp",
            "alt": "UGC Avatar 4",
            "name": "UGC Avatar 4"
        },
        {
            "id": 5,
            "url": "https://ugcfarm.b-cdn.net/photos/005.webp",
            "alt": "UGC Avatar 5",
            "name": "UGC Avatar 5"
        },
        {
            "id": 6,
            "url": "https://ugcfarm.b-cdn.net/photos/006.webp",
            "alt": "UGC Avatar 6",
            "name": "UGC Avatar 6"
        },
        {
            "id": 7,
            "url": "https://ugcfarm.b-cdn.net/photos/007.webp",
            "alt": "UGC Avatar 7",
            "name": "UGC Avatar 7"
        },
        {
            "id": 8,
            "url": "https://ugcfarm.b-cdn.net/photos/008.webp",
            "alt": "UGC Avatar 8",
            "name": "UGC Avatar 8"
        },
        {
            "id": 9,
            "url": "https://ugcfarm.b-cdn.net/photos/009.webp",
            "alt": "UGC Avatar 9",
            "name": "UGC Avatar 9"
        },
        {
            "id": 10,
            "url": "https://ugcfarm.b-cdn.net/photos/010.webp",
            "alt": "UGC Avatar 10",
            "name": "UGC Avatar 10"
        },
        {
            "id": 11,
            "url": "https://ugcfarm.b-cdn.net/photos/011.webp",
            "alt": "UGC Avatar 11",
            "name": "UGC Avatar 11"
        },
        {
            "id": 12,
            "url": "https://ugcfarm.b-cdn.net/photos/012.webp",
            "alt": "UGC Avatar 12",
            "name": "UGC Avatar 12"
        },
        {
            "id": 13,
            "url": "https://ugcfarm.b-cdn.net/photos/013.webp",
            "alt": "UGC Avatar 13",
            "name": "UGC Avatar 13"
        },
        {
            "id": 14,
            "url": "https://ugcfarm.b-cdn.net/photos/014.webp",
            "alt": "UGC Avatar 14",
            "name": "UGC Avatar 14"
        },
        {
            "id": 15,
            "url": "https://ugcfarm.b-cdn.net/photos/015.webp",
            "alt": "UGC Avatar 15",
            "name": "UGC Avatar 15"
        },
        {
            "id": 16,
            "url": "https://ugcfarm.b-cdn.net/photos/016.webp",
            "alt": "UGC Avatar 16",
            "name": "UGC Avatar 16"
        },
        {
            "id": 17,
            "url": "https://ugcfarm.b-cdn.net/photos/017.webp",
            "alt": "UGC Avatar 17",
            "name": "UGC Avatar 17"
        },
        {
            "id": 18,
            "url": "https://ugcfarm.b-cdn.net/photos/018.webp",
            "alt": "UGC Avatar 18",
            "name": "UGC Avatar 18"
        },
        {
            "id": 19,
            "url": "https://ugcfarm.b-cdn.net/photos/019.webp",
            "alt": "UGC Avatar 19",
            "name": "UGC Avatar 19"
        },
        {
            "id": 20,
            "url": "https://ugcfarm.b-cdn.net/photos/020.webp",
            "alt": "UGC Avatar 20",
            "name": "UGC Avatar 20"
        },
        {
            "id": 21,
            "url": "https://ugcfarm.b-cdn.net/photos/021.webp",
            "alt": "UGC Avatar 21",
            "name": "UGC Avatar 21"
        },
        {
            "id": 22,
            "url": "https://ugcfarm.b-cdn.net/photos/022.webp",
            "alt": "UGC Avatar 22",
            "name": "UGC Avatar 22"
        },
        {
            "id": 23,
            "url": "https://ugcfarm.b-cdn.net/photos/023.webp",
            "alt": "UGC Avatar 23",
            "name": "UGC Avatar 23"
        },
        {
            "id": 24,
            "url": "https://ugcfarm.b-cdn.net/photos/024.webp",
            "alt": "UGC Avatar 24",
            "name": "UGC Avatar 24"
        },
        {
            "id": 25,
            "url": "https://ugcfarm.b-cdn.net/photos/025.webp",
            "alt": "UGC Avatar 25",
            "name": "UGC Avatar 25"
        },
        {
            "id": 26,
            "url": "https://ugcfarm.b-cdn.net/photos/026.webp",
            "alt": "UGC Avatar 26",
            "name": "UGC Avatar 26"
        },
        {
            "id": 27,
            "url": "https://ugcfarm.b-cdn.net/photos/027.webp",
            "alt": "UGC Avatar 27",
            "name": "UGC Avatar 27"
        },
        {
            "id": 28,
            "url": "https://ugcfarm.b-cdn.net/photos/028.webp",
            "alt": "UGC Avatar 28",
            "name": "UGC Avatar 28"
        },
        {
            "id": 29,
            "url": "https://ugcfarm.b-cdn.net/photos/029.webp",
            "alt": "UGC Avatar 29",
            "name": "UGC Avatar 29"
        },
        {
            "id": 30,
            "url": "https://ugcfarm.b-cdn.net/photos/030.webp",
            "alt": "UGC Avatar 30",
            "name": "UGC Avatar 30"
        },
        {
            "id": 32,
            "url": "https://ugcfarm.b-cdn.net/photos/032.webp",
            "alt": "UGC Avatar 32",
            "name": "UGC Avatar 32"
        },
        {
            "id": 33,
            "url": "https://ugcfarm.b-cdn.net/photos/033.webp",
            "alt": "UGC Avatar 33",
            "name": "UGC Avatar 33"
        },
        {
            "id": 34,
            "url": "https://ugcfarm.b-cdn.net/photos/034.webp",
            "alt": "UGC Avatar 34",
            "name": "UGC Avatar 34"
        },
        {
            "id": 35,
            "url": "https://ugcfarm.b-cdn.net/photos/035.webp",
            "alt": "UGC Avatar 35",
            "name": "UGC Avatar 35"
        },
        {
            "id": 36,
            "url": "https://ugcfarm.b-cdn.net/photos/036.webp",
            "alt": "UGC Avatar 36",
            "name": "UGC Avatar 36"
        },
        {
            "id": 37,
            "url": "https://ugcfarm.b-cdn.net/photos/037.webp",
            "alt": "UGC Avatar 37",
            "name": "UGC Avatar 37"
        },
        {
            "id": 38,
            "url": "https://ugcfarm.b-cdn.net/photos/038.webp",
            "alt": "UGC Avatar 38",
            "name": "UGC Avatar 38"
        },
        {
            "id": 39,
            "url": "https://ugcfarm.b-cdn.net/photos/039.webp",
            "alt": "UGC Avatar 39",
            "name": "UGC Avatar 39"
        },
        {
            "id": 40,
            "url": "https://ugcfarm.b-cdn.net/photos/040.webp",
            "alt": "UGC Avatar 40",
            "name": "UGC Avatar 40"
        },
        {
            "id": 41,
            "url": "https://ugcfarm.b-cdn.net/photos/041.webp",
            "alt": "UGC Avatar 41",
            "name": "UGC Avatar 41"
        },
        {
            "id": 42,
            "url": "https://ugcfarm.b-cdn.net/photos/042.webp",
            "alt": "UGC Avatar 42",
            "name": "UGC Avatar 42"
        },
        {
            "id": 43,
            "url": "https://ugcfarm.b-cdn.net/photos/043.webp",
            "alt": "UGC Avatar 43",
            "name": "UGC Avatar 43"
        },
        {
            "id": 64,
            "url": "https://ugcfarm.b-cdn.net/photos/064.webp",
            "alt": "UGC Avatar 64",
            "name": "UGC Avatar 64"
        },
        {
            "id": 65,
            "url": "https://ugcfarm.b-cdn.net/photos/065.webp",
            "alt": "UGC Avatar 65",
            "name": "UGC Avatar 65"
        },
        {
            "id": 66,
            "url": "https://ugcfarm.b-cdn.net/photos/066.webp",
            "alt": "UGC Avatar 66",
            "name": "UGC Avatar 66"
        },
        {
            "id": 67,
            "url": "https://ugcfarm.b-cdn.net/photos/067.webp",
            "alt": "UGC Avatar 67",
            "name": "UGC Avatar 67"
        },
        {
            "id": 68,
            "url": "https://ugcfarm.b-cdn.net/photos/068.webp",
            "alt": "UGC Avatar 68",
            "name": "UGC Avatar 68"
        },
        {
            "id": 69,
            "url": "https://ugcfarm.b-cdn.net/photos/069.webp",
            "alt": "UGC Avatar 69",
            "name": "UGC Avatar 69"
        },
        {
            "id": 70,
            "url": "https://ugcfarm.b-cdn.net/photos/070.webp",
            "alt": "UGC Avatar 70",
            "name": "UGC Avatar 70"
        },
        {
            "id": 71,
            "url": "https://ugcfarm.b-cdn.net/photos/071.webp",
            "alt": "UGC Avatar 71",
            "name": "UGC Avatar 71"
        },
        {
            "id": 72,
            "url": "https://ugcfarm.b-cdn.net/photos/072.webp",
            "alt": "UGC Avatar 72",
            "name": "UGC Avatar 72"
        },
        {
            "id": 73,
            "url": "https://ugcfarm.b-cdn.net/photos/073.webp",
            "alt": "UGC Avatar 73",
            "name": "UGC Avatar 73"
        },
        {
            "id": 74,
            "url": "https://ugcfarm.b-cdn.net/photos/074.webp",
            "alt": "UGC Avatar 74",
            "name": "UGC Avatar 74"
        },
        {
            "id": 75,
            "url": "https://ugcfarm.b-cdn.net/photos/075.webp",
            "alt": "UGC Avatar 75",
            "name": "UGC Avatar 75"
        },
        {
            "id": 76,
            "url": "https://ugcfarm.b-cdn.net/photos/076.webp",
            "alt": "UGC Avatar 76",
            "name": "UGC Avatar 76"
        },
        {
            "id": 77,
            "url": "https://ugcfarm.b-cdn.net/photos/077.webp",
            "alt": "UGC Avatar 77",
            "name": "UGC Avatar 77"
        },
        {
            "id": 78,
            "url": "https://ugcfarm.b-cdn.net/photos/078.webp",
            "alt": "UGC Avatar 78",
            "name": "UGC Avatar 78"
        },
        {
            "id": 79,
            "url": "https://ugcfarm.b-cdn.net/photos/079.webp",
            "alt": "UGC Avatar 79",
            "name": "UGC Avatar 79"
        },
        {
            "id": 80,
            "url": "https://ugcfarm.b-cdn.net/photos/080.webp",
            "alt": "UGC Avatar 80",
            "name": "UGC Avatar 80"
        },
        {
            "id": 81,
            "url": "https://ugcfarm.b-cdn.net/photos/081.webp",
            "alt": "UGC Avatar 81",
            "name": "UGC Avatar 81"
        },
        {
            "id": 82,
            "url": "https://ugcfarm.b-cdn.net/photos/082.webp",
            "alt": "UGC Avatar 82",
            "name": "UGC Avatar 82"
        },
        {
            "id": 83,
            "url": "https://ugcfarm.b-cdn.net/photos/083.webp",
            "alt": "UGC Avatar 83",
            "name": "UGC Avatar 83"
        },
        {
            "id": 86,
            "url": "https://ugcfarm.b-cdn.net/photos/086.webp",
            "alt": "UGC Avatar 86",
            "name": "UGC Avatar 86"
        },
        {
            "id": 87,
            "url": "https://ugcfarm.b-cdn.net/photos/087.webp",
            "alt": "UGC Avatar 87",
            "name": "UGC Avatar 87"
        },
        {
            "id": 88,
            "url": "https://ugcfarm.b-cdn.net/photos/088.webp",
            "alt": "UGC Avatar 88",
            "name": "UGC Avatar 88"
        },
        {
            "id": 89,
            "url": "https://ugcfarm.b-cdn.net/photos/089.webp",
            "alt": "UGC Avatar 89",
            "name": "UGC Avatar 89"
        },
        {
            "id": 90,
            "url": "https://ugcfarm.b-cdn.net/photos/090.webp",
            "alt": "UGC Avatar 90",
            "name": "UGC Avatar 90"
        },
        {
            "id": 91,
            "url": "https://ugcfarm.b-cdn.net/photos/091.webp",
            "alt": "UGC Avatar 91",
            "name": "UGC Avatar 91"
        },
        {
            "id": 92,
            "url": "https://ugcfarm.b-cdn.net/photos/092.webp",
            "alt": "UGC Avatar 92",
            "name": "UGC Avatar 92"
        },
        {
            "id": 93,
            "url": "https://ugcfarm.b-cdn.net/photos/093.webp",
            "alt": "UGC Avatar 93",
            "name": "UGC Avatar 93"
        },
        {
            "id": 94,
            "url": "https://ugcfarm.b-cdn.net/photos/094.webp",
            "alt": "UGC Avatar 94",
            "name": "UGC Avatar 94"
        },
        {
            "id": 95,
            "url": "https://ugcfarm.b-cdn.net/photos/095.webp",
            "alt": "UGC Avatar 95",
            "name": "UGC Avatar 95"
        },
        {
            "id": 96,
            "url": "https://ugcfarm.b-cdn.net/photos/096.webp",
            "alt": "UGC Avatar 96",
            "name": "UGC Avatar 96"
        },
        {
            "id": 97,
            "url": "https://ugcfarm.b-cdn.net/photos/097.webp",
            "alt": "UGC Avatar 97",
            "name": "UGC Avatar 97"
        },
        {
            "id": 98,
            "url": "https://ugcfarm.b-cdn.net/photos/098.webp",
            "alt": "UGC Avatar 98",
            "name": "UGC Avatar 98"
        },
        {
            "id": 99,
            "url": "https://ugcfarm.b-cdn.net/photos/099.webp",
            "alt": "UGC Avatar 99",
            "name": "UGC Avatar 99"
        },
        {
            "id": 100,
            "url": "https://ugcfarm.b-cdn.net/photos/100.webp",
            "alt": "UGC Avatar 100",
            "name": "UGC Avatar 100"
        },
        {
            "id": 101,
            "url": "https://ugcfarm.b-cdn.net/photos/101.webp",
            "alt": "UGC Avatar 101",
            "name": "UGC Avatar 101"
        },
        {
            "id": 102,
            "url": "https://ugcfarm.b-cdn.net/photos/102.webp",
            "alt": "UGC Avatar 102",
            "name": "UGC Avatar 102"
        },
        {
            "id": 103,
            "url": "https://ugcfarm.b-cdn.net/photos/103.webp",
            "alt": "UGC Avatar 103",
            "name": "UGC Avatar 103"
        },
        {
            "id": 104,
            "url": "https://ugcfarm.b-cdn.net/photos/104.webp",
            "alt": "UGC Avatar 104",
            "name": "UGC Avatar 104"
        },
        {
            "id": 109,
            "url": "https://ugcfarm.b-cdn.net/photos/109.webp",
            "alt": "UGC Avatar 109",
            "name": "UGC Avatar 109"
        },
        {
            "id": 110,
            "url": "https://ugcfarm.b-cdn.net/photos/110.webp",
            "alt": "UGC Avatar 110",
            "name": "UGC Avatar 110"
        },
        {
            "id": 111,
            "url": "https://ugcfarm.b-cdn.net/photos/111.webp",
            "alt": "UGC Avatar 111",
            "name": "UGC Avatar 111"
        },
        {
            "id": 112,
            "url": "https://ugcfarm.b-cdn.net/photos/112.webp",
            "alt": "UGC Avatar 112",
            "name": "UGC Avatar 112"
        },
        {
            "id": 113,
            "url": "https://ugcfarm.b-cdn.net/photos/113.webp",
            "alt": "UGC Avatar 113",
            "name": "UGC Avatar 113"
        },
        {
            "id": 114,
            "url": "https://ugcfarm.b-cdn.net/photos/114.webp",
            "alt": "UGC Avatar 114",
            "name": "UGC Avatar 114"
        },
        {
            "id": 115,
            "url": "https://ugcfarm.b-cdn.net/photos/115.webp",
            "alt": "UGC Avatar 115",
            "name": "UGC Avatar 115"
        },
        {
            "id": 116,
            "url": "https://ugcfarm.b-cdn.net/photos/116.webp",
            "alt": "UGC Avatar 116",
            "name": "UGC Avatar 116"
        },
        {
            "id": 117,
            "url": "https://ugcfarm.b-cdn.net/photos/117.webp",
            "alt": "UGC Avatar 117",
            "name": "UGC Avatar 117"
        },
        {
            "id": 118,
            "url": "https://ugcfarm.b-cdn.net/photos/grasu_1.webp",
            "alt": "UGC Avatar 118",
            "name": "UGC Avatar 118"
        },
        {
            "id": 119,
            "url": "https://ugcfarm.b-cdn.net/photos/grasu_2.webp",
            "alt": "UGC Avatar 119",
            "name": "UGC Avatar 119"
        },
        {
            "id": 120,
            "url": "https://ugcfarm.b-cdn.net/photos/grasu_3.webp",
            "alt": "UGC Avatar 120",
            "name": "UGC Avatar 120"
        },
        {
            "id": 121,
            "url": "https://ugcfarm.b-cdn.net/photos/grasu_4.webp",
            "alt": "UGC Avatar 121",
            "name": "UGC Avatar 121"
        },
        {
            "id": 122,
            "url": "https://ugcfarm.b-cdn.net/photos/122.webp",
            "alt": "UGC Avatar 122",
            "name": "UGC Avatar 122"
        },
        {
            "id": 123,
            "url": "https://ugcfarm.b-cdn.net/photos/123.webp",
            "alt": "UGC Avatar 123",
            "name": "UGC Avatar 123"
        },
        {
            "id": 124,
            "url": "https://ugcfarm.b-cdn.net/photos/124.webp",
            "alt": "UGC Avatar 124",
            "name": "UGC Avatar 124"
        },
        {
            "id": 125,
            "url": "https://ugcfarm.b-cdn.net/photos/125.webp",
            "alt": "UGC Avatar 125",
            "name": "UGC Avatar 125"
        },
        {
            "id": 126,
            "url": "https://ugcfarm.b-cdn.net/photos/126.webp",
            "alt": "UGC Avatar 126",
            "name": "UGC Avatar 126"
        },
        {
            "id": 127,
            "url": "https://ugcfarm.b-cdn.net/photos/127.webp",
            "alt": "UGC Avatar 127",
            "name": "UGC Avatar 127"
        },
        {
            "id": 128,
            "url": "https://ugcfarm.b-cdn.net/photos/128.webp",
            "alt": "UGC Avatar 128",
            "name": "UGC Avatar 128"
        },
    ]

    const onPhotoSelect = (id: number) => {
        if (id > 129) {
            setIsLocal(true)
        }
        setSelectedPhotoId(id)
    }

    const onAvatarSelect = (id: number) => {
        setSelectedAvatarId(id)
        setInputProps(prev => ({
            ...prev,
            videoUrl: avatarVideos.find(v => v.id === id)?.videoUrl || "",
            hook_duration: Math.round(avatarVideos.find(v => v.id === id)?.duration ?? 5) * 30,
            total_duration: Math.round(avatarVideos.find(v => v.id === id)?.duration ?? 5) * 30 + demoDuration,
        }))
        // resetDemo()
        // setSelectedDemoId(0)
    }

    const onDemoSelect = async (id: number) => {
        try {
            // If clicking the same demo, deselect it
            if (id === selectedDemoId) {
                setSelectedDemoId(0)
                resetDemo()
                return
            }

            setSelectedDemoId(id)
            await setDemo(id, demoVideos, token)
        } catch (error) {
            console.error('Error in onDemoSelect:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to load demo video')
        }
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

    const nextAvatarPage = () => {
        if (avatarPage < Math.ceil(avatarVideos.length / 21)) {
            setAvatarPage((prev) => prev + 1)
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

    const previousAvatarPage = () => {
        if (avatarPage > 1) {
            setAvatarPage((prev) => prev - 1)
        }
    }

    const nextButton = () => {
        setIndex((prev) => (prev + 1) % sentences.length);
    }

    const previousButton = () => {
        setIndex((prev) => (prev - 1 + sentences.length) % sentences.length);
    }

    const updateSentence = (newText: string) => {
        if (newText.length > 100) {
            toast.error('Hook must be less than 100 characters')
        }

        newText = newText.substring(0, 100);

        setSentences(prev => {
            const newSentences = [...prev];
            newSentences[index] = newText;
            return newSentences;
        });

        // Add this to update inputProps immediately when text changes
        setInputProps(prev => ({
            ...prev,
            text: newText
        }));
    };

    const createVideo = async () => {
        if (!user || !profile) {
            toast.error('Please login to create a video')
            return
        }

        // fetch user's credits
        const { data: credits, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)

        if (error) {
            toast.error('Failed to fetch user credits')
            return
        }

        if (credits[0].credits < 1) {
            toast.error('You do not have enough credits to create a video')
            return
        }

        if (inputProps.lip_sync) {
            if (credits[0].credits < 1.5) {
                toast.error('You do not have enough credits to create a video')
                return
            }
        }

        setProfile(prev => prev ? {
            ...prev,
            credits: prev.credits - (inputProps.lip_sync ? 1.5 : 1),
        } : null)

        setLoading(true);

        let id = uuidv4();

        try {
            // insert the video into the database
            const { data, error } = await supabase
                .from('video_history')
                .insert({
                    user_id: user.id,
                    video_id: !isLocal ? inputProps.videoProps.uuid : id,
                    prompt: sentences[index],
                    text_style: !isLocal ? textStyle : null,
                    inputs: !isLocal ? inputProps : null,
                })

            if (error) {
                if (error.code === 'P0001') {
                    toast.error('You do not have enough credits to create a video')
                } else {
                    toast.error('Failed to create video')
                }
                throw new Error('Failed to insert video into database');
            } else {
                if (!isLocal) {
                    await renderMedia();
                } else {
                    // make a fetch request to the local server
                    const photo = photos.find(p => p.id === selectedPhotoId)?.name;

                    const response = await fetch('/api/creator/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            videoId: id,
                            script: sentences[index],
                            creatorName: photo
                        })
                    })

                    if (!response.ok) {
                        toast.error('Failed to submit video to creator')
                    }

                    const data = await response.json()

                    setOperationId(data.operationId)
                }
            }
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

    const handleVerticalAlignmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value < 10) {
            setTextStyle(prev => ({
                ...prev,
                verticalAlignment: 10,
            }));
        } else if (value > 90) {
            setTextStyle(prev => ({
                ...prev,
                verticalAlignment: 90,
            }));
        } else {
            setTextStyle(prev => ({
                ...prev,
                verticalAlignment: value,
            }));
        }
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
        setIsGenerating(prev => ({
            ...prev,
            hook: true
        }))

        if (!prompt || prompt.length === 0) {
            toast.error('Please enter a prompt')
            setIsGenerating(prev => ({
                ...prev,
                hook: false
            }))
            return
        }

        if (prompt.length < 10) {
            toast.error('Prompt must be at least 10 characters')
            setIsGenerating(prev => ({
                ...prev,
                hook: false
            }))
            return
        }

        if (prompt.length > 1000) {
            toast.error('Prompt must be less than 1000 characters')
            setIsGenerating(prev => ({
                ...prev,
                hook: false
            }))
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
            setInputProps(prev => ({
                ...prev,
                text: data.hooks[0]
            }))
            setIndex(0) // Reset to first hook

            // Set hook param with hookId from response
            const params = new URLSearchParams(window.location.search)
            params.set('hook', data.hookId)
            window.history.replaceState({}, '', `${window.location.pathname}?${params}`)

            toast.success('Successfully generated new hooks!')
        } catch (error) {
            toast.error('Failed to generate hooks')
            console.error('Error generating hooks:', error)
        } finally {
            setOpen(false)
            setIsGenerating(prev => ({
                ...prev,
                hook: false
            }))
            setPrompt("")
        }
    }

    // const generateAudio = async () => {
    //     setIsGenerating(prev => ({
    //         ...prev,
    //         audio: true
    //     }))

    //     const prompt = sentences[index]

    //     if (!prompt || prompt.length === 0) {
    //         toast.error('Please enter a prompt')
    //         setIsGenerating(prev => ({
    //             ...prev,
    //             audio: false
    //         }))
    //         return
    //     }

    //     if (prompt.length < 10) {
    //         toast.error('Prompt must be at least 10 characters')
    //         setIsGenerating(prev => ({
    //             ...prev,
    //             audio: false
    //         }))
    //         return
    //     }

    //     if (prompt.length > 1000) {
    //         toast.error('Prompt must be less than 1000 characters')
    //         setIsGenerating(prev => ({
    //             ...prev,
    //             audio: false
    //         }))
    //         return
    //     }

    //     const response = await fetch('/api/generate-audio', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         },
    //         body: JSON.stringify({
    //             prompt: prompt,
    //             input_voice: "Jessica"
    //         }),
    //     })

    //     if (!response.ok) {
    //         toast.error('Failed to generate audio' + response.statusText)
    //         setIsGenerating(prev => ({
    //             ...prev,
    //             audio: false
    //         }))
    //         return
    //     }

    //     const data = await response.json()

    //     const { data: audio, error } = await supabase
    //         .storage
    //         .from('user_audios')
    //         .createSignedUrl(data.audio.path, 3600)

    //     console.log(audio?.signedUrl)

    // }

    const handleLipSyncChange = (checked: boolean) => {
        setInputProps(prev => ({
            ...prev,
            lip_sync: checked
        }))
    }

    const handleDemosUpdate = useCallback((newDemos: any[], newDemoVideos: string[]) => {
        setDemos(newDemos);
        setDemoVideos(newDemoVideos);
        setDemoPage(1);

        // If a demo was selected, reselect it to refresh the video
        if (selectedDemoId > 0) {
            // First reset
            setSelectedDemoId(0);
            resetDemo();

            // Then reselect after a short delay to ensure state updates
            setTimeout(() => {
                setSelectedDemoId(1);
                setDemo(1, newDemoVideos, token);
            }, 100);
        }
    }, [selectedDemoId, token, resetDemo, setDemo]);

    if (!user || !profile) {
        return <Loading />
    }

    return (
        <SidebarProvider>
            <AppSidebar user={
                {
                    id: user.id,
                    name: profile.name,
                    email: profile.email,
                    avatar: profile.avatar,
                    credits: profile.credits,
                    plan: profile.plan
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
                    <div className="grid auto-rows-min md:grid-cols-2 grid-cols-1 gap-4 h-fit">
                        {/* Video Preview */}
                        <div className="md:col-start-2 space-y-4 order-first md:order-last">
                            <div className="h-auto aspect-square rounded-xl bg-[#A4A4A4]/10 overflow-hidden">
                                <div className="relative w-full h-full aspect-[9/16]">
                                    {/* Add the preview badge */}
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md z-10">
                                        Low Quality Preview
                                    </div>
                                    <Player
                                        component={Main}
                                        inputProps={inputProps}
                                        durationInFrames={inputProps.video_duration}
                                        fps={isLocal ? 25 : 30}
                                        compositionWidth={1080}
                                        compositionHeight={1920}
                                        style={{
                                            height: '100%',
                                        }}
                                        controls
                                        className="mx-auto h-full relative"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row gap-6 items-center justify-end w-full">
                                {/* {video && state.status !== "invoking" && state.status !== "rendering" && state.status !== "done" && (
                                    <Link href={video}>
                                        <Button variant="outline" onClick={() => toast.success("Video downloaded")} className="w-fit">
                                            Download video
                                            <DownloadIcon className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                )} */}

                                {state.status === "done" && !operationId ? (
                                    <>
                                        <Button variant="outline" className="w-fit" onClick={() => toast.success("Video downloaded")} asChild>
                                            <a href={video} download>
                                                Download video
                                                <DownloadIcon className="w-5 h-5 ml-2" />
                                            </a>
                                        </Button>
                                        <Button onClick={createVideo} className="w-fit">
                                            Create video
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </Button>
                                    </>
                                ) : loading && !operationId ? (
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
                                ) : !operationId && !completed_video && (
                                    <div className="flex flex-col text-right w-full justify-end">
                                        <Button onClick={createVideo} className="w-fit mb-2 ml-auto">
                                            Create video
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </Button>
                                        <span className="text-xs text-[#1a1a1a]/60 font-mono text-right">
                                            rendered in full quality
                                        </span>
                                    </div>
                                )}

                                {operationId && (
                                    <Button variant="outline" className="w-fit">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <TextShimmer className='font-mono text-sm' duration={2}>
                                            Generating video...
                                        </TextShimmer>
                                        {progress > 0 && (
                                            <div className="text-sm font-[500] text-[#1a1a1a]/60">
                                                {progress}%
                                            </div>
                                        )}
                                    </Button>
                                )}

                                {completed_video && (
                                    <Button variant="outline" className="w-fit" onClick={() => toast.success("Video downloaded")} asChild>
                                        <a href={completed_video} download="avatar-video.mp4" target="_blank" rel="noopener noreferrer">
                                            Download video
                                            <DownloadIcon className="w-5 h-5 ml-2" />
                                        </a>
                                    </Button>
                                )}
                            </div>

                            {/* Lip Sync Settings */}
                            {selectedPhotoId < 129 && (
                                <div className="flex flex-row items-center gap-2">
                                    <div className={`h-fit transition-all duration-1000 ease-in-out ${inputProps.lip_sync ? 'w-full' : 'w-fit'} rounded-xl bg-[#A4A4A4]/10`}>
                                        <div className="flex flex-col items-start p-6">
                                            <div className={`flex flex-row items-center justify-between transition-all duration-300 ease-in-out ${inputProps.lip_sync ? 'w-full mb-6 md:mb-4' : 'w-fit'} gap-4`}>
                                                <div className="flex flex-row items-center gap-4">
                                                    <p className="text-base font-[500] text-[#1a1a1a]/60">
                                                        Lip Sync settings {inputProps.lip_sync ? <span className="text-primary font-[600]"> - ON</span> : ''}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-[500] text-[#1a1a1a]/60">
                                                    <Switch
                                                        checked={inputProps.lip_sync}
                                                        onCheckedChange={handleLipSyncChange}
                                                    />
                                                </div>
                                            </div>
                                            {inputProps.lip_sync && (
                                                <div className="w-full">
                                                    <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                        Avatar Voice
                                                    </label>
                                                    <Select
                                                        value={inputProps.voice}
                                                        onValueChange={(value) => setInputProps(prev => ({ ...prev, voice: value }))}
                                                    >
                                                        <SelectTrigger className="w-[180px] bg-background font-[500] truncate">
                                                            <SelectValue placeholder="Select voice" />
                                                        </SelectTrigger>
                                                        <SelectContent className="w-[180px] bg-background font-[500]">
                                                            {Object.keys(voices).map((voice) => (
                                                                <SelectItem key={voice} value={voice}>
                                                                    <span className="capitalize">{voice}</span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <audio src={voice_demos[inputProps.voice as keyof typeof voice_demos]} autoPlay controls className="border-primary/10 border-2 rounded-full mt-2" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                                    <button className={`flex flex-row items-center gap-2 text-[12px] font-[500] ${isGenerating.hook ? 'bg-primary/50' : 'bg-primary'} text-white px-2 py-1 rounded-md`}>
                                                        <WandSparkles className="w-3 h-3 animate-pulse" />
                                                        {isGenerating.hook ? 'Generating your hooks...' : 'Generate with AI'}
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
                                                            disabled={!prompt || isGenerating.hook}
                                                        >
                                                            {isGenerating.hook ? (
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
                                            {/* <Button onClick={generateAudio} className="w-fit">
                                                Generate Audio
                                            </Button> */}
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
                                            <button className={`font-mono ml-6 text-xs ${library === "library" ? "text-primary font-[600]" : "text-[#1a1a1a]/60"}`} onClick={() => setLibrary("library")}>
                                                Library
                                            </button>
                                            <span className="text-xs text-[#1a1a1a]/60 px-2">|</span>
                                            <button className={`font-mono text-xs ${library === "my_avatars" ? "text-primary font-[600]" : "text-[#1a1a1a]/60"}`} onClick={() => setLibrary("my_avatars")}>
                                                My avatars
                                            </button>
                                        </p>
                                        {/* CHECKPOINT */}








                                        <div className="flex flex-row items-center gap-2">
                                            <button className="text-[#1a1a1a]/50" onClick={library === "library" ? previousVideoPage : previousAvatarPage}>
                                                <ChevronLeftIcon className="w-5 h-5" />
                                            </button>
                                            <span className="text-sm font-[500] text-[#1a1a1a]/60">
                                                {library === "library" ?
                                                    `${videoPage}/${Math.ceil(photos.length / 21)}` :
                                                    `${avatarPage}/${Math.ceil(avatarVideos.length / 21)}`
                                                }
                                            </span>
                                            <button className="text-[#1a1a1a]/50" onClick={library === "library" ? nextVideoPage : nextAvatarPage}>
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    {library === "library" ? (
                                        <PhotoList
                                            plan={profile.plan}
                                            photos={photos}
                                            selectedPhotoId={selectedPhotoId}
                                            onPhotoSelect={onPhotoSelect}
                                            currentPage={videoPage}
                                        />
                                    ) : avatarVideos.length > 0 ? (
                                        <PhotoList
                                            plan={profile.plan}
                                            photos={avatarVideos}
                                            selectedPhotoId={selectedAvatarId}
                                            onPhotoSelect={onAvatarSelect}
                                            currentPage={avatarPage}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center w-full py-8 space-y-4">
                                            <p className="text-sm text-muted-foreground text-center">
                                                You haven&apos;t generated any avatars yet.
                                            </p>
                                            <Button asChild>
                                                <Link href="/dashboard/avatars">
                                                    <WandSparkles className="w-4 h-4 mr-2" />
                                                    Generate Avatar
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedPhotoId >= 129 && (
                                <div className="h-fit w-full rounded-xl bg-[#A4A4A4]/10">
                                    <div className="flex flex-col items-start p-6">
                                        <div className="flex flex-row items-center justify-between w-full mb-6 md:mb-4">
                                            <p className="text-base font-[500] text-[#1a1a1a]/60">
                                                3. Lip Sync Settings
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch checked={true} />
                                            <Label className="text-sm text-[#1a1a1a]/60">
                                                The lip sync is always activated for this model
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. Demo */}
                            {selectedPhotoId < 129 && (
                                <div className="h-fit w-full rounded-xl bg-[#A4A4A4]/10">
                                    <div className="flex flex-col items-start p-6">
                                        <div className="flex flex-row items-center justify-between w-full mb-6 md:mb-4">
                                            <p className="text-base font-[500] text-[#1a1a1a]/60">
                                                3. Choose your product video <span className="text-xs opacity-80 font-[500]">(optional)</span>{selectedDemoId === 0 ? <span className="text-xs text-primary font-[500]"> - no video selected</span> : ''}
                                            </p>
                                            {demos.length > 0 &&
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
                                            }
                                        </div>
                                        <DemoList
                                            photos={demos}
                                            selectedPhotoId={selectedDemoId}
                                            onPhotoSelect={onDemoSelect}
                                            currentPage={demoPage}
                                            token={token}
                                            onDemosUpdate={handleDemosUpdate}
                                        />
                                    </div>
                                </div>
                            )}
                            {/* 4. Text Settings */}
                            {selectedPhotoId < 129 && (
                                <div className="h-fit w-full rounded-xl bg-[#A4A4A4]/10">
                                    <div className="flex flex-col items-start p-6">
                                        <div className="flex flex-row items-center justify-between w-full">
                                            <p className="text-base font-[500] text-[#1a1a1a]/60 mb-4">
                                                4. Text Settings
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                            {/* FONT SIZE */}
                                            <div className="flex flex-col items-start">
                                                <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                    Font Size
                                                </label>
                                                <div className="relative w-full">
                                                    <Input
                                                        type="number"
                                                        value={textStyle.fontSize}
                                                        min={12}
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
                                                    <ColorPicker
                                                        defaultValue="#000"
                                                        showText
                                                        allowClear
                                                        className="p-[0.325rem] hover:border-primary/80"
                                                        onChange={(c) => {
                                                            setTextStyle(prev => ({
                                                                ...prev,
                                                                strokeColor: c.toHexString(),
                                                            }))
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* SHADOW COLOR */}
                                            <div className="flex flex-col items-start">
                                                <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                    Shadow Color
                                                </label>
                                                <div className="w-full">
                                                    <ColorPicker
                                                        defaultValue="#000"
                                                        showText
                                                        allowClear
                                                        className="p-[0.325rem] hover:border-primary/80"
                                                        onChange={(c) => {
                                                            setTextStyle(prev => ({
                                                                ...prev,
                                                                shadowColor: c.toHexString(),
                                                            }))
                                                        }}
                                                    />
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

                                            {/* VERTICAL ALIGNMENT */}
                                            <div className="flex flex-col items-start">
                                                <label className="text-sm font-[500] text-[#1a1a1a]/60 mb-1">
                                                    Vertical Alignment
                                                </label>
                                                {/* make a slider for vertical alignment and below it 3 settings for top, center, bottom*/}
                                                {/* complete  */}
                                                <div className="w-full space-y-3">
                                                    <Input
                                                        type="number"
                                                        value={textStyle.verticalAlignment}
                                                        min={10}
                                                        max={90}
                                                        onChange={handleVerticalAlignmentChange}
                                                        className="w-full bg-background pl-3 font-[500]"
                                                    />
                                                    <Slider
                                                        defaultValue={[50]}
                                                        max={90}
                                                        min={10}
                                                        step={1}
                                                        value={[textStyle.verticalAlignment]}
                                                        onValueChange={(e) =>
                                                            setTextStyle((prev) => ({
                                                                ...prev,
                                                                verticalAlignment: e[0]
                                                            }))
                                                        } />
                                                </div>
                                                <div className="flex flex-row items-center justify-between w-full mt-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-background"
                                                        onClick={() => setTextStyle((prev) => ({
                                                            ...prev,
                                                            verticalAlignment: 20
                                                        }))}
                                                    >

                                                        <AlignVerticalJustifyEnd className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-background"
                                                        onClick={() => setTextStyle((prev) => ({
                                                            ...prev,
                                                            verticalAlignment: 50
                                                        }))}
                                                    >

                                                        <AlignVerticalJustifyCenter className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-background"
                                                        onClick={() => setTextStyle((prev) => ({
                                                            ...prev,
                                                            verticalAlignment: 80
                                                        }))}
                                                    >

                                                        <AlignVerticalJustifyStart className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
