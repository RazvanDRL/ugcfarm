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
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { Profile, supabase, type User } from "@/lib/supabase/client/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@/hooks/use-signed-url"
import Loading from "@/components/loading"
import { VideoIcon, UserRoundIcon, HistoryIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"






const sections = [
    {
        href: "/dashboard/normal",
        icon: <VideoIcon />,
        title: "Upload Video",
        description: "Add or translate Captions"
    },
    {
        href: "/dashboard/shorts",
        icon: <UserRoundIcon />,
        title: "AI Shorts",
        description: "Viral clips from longer videos"
    },
    {
        href: "/dashboard/creators",
        icon: <HistoryIcon />,
        title: "AI Creators",
        description: "Generate talking videos and AI Ads"
    }
]

export default function Page() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [token, setToken] = useState<string | null>(null)

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
                    setToken(session.data.session?.access_token)
                }
            } else {
                router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
            }
        }

        getUser()
    }, [])

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
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Create Video</h1>
                        <div className="flex flex-row gap-4 w-full">
                            {sections.map((section) => (
                                <Link href={section.href} key={section.href} className="flex-1 bg-primary/[0.03] hover:bg-primary/10 rounded-xl border border-primary/50 transition-colors">
                                    <div className="flex flex-row gap-4 justify-start items-center p-6">
                                        <div className="p-3 bg-primary text-white rounded-full">
                                            {section.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="text-primary font-semibold">{section.title}</h2>
                                            <p className="text-sm text-black/50">{section.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <Tabs defaultValue="Video History">
                            <TabsList>
                                <TabsTrigger value="Video History">Video History</TabsTrigger>
                                <TabsTrigger value="Avatar History">Avatar History</TabsTrigger>
                                <TabsTrigger value="Video Captions">Video Captions</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
