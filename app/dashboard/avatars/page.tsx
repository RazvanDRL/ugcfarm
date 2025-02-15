"use client"
import { SidebarTrigger } from '@/components/ui/sidebar'
import { BreadcrumbPage, BreadcrumbLink, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbList, Breadcrumb } from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { supabase, type User, type Profile } from '@/lib/supabase/client/supabase'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AppSidebar } from '@/components/app-sidebar'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { UserSquare2, Shirt, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AvatarsPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        async function fetchUser() {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error) {
                toast.error('Failed to fetch user')
                throw new Error('Failed to fetch user')
            }

            if (!user) {
                toast.error('Please login to continue')
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
        }
        fetchUser()
    }, [])

    if (!profile || !user) {
        return <Loading />
    }

    return (
        <SidebarProvider>
            <AppSidebar user={{
                id: user.id,
                name: profile.name,
                email: profile.email,
                avatar: profile.avatar,
                credits: profile.credits,
                plan: profile.plan,
            }} />
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
                                    <BreadcrumbPage>Avatars</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-col items-center max-w-5xl mx-auto justify-center min-h-[calc(100vh-84px)] px-8 lg:px-0">
                    <div className="flex flex-col items-center justify-center w-full gap-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Avatar Studio</h1>
                            <p className="text-muted-foreground mt-2">
                                Create, customize, and bring your avatars to life
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                            {/* Generate Avatar */}
                            <Button
                                variant="outline"
                                className="h-48 flex flex-col gap-4 p-8 hover:border-primary/50"
                                onClick={() => router.push('/dashboard/avatars/create')}
                            >
                                <UserSquare2 className="w-12 h-12" />
                                <div className="text-center">
                                    <h3 className="font-semibold">Generate Avatar</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Create a new AI-powered avatar
                                    </p>
                                </div>
                            </Button>

                            {/* Try On Clothes */}
                            <Button
                                variant="outline"
                                className="h-48 flex flex-col gap-4 p-8 hover:border-primary/50"
                                onClick={() => router.push('/dashboard/avatars/try-on')}
                            >
                                <Shirt className="w-12 h-12" />
                                <div className="text-center">
                                    <h3 className="font-semibold">Try On Clothes</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Dress your avatar with AI fashion
                                    </p>
                                </div>
                            </Button>

                            {/* Create Video */}
                            <Button
                                variant="outline"
                                className="h-48 flex flex-col gap-4 p-8 hover:border-primary/50"
                                onClick={() => router.push('/dashboard/avatars/create-video')}
                            >
                                <Video className="w-12 h-12" />
                                <div className="text-center">
                                    <h3 className="font-semibold">Create Video</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Animate your avatar in videos
                                    </p>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
