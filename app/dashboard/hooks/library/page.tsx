"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { Profile, supabase } from "@/lib/supabase/client/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowRight, Copy } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { BreadcrumbItem } from "@/components/ui/breadcrumb"

interface HookEntry {
    id: string
    created_at: string
    prompt: string
    data: string[]
    user_id: string
}

export default function HooksLibraryPage() {
    const router = useRouter()
    const [hooks, setHooks] = useState<HookEntry[]>([])
    const [hookIndex, setHookIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const getHooks = async () => {
            setIsLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
                return
            }

            // Fetch user profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileError) {
                toast.error("Failed to fetch profile")
                return
            }

            setProfile(profileData)

            // Fetch hooks
            const { data: hooksData, error: hooksError } = await supabase
                .from('hook_library')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (hooksError) {
                toast.error("Failed to fetch hooks")
                return
            }

            setHooks(hooksData)
            setIsLoading(false)
        }

        getHooks()
    }, [])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard!")
    }

    if (!profile || isLoading) {
        return <div>Loading...</div>
    }

    return (
        <SidebarProvider>
            <AppSidebar user={profile} />
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
                                    <BreadcrumbPage>Hooks Library</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-col gap-6 items-center justify-center min-h-screen px-8">
                    {hooks.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <h2 className="text-xl font-semibold">No Hooks Found</h2>
                            <p className="text-muted-foreground">
                                You haven&apos;t created any hooks yet. Create a hook to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col py-12 lg:p-0 lg:flex-row gap-12 pr-4">

                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl font-semibold">Prompts</h2>
                                {hooks.map((hook, index) => (
                                    <button
                                        key={hook.id}
                                        className={`hover:bg-primary/20 flex items-center justify-between bg-primary/10 border-2 border-primary/50 flex-row gap-4 p-4 rounded-lg transition-all ${hookIndex === index ? 'translate-x-4' : ''}`}
                                        onClick={() => setHookIndex(index)}
                                    >
                                        <h2 className={`text-base text-left font-bold text-primary w-full max-w-[300px] line-clamp-1 transition-all duration-200 ${hookIndex === index ? 'underline' : ''}`}>
                                            {hook.prompt}
                                        </h2>
                                        <div className="flex flex-row gap-4 items-center">
                                            {hookIndex === index &&
                                                <Link href={`/dashboard?hook=${hook.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-white bg-primary hover:bg-primary/80 font-bold transition-all hover:text-white"
                                                    >
                                                        Use
                                                    </Button>
                                                </Link>
                                            }
                                            < ArrowRight className={`w-4 h-4 text-primary transition-transform duration-200 ${hookIndex === index ? 'rotate-90' : ''}`} />

                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl font-semibold line-clamp-1 max-w-[50vw] md:max-w-[30vw] min-w-full">Hooks - <span className="text-primary">{hooks[hookIndex]?.prompt}</span></h2>
                                <div className="flex flex-col gap-4 h-[500px] max-w-fit overflow-y-auto overflow-x-hidden rounded-lg p-4 pr-8 border-2 border-primary/50">
                                    {hooks[hookIndex]?.data.map((text, index) => (
                                        <div
                                            key={index}
                                            className="group relative flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg w-full max-w-[400px] md:w-[30vw] hover:shadow-md transition-shadow"
                                        >
                                            <p className="text-sm text-gray-800 font-medium">{text}</p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 group-hover:bg-gray-200 transition-opacity"
                                                onClick={() => copyToClipboard(text)}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
} 