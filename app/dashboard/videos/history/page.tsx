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

            const session = await supabase.auth.refreshSession()
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
            const url = await fetchVideo(video.video_id, access_token, 'output-bucket')
            tempVideos.push({ ...video, video_url: url })
        }
        setVideos(tempVideos)
    }

    if (!profile || !user) {
        return <div>Loading...</div>
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
                                <BreadcrumbLink href="#">
                                    Dashboard
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