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
import { Loader } from 'lucide-react'
import { TextShimmer } from '@/components/ui/text-shimmer'
import Image from 'next/image'

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
    const [avatar, setAvatar] = useState<string | null>(null)

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
            } else {
                toast.error("No access token found")
            }
        }
        fetchUser()
    }, [])

    const handleCreateAvatar = async () => {
        if (!token) {
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
        try {
            setIsGenerating(true)
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
            setAvatar(data.url)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(`Failed to generate avatar: ${errorMessage}`)
        } finally {
            setIsGenerating(false)
        }
    }

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
            <div className="flex items-center max-w-5xl mx-auto justify-center h-[calc(100vh-84px)]">
                {avatar === null ? (
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
                            <Button variant="outline" className="mt-8 w-fit ml-auto">
                                <Loader className="w-5 h-5 animate-spin" />
                                <TextShimmer className='font-mono text-sm' duration={2}>
                                    Generating avatar...
                                </TextShimmer>
                            </Button>
                        ) : (
                            <Button
                                onClick={handleCreateAvatar}
                                className="mt-8 w-fit ml-auto"
                            >
                                Create avatar&nbsp;&nbsp;&rarr;
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold tracking-tight">Your avatar</h1>
                        <Image src={avatar} alt="avatar" width={90 * 3} height={160 * 3} className="rounded-lg" />
                    </div>
                )}
            </div>
        </SidebarInset>
    </SidebarProvider>
    )
}