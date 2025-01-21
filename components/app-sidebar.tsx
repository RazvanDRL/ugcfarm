"use client"

import * as React from "react"
import {
    BookCopy,
    Calendar,
    ChartArea,
    History,
    LifeBuoy,
    Send,
    Settings2,
    SquareTerminal,
    User,
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

const data = {
    user: {
        name: "Arthur",
        email: "arthur@ugc.farm",
        avatar: "/assets/blog/authors/arthur.webp",
    },
    navMain: [
        {
            title: "Playground",
            url: "/dashboard",
            icon: SquareTerminal,
            isActive: true,
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
            name: "Analytics",
            url: "/dashboard/analytics",
            icon: ChartArea,
        },
        {
            name: "Schedule",
            url: "/dashboard/schedule",
            icon: Calendar,
        },
        {
            name: "Auto-Post",
            url: "/dashboard/auto-post",
            icon: Send,
        },
        {
            name: "My Profile",
            url: "/dashboard/profile",
            icon: User,
        }
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar >
    )
}
