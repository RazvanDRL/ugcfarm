"use client"
import { SidebarTrigger } from '@/components/ui/sidebar'
import { BreadcrumbPage } from '@/components/ui/breadcrumb'
import { BreadcrumbLink } from '@/components/ui/breadcrumb'
import { BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { BreadcrumbList } from '@/components/ui/breadcrumb'
import { SidebarInset } from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { supabase, type User, type Profile } from '@/lib/supabase/client/supabase'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { AppSidebar } from '@/components/app-sidebar'
import Loading from '@/components/loading'
import Options from '@/components/options'
import { Button } from '@/components/ui/button'
import { Download, Loader, Maximize2 } from 'lucide-react'
import { TextShimmer } from '@/components/ui/text-shimmer'
import Image from 'next/image'
import { useQueryState } from 'nuqs'

const duration_options = ["5s", "10s"]
const action_options = ["talking", "looking", "walking", "waving", "dancing", "smiling"]

const default_avatar = {
    duration: duration_options[0],
    action: action_options[0],
}

export default function History() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [selectedDuration, setSelectedDuration] = useState<string>(default_avatar.duration)
    const [selectedAction, setSelectedAction] = useState<string>(default_avatar.action)
    const [avatars, setAvatars] = useState<string[]>([])
    const [image_url, setImageUrl] = useQueryState('image_url')

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
                fetchAvatars(user.id)
            } else {
                toast.error("No access token found")
            }
        }
        fetchUser()
    }, [])

    const handleCreateAvatar = async () => {
        if (!token || !profile) {
            window.location.reload()
            return
        }

        if (!image_url) {
            toast.error("You must select an avatar")
            return
        }

        if (!duration_options.includes(selectedDuration)) {
            toast.error("You must select a duration")
            return
        }

        if (!action_options.includes(selectedAction)) {
            toast.error("You must select an action")
            return
        }

        if (profile.credits < 1) {
            toast.error('Insufficient credits')
            return
        }

        try {
            setIsGenerating(true)
            setProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null)
            const response = await fetch('/api/generate-avatar-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    image_url: image_url,
                    duration: selectedDuration,
                    action: selectedAction,
                })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(`Failed to generate avatar: ${data.error || 'Unknown error'}`)
                return
            }

            toast.success("Avatar generated successfully")
            console.log(data.url)
            // setAvatars(prev => [data.url, ...prev])
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(`Failed to generate avatar: ${errorMessage}`)
        } finally {
            setIsGenerating(false)
        }
    }

    const fetchAvatars = async (user_id: string) => {
        const { data: avatars, error: avatars_error } = await supabase.storage
            .from('user_avatars')
            .list(`${user_id}`, {
                // limit: 8,
                // offset: 0,
                sortBy: { column: 'updated_at', order: 'desc' },
            })

        console.log(avatars)

        if (avatars_error) {
            toast.error('Failed to fetch avatars')
            throw new Error('Failed to fetch avatars')
        }

        const { data: signed_url, error: signed_url_error } = await supabase.storage
            .from('user_avatars')
            .createSignedUrls(avatars.map(avatar => user_id + '/' + avatar.name), 86400)

        if (signed_url_error) {
            toast.error('Failed to fetch avatars')
            throw new Error('Failed to fetch avatars')
        }
        setAvatars(signed_url.map(url => url.signedUrl))
    }

    const handleDownloadAvatar = async (avatarUrl: string) => {
        try {
            const response = await fetch(avatarUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `avatar-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Avatar downloaded successfully');
        } catch (error) {
            toast.error('Failed to download avatar');
        }
    };

    if (!profile || !user) {
        return <Loading />
    }

    return (<SidebarProvider>
        <AppSidebar user={
            {
                id: user.id,
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
                                <BreadcrumbPage>Create your own avatar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-col items-center max-w-5xl mx-auto justify-center min-h-[calc(100vh-84px)] px-8 lg:px-0">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold tracking-tight">Create your own avatar</h1>
                    <p className="text-muted-foreground">
                        Create your own avatar with your own video
                    </p>
                    {/* OPTIONS */}
                    <div className="w-full flex flex-col gap-4 justify-start items-start mt-4">
                        {/* DURATION */}
                        <Options
                            label="video duration"
                            options={duration_options}
                            disabled={isGenerating}
                            onOptionChange={(option) => setSelectedDuration(option)}
                            selectedOption={selectedDuration}
                        />

                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-mono text-muted-foreground uppercase">
                                selected avatar {image_url && <button className="text-primary hover:text-primary/90 hover:underline" onClick={() => setImageUrl(null)}>remove</button>}
                            </p>
                            {image_url ? (
                                <Image
                                    src={image_url}
                                    alt="avatar"
                                    width={90}
                                    height={160}
                                    className="rounded-md"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iMTYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI5MCUiIGhlaWdodD0iMTYwJSIgZmlsbD0iI2RkZGRkZCIvPjwvc3ZnPg=="
                                />
                            ) : (
                                <p className="text-sm font-mono text-primary lowercase">
                                    No image selected
                                </p>
                            )}
                        </div>

                        {/* ACTION */}
                        <Options
                            label="action"
                            options={action_options}
                            disabled={isGenerating}
                            onOptionChange={(option) => setSelectedAction(option)}
                            selectedOption={selectedAction}
                        />
                    </div>
                    {isGenerating ? (
                        <div className='flex flex-col items-center justify-end gap-2 mt-8 w-fit ml-auto'>
                            <Button variant="outline" className="w-fit">
                                <Loader className="w-5 h-5 animate-spin" />
                                <TextShimmer className='font-mono text-sm' duration={2}>
                                    Generating avatar...
                                </TextShimmer>
                            </Button>
                            <label className='text-[10px] font-mono text-muted-foreground/70'>
                                This will take 4 minutes, you can safely leave this page
                            </label>
                        </div>
                    ) : (
                        <Button
                            onClick={handleCreateAvatar}
                            className="mt-8 w-fit ml-auto"
                        >
                            Create video&nbsp;&nbsp;&rarr;
                        </Button>
                    )}
                </div>

                {/* AVATARS */}
                <div className="w-full flex flex-col items-center justify-center">
                    <h2 className="text-3xl text-[#1a1a1a] font-bold text-left w-full mb-8 mt-20">
                        Your avatars {avatars.length > 0 ? `(${avatars.length})` : ''}
                    </h2>
                    {avatars.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-4">
                            {avatars.map((avatar, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden group">
                                    <Image
                                        src={avatar}
                                        alt={`Avatar ${index}`}
                                        width={180}
                                        height={270}
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex flex-col gap-2 items-center justify-center opacity-0 group-hover:cursor-pointer group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className='text-primary hover:text-primary bg-white cursor-pointer'
                                                onClick={() => window.open(avatar, '_blank')}
                                            >
                                                <Maximize2 className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className='text-primary hover:text-primary bg-white cursor-pointer'
                                                onClick={() => handleDownloadAvatar(avatar)}
                                            >
                                                <Download className="w-5 h-5" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="text-primary hover:text-primary bg-white cursor-pointer"
                                            onClick={() => {
                                                setImageUrl(avatar);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        >
                                            Select
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-muted-foreground">
                                You don&apos;t have any avatars yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarInset>
    </SidebarProvider>
    )
}