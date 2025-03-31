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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LinkIcon, Send } from "lucide-react"
import transformed_creators from "@/transformed_creators.json"

const creators = transformed_creators.map((creator) => ({
    id: creator.id,
    name: creator.name,
    url: creator.url,
    alt: creator.alt,
}))


export default function Page() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [text, setText] = useState<string>("")
    const [success, setSuccess] = useState<boolean>(false)
    const [step, setStep] = useState<number>(1)
    const [selectedCreator, setSelectedCreator] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const creatorsPerPage = 9
    const totalPages = Math.ceil(creators.length / creatorsPerPage)

    // Get current page creators
    const getCurrentPageCreators = () => {
        const startIndex = (currentPage - 1) * creatorsPerPage
        const endIndex = startIndex + creatorsPerPage
        return creators.slice(startIndex, endIndex)
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
                                    <BreadcrumbPage>Create video</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-10 pt-6">
                    <div className="flex flex-col gap-4 max-w-sm mx-auto w-full h-full justify-center">
                        <div className="flex flex-col gap-2">

                            {step === 1 && !success && (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="product-url">Product URL</label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="product-url"
                                            placeholder="Enter your product url"
                                            value={text}
                                            className="w-full"
                                            required
                                            type="url"
                                            onChange={(e) => setText(e.target.value)}
                                        />

                                        <Button
                                            size="icon"
                                            className="w-12"
                                            onClick={() => setStep(2)}
                                        >
                                            <Send className="w-4 h-4 text-white" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && !success && (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="avatar">Choose your avatar</label>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {getCurrentPageCreators().map((creator) => (
                                            <div
                                                key={creator.id}
                                                className={`aspect-[9/16] rounded-md overflow-hidden relative cursor-pointer transition-all hover:scale-105 hover:shadow-md ${selectedCreator === creator.id ? 'ring-2 ring-primary' : ''}`}
                                                onClick={() => setSelectedCreator(creator.id)}
                                            >
                                                <img src={creator.url} alt={creator.alt} width={100} height={100} />
                                                <div className="absolute bottom-1 left-1 flex bg-primary p-1 rounded-md text-sm items-center justify-center">
                                                    <p className="text-white text-center">{creator.name.replace(/-\d+$/, '')}</p>
                                                </div>
                                                {selectedCreator === creator.id && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <div className="bg-primary text-white px-2 py-1 rounded-md text-sm">
                                                            Selected
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination controls */}
                                    <div className="flex justify-between items-center gap-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        >
                                            Previous
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        >
                                            Next
                                        </Button>
                                    </div>

                                    {selectedCreator && (
                                        <Button
                                            className="mt-4"
                                            onClick={async () => {
                                                if (!text) {
                                                    toast.error("Please enter a product URL");
                                                    return;
                                                }

                                                try {
                                                    toast.loading("Submitting product URL...");

                                                    const response = await fetch('/api/telegram', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            url: text,
                                                            message: `New product submission from ${profile.name} (${profile.email} - ${profile.id})\n\nSelected avatar: ${creators.find(c => c.id === selectedCreator)?.name}`
                                                        }),
                                                    });

                                                    if (!response.ok) {
                                                        throw new Error('Failed to send message');
                                                    }

                                                    toast.dismiss();
                                                    toast.success("Product URL submitted successfully!");
                                                    setText("");
                                                    setSuccess(true)
                                                } catch (error) {
                                                    toast.dismiss();
                                                    toast.error("Failed to submit product URL");
                                                    console.error(error);
                                                }
                                            }
                                            }
                                        >
                                            Get my video
                                        </Button>
                                    )}
                                </div>
                            )}

                            {success && (
                                <div className="flex flex-col gap-2 p-2 bg-green-500 text-white rounded-md font-[500]">
                                    <p>
                                        This will take up to 30 minutes to process.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
