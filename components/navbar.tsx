"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
    return (
        <nav className="z-[9999] sticky bg-background flex items-center justify-center mx-auto top-0 left-0 right-0 w-full max-w-5xl">
            <div className="container flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/next.svg"
                        alt="Logo"
                        width={72}
                        height={72}
                        priority
                        loading="eager"
                    />
                    <span className="font-black text-xl text-primary">UGCfarm</span>
                </Link>

                {/* Quick links */}
                <div className="flex items-center space-x-12">
                    <Link href="/" className="font-[600] hover:underline opacity-70 hover:opacity-100 transition-all duration-300">Pricing</Link>
                    <Link href="/" className="font-[600] hover:underline opacity-70 hover:opacity-100 transition-all duration-300">Demo</Link>
                    <Link href="/" className="font-[600] hover:underline opacity-70 hover:opacity-100 transition-all duration-300">Contact</Link>
                </div>

                {/* Desktop buttons - hidden on mobile */}
                <div className="hidden md:flex md:items-center md:justify-center md:space-x-4">
                    <Button variant="ghost" asChild>
                        <Link href="/login">
                            <span className="font-[900] text-primary">Login</span>
                        </Link>
                    </Button>
                    <Link href="/signup" className="hover:scale-105 transition-all duration-300">
                        <Button variant="default">
                            <span className="font-[900]">Sign up</span>
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col space-y-4 mt-4">
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/signup">Sign up</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
