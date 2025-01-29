"use client"
import { SidebarTrigger } from '@/components/ui/sidebar'
import { BreadcrumbPage } from '@/components/ui/breadcrumb'
import { BreadcrumbLink } from '@/components/ui/breadcrumb'
import { BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { BreadcrumbList } from '@/components/ui/breadcrumb'
import { SidebarInset } from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { VideoHistoryGrid } from './video-history-grid'
import { Separator } from '@/components/ui/separator'
import { supabase, type User, type Profile } from '@/lib/supabase/client/supabase'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { AppSidebar } from '@/components/app-sidebar'
import { getSignedUrl } from '@/hooks/use-signed-url'
import Loading from '@/components/loading'


export default function History() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [videos, setVideos] = useState<any[]>([])
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        async function fetchUser() {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error) {
                toast.error('Failed to fetch user')
                throw new Error('Failed to fetch user')
            }

            if (!user) {
                toast.error('Please login to view your video history')
                redirect('/login')
            }

            setUser(user)

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            if (profileError) {
                toast.error('Failed to fetch profile')
                throw new Error('Failed to fetch profile')
            }

            setProfile(profile)

            const session = await supabase.auth.getSession()
            if (session.data.session?.access_token) {
                setToken(session.data.session?.access_token)
                console.log("session data token found")
                fetchVideos(user, session.data.session?.access_token)
            } else {
                toast.error("No access token found")
            }
        }
        fetchUser()
    }, [])
    async function fetchVideos(user: User, access_token: string) {
        const { data: videos, error } = await supabase
            .from('video_history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching videos:', error)
            return <div>Error loading videos</div>
        }

        setVideos(videos)
        const tempVideos = []
        for (const video of videos) {
            const url = await getSignedUrl(video.video_id + ".mp4", 'output-bucket', access_token)
            tempVideos.push({ ...video, video_url: url })
        }
        setVideos(tempVideos)
    }

    if (!profile || !user) {
        return <Loading />
    }

    return (<SidebarProvider>
        <AppSidebar user={
            {
                name: profile.name,
                email: profile.email,
                avatar: profile.avatar,
                credits: profile.credits,
                plan: profile.plan,
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
                                <BreadcrumbLink href="/dashboard">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Video History</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-10 pt-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Video History</h1>
                    <p className="text-muted-foreground">
                        View all your previously generated videos
                    </p>
                </div>
                <Separator />
                <VideoHistoryGrid videos={videos} />
            </div>
        </SidebarInset>
    </SidebarProvider>
    )
}