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
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { AppSidebar } from '@/components/app-sidebar'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useQueryState } from 'nuqs'
import { Input } from "@/components/ui/input"
import { useImageUpload } from "@/hooks/use-image-upload"
import { ImagePlus, X, Upload, Trash2, Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { TextShimmer } from '@/components/ui/text-shimmer'
import { useRouter } from 'next/navigation'

export default function History() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [avatars, setAvatars] = useState<string[]>([])
    const [avatar, setAvatar] = useQueryState('avatar_url')
    const [outfit, setOutfit] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const {
        previewUrl,
        fileName,
        fileInputRef,
        handleThumbnailClick,
        handleFileChange,
        handleRemove,
    } = useImageUpload({
        onUpload: (url) => setOutfit(url),
    })

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

    const fetchAvatars = async (user_id: string) => {
        const { data: avatars, error: avatars_error } = await supabase.storage
            .from('user_avatars')
            .list(`${user_id}`, {
                // limit: 8,
                // offset: 0,
                sortBy: { column: 'updated_at', order: 'desc' },
            })

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

    const createTryOn = async () => {
        if (!avatar || !outfit) {
            toast.error('Please select an avatar and upload an outfit')
            return
        }

        try {
            setIsGenerating(true)

            // Fetch the image and convert to base64
            const response = await fetch(outfit)
            const blob = await response.blob()
            const reader = new FileReader()

            const base64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                    const base64String = reader.result as string
                    resolve(base64String)
                }
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })

            const tryOnResponse = await fetch('/api/try-on', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    human_image_url: avatar,
                    garment_image_base64: base64
                })
            })

            const data = await tryOnResponse.json()

            if (!tryOnResponse.ok) {
                toast.error(`Failed to generate try-on: ${data.error || 'Unknown error'}`)
                console.error(data)
                return
            }

            toast.success("Try-on generated successfully")
            await new Promise(resolve => setTimeout(resolve, 1000))

            // redirect to the try-on page
            router.push(`/dashboard/avatars/create`)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(`Failed to generate try-on: ${errorMessage}`)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            const file = e.dataTransfer.files?.[0]
            if (file && file.type.startsWith("image/")) {
                const fakeEvent = {
                    target: {
                        files: [file],
                    },
                } as unknown as React.ChangeEvent<HTMLInputElement>
                handleFileChange(fakeEvent)
            }
        },
        [handleFileChange],
    )

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
            <div className="flex flex-col items-center max-w-5xl mx-auto justify-start min-h-[calc(100vh-84px)] px-8 lg:px-0">
                <div className="w-full flex flex-col items-start justify-start mb-8">
                    <div className="flex flex-col items-start justify-start w-full">
                        <div className="flex items-center gap-4 w-full">
                            <div className={cn(
                                "flex-1 border-b-2 pb-4",
                                !avatar ? "border-primary" : "border-muted"
                            )}>
                                <h2 className="text-2xl text-[#1a1a1a] font-bold">
                                    Step 1: Select an avatar
                                </h2>
                                <p className={cn(
                                    "text-muted-foreground",
                                    avatar && "opacity-50"
                                )}>
                                    Choose a base avatar to dress up
                                </p>
                            </div>
                            <div className={cn(
                                "flex-1 border-b-2 pb-4",
                                avatar ? "border-primary" : "border-muted"
                            )}>
                                <h2 className={cn(
                                    "text-2xl text-[#1a1a1a] font-bold",
                                    !avatar && "opacity-50"
                                )}>
                                    Step 2: Upload outfit
                                </h2>
                                <p className={cn(
                                    "text-muted-foreground",
                                    !avatar && "opacity-50"
                                )}>
                                    Add your clothing image to overlay
                                </p>
                            </div>
                        </div>

                        {avatar && (
                            <Button
                                variant="outline"
                                className="self-start mt-4"
                                onClick={() => setAvatar(null)}
                            >
                                &larr;&nbsp;&nbsp;Back to Avatars
                            </Button>
                        )}
                    </div>
                </div>
                {!avatar ? (
                    <div className="w-full flex flex-col items-center justify-center">
                        {avatars.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                            <Button
                                                variant="ghost"
                                                className='text-primary hover:text-primary bg-white cursor-pointer'
                                                onClick={() => setAvatar(avatar)}
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
                ) : (
                    <div className="w-full flex flex-col self-start items-start justify-start">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div className="col-span-4 w-screen max-w-3xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Image Upload</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Supported formats: JPG, PNG, JPEG, WEBP
                                    </p>
                                </div>

                                <Input
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .webp"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />

                                {!previewUrl ? (
                                    <div
                                        onClick={handleThumbnailClick}
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={cn(
                                            "flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
                                            isDragging && "border-primary/50 bg-primary/5",
                                        )}
                                    >
                                        <div className="rounded-full bg-background p-3 shadow-sm">
                                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Click to select</p>
                                            <p className="text-xs text-muted-foreground">
                                                or drag and drop file here
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="group relative h-96 overflow-hidden rounded-lg border">
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={handleThumbnailClick}
                                                    className="h-9 w-9 p-0"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => { handleRemove(); setAvatar(null) }}
                                                    className="h-9 w-9 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        {fileName && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="truncate">{fileName}</span>
                                                <button
                                                    onClick={() => { handleRemove(); setAvatar(null) }}
                                                    className="ml-auto rounded-full p-1 hover:bg-muted"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="w-full flex justify-end">
                                            {isGenerating ? (
                                                <div className='flex flex-col items-center justify-end gap-2 mt-8 w-fit ml-auto'>
                                                    <Button variant="outline" className="w-fit">
                                                        <Loader className="w-5 h-5 animate-spin" />
                                                        <TextShimmer className='font-mono text-sm' duration={2}>
                                                            Generating try-on...
                                                        </TextShimmer>
                                                    </Button>
                                                    <label className='text-[10px] font-mono text-muted-foreground/70'>
                                                        This will take 30 seconds
                                                    </label>
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={createTryOn}
                                                    className="mt-8 w-fit ml-auto"
                                                >
                                                    Create avatar&nbsp;&nbsp;&rarr;
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarInset >
    </SidebarProvider >
    )
}