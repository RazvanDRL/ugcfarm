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
import { getSignedUrl } from "@/hooks/use-signed-url"

const style_options = ["selfie", "whole body"]
const gender_options = ["female", "male"]
const age_options = ["young", "adult", "middle-aged", "senior", "elderly"]
const body_options = ["slim", "curvy", "athletic"]
const hair_options = ["long", "short", "curly"]
const background_options = ["city", "nature", "beach", "mountains", "forest", "desert", "snow", "space", "underwater", "indoor", "outdoor"]

const default_avatar = {
    style: style_options[0],
    gender: gender_options[0],
    age: age_options[0],
    body: body_options[0],
    hair: hair_options[0],
    background: background_options[0]
}

export default function History() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [selectedStyle, setSelectedStyle] = useState<string>(default_avatar.style)
    const [selectedGender, setSelectedGender] = useState<string>(default_avatar.gender)
    const [selectedAge, setSelectedAge] = useState<string>(default_avatar.age)
    const [selectedBody, setSelectedBody] = useState<string>(default_avatar.body)
    const [selectedHair, setSelectedHair] = useState<string>(default_avatar.hair)
    const [selectedBackground, setSelectedBackground] = useState<string>(default_avatar.background)
    const [avatars, setAvatars] = useState<string[]>([])

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
                fetchAvatars(user.id, session.data.session?.access_token)
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

        if (!style_options.includes(selectedStyle)) {
            toast.error("You must select a style")
            return
        }
        if (!gender_options.includes(selectedGender)) {
            toast.error("You must select a gender")
            return
        }
        if (!age_options.includes(selectedAge) && selectedAge !== '') {
            toast.error("Invalid age")
            return
        }
        if (!body_options.includes(selectedBody) && selectedBody !== '') {
            toast.error("Invalid body")
            return
        }
        if (!hair_options.includes(selectedHair) && selectedHair !== '') {
            toast.error("Invalid hair")
            return
        }
        if (!background_options.includes(selectedBackground) && selectedBackground !== '') {
            toast.error("Invalid background")
            return
        }

        if (profile.credits < 0.2) {
            toast.error('Insufficient credits')
            return
        }

        try {
            setIsGenerating(true)
            setProfile(prev => prev ? { ...prev, credits: prev.credits - 0.2 } : null)
            const response = await fetch('/api/generate-avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    style: selectedStyle,
                    gender: selectedGender,
                    age: selectedAge,
                    body: selectedBody,
                    hair: selectedHair,
                    background: selectedBackground
                })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(`Failed to generate avatar: ${data.error || 'Unknown error'}`)
                return
            }

            toast.success("Avatar generated successfully")
            setAvatars(prev => [data.url, ...prev])
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(`Failed to generate avatar: ${errorMessage}`)
        } finally {
            setIsGenerating(false)
        }
    }

    const fetchAvatars = async (user_id: string, token: string) => {
        const { data: avatars, error: avatars_error } = await supabase
            .from('user_avatars')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })

        console.log(avatars)

        if (avatars_error) {
            toast.error('Failed to fetch avatars')
            throw new Error('Failed to fetch avatars')
        }

        if (avatars.length > 0) {
            const signedUrls = await Promise.all(
                avatars.map(async (avatar) => {
                    const key = avatar.data.seed !== undefined ? avatar.id + '.jpg' : avatar.id + '.png';
                    const signedUrl = await getSignedUrl(key, 'user-avatars', token);
                    return signedUrl;
                })
            );

            setAvatars(signedUrls.filter((url: string | null) => url !== null) as string[]);
        }
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
                                <BreadcrumbLink href="/dashboard/avatars">
                                    Avatars
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Create your avatar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-col items-center max-w-5xl mx-auto justify-center min-h-[calc(100vh-84px)] px-8 lg:px-0">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold tracking-tight">Create your own avatar</h1>
                    <p className="text-muted-foreground">
                        Create your own avatar with your own image
                    </p>
                    {/* OPTIONS */}
                    <div className="w-full flex flex-col gap-4 justify-start items-start mt-4">
                        {/* STYLE */}
                        <Options
                            label="photo style"
                            options={style_options}
                            disabled={isGenerating}
                            onOptionChange={(option) => setSelectedStyle(option)}
                            selectedOption={selectedStyle}
                        />

                        {/* GENDER */}
                        <Options
                            label="gender"
                            options={gender_options}
                            disabled={isGenerating}
                            onOptionChange={(option) => setSelectedGender(option)}
                            selectedOption={selectedGender}
                        />

                        {/* AGE */}
                        <Options
                            label="age"
                            options={age_options}
                            disabled={isGenerating}
                            onOptionChange={(option) => setSelectedAge(prev => prev === option ? '' : option)}
                            selectedOption={selectedAge}
                        />

                        {/* BODY */}
                        <Options
                            label="body"
                            options={body_options}
                            disabled={isGenerating}
                            onOptionChange={(option) => setSelectedBody(prev => prev === option ? '' : option)}
                            selectedOption={selectedBody}
                        />

                        {/* HAIR */}
                        <Options
                            label="hair"
                            options={hair_options}
                            disabled={isGenerating}
                            onOptionChange={(option) => setSelectedHair(prev => prev === option ? '' : option)}
                            selectedOption={selectedHair}
                        />

                        {/* BACKGROUND */}
                        <Options
                            label="background"
                            options={background_options}
                            disabled={isGenerating}
                            onOptionChange={(option) => setSelectedBackground(prev => prev === option ? '' : option)}
                            selectedOption={selectedBackground}
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
                                This will take 15 seconds
                            </label>
                        </div>
                    ) : (
                        <Button
                            onClick={handleCreateAvatar}
                            className="mt-8 w-fit ml-auto"
                        >
                            Create avatar&nbsp;&nbsp;&rarr;
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
                                    <img
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
                                            className='text-primary hover:text-primary bg-white cursor-pointer'
                                            onClick={() => window.location.href = `/dashboard/avatars/try-on?avatar_url=${avatar}`}
                                        >
                                            Use
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