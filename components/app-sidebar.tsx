"use client"

import * as React from "react"
import {
    BookCopy,
    Calendar,
    ChartArea,
    FileVideo2,
    HelpCircle,
    History,
    LifeBuoy,
    PlusCircle,
    Send,
    Settings2,
    Shirt,
    SquareTerminal,
    SquareUserRound,
    User,
    Users,
    Video,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { type Profile } from "@/lib/supabase/client/supabase"
// import { FeedbackFish } from '@feedback-fish/react'
import { Button } from "./ui/button"
import TikTokAuthButton from "./tiktok-auth-button"

const data = {
    navMain: [
        {
            title: "Create video",
            url: "/dashboard",
            icon: Video,
            isActive: true,
        },
        {
            title: "Create hooks",
            url: "/dashboard/create-hook",
            icon: FileVideo2,
        },
        {
            title: "Avatar Studio",
            url: "/dashboard/avatars",
            icon: Users,
        },
        {
            title: "Hook Library",
            url: "/dashboard/hooks/library",
            icon: BookCopy,
        },
        {
            title: "Video History",
            url: "/dashboard/videos/history",
            icon: History,
        },
    ],
    projects: [
        {
            name: "Generate Avatar",
            url: "/dashboard/avatars/create",
            icon: SquareUserRound,
        },
        {
            name: "Try-on",
            url: "/dashboard/avatars/try-on",
            icon: Shirt,
        },
        {
            name: "Generate Video",
            url: "/dashboard/avatars/create-video",
            icon: Video,
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: Profile }) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <Image
                                        src="/logo.svg"
                                        alt="Logo"
                                        width={140}
                                        height={160} />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <div className="px-4">
                    {/* <FeedbackFish projectId="7af5337d80b183" >
                        <Button variant="outline" className="w-full bg-primary text-white border-none transition-all duration-300">
                            <HelpCircle className="w-5 h-5" />
                            Help
                        </Button>
                    </FeedbackFish> */}
                    {/* @dev TIKTOK BUTTON */}
                    {/* <TikTokAuthButton user_id={user.id} /> */}
                </div>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
                <div className="px-4 pb-2 mt-auto space-y-2">
                    <Link href="/#pricing">
                        <Button variant="outline" className="w-full bg-primary text-white border-none transition-all duration-300">
                            <PlusCircle className="w-5 h-5" />
                            Add more credits
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-primary/10 border-2 border-primary/50">
                        <Video className="w-6 h-6 text-primary" />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-xs font-medium text-primary">Credits Available</p>
                            <p className="text-sm font-semibold text-[#1a1a1a]">{user.credits.toFixed(1)} credits</p>
                        </div>
                    </div>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar >
    )
}
