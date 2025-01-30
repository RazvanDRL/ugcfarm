"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { DiscountBanner } from "./banner"

export function Navbar() {
    return (
        <>
            <DiscountBanner />
            <nav className="z-50 fixed bg-background flex items-center justify-center mx-auto top-8 md:top-10 left-0 right-0 w-full max-w-5xl">
                <div className="container flex h-20 items-center justify-between px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={120}
                            height={120}
                            priority
                            loading="eager"
                            className="w-[96px]s md:w-[120px] h-auto"
                        />
                    </Link>

                    {/* Quick links - hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-12">
                        <Link href="/#pricing" className="font-[600] hover:underline opacity-70 hover:opacity-100 transition-all duration-300">Pricing</Link>
                        <Link href="/affiliates" className="font-[600] hover:underline opacity-70 hover:opacity-100 transition-all duration-300">Affiliates</Link>
                        <Link href="/#faq" className="font-[600] hover:underline opacity-70 hover:opacity-100 transition-all duration-300">FAQ</Link>
                        <Link href="/demo" className="font-[600] hover:underline opacity-70 hover:opacity-100 transition-all duration-300">Demo</Link>
                    </div>

                    {/* Desktop buttons - hidden on mobile */}
                    <div className="hidden md:flex md:items-center md:justify-center md:space-x-4">
                        {/* <Button variant="ghost" asChild>
                            <Link href="/login">
                                <span className="font-[900] text-primary">Login</span>
                            </Link>
                        </Button>
                        <Link href="/signup" className="hover:scale-105 transition-all duration-300">
                            <Button variant="default">
                                <span className="font-[900]">Sign up</span>
                            </Button>
                        </Link> */}
                        <Link href="/login" className="hover:scale-105 transition-all duration-300">
                            <Button variant="default">
                                <span className="font-[900]">Login</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden z-[9999]">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetTitle>Quick links</SheetTitle>
                                <div className="flex flex-col space-y-4 mt-4">
                                    <Link href="/#pricing" className="font-[600] px-4 py-2 hover:bg-accent rounded-md transition-colors">Pricing</Link>
                                    <Link href="/affiliates" className="font-[600] px-4 py-2 hover:bg-accent rounded-md transition-colors">Affiliates</Link>
                                    <Link href="/#faq" className="font-[600] px-4 py-2 hover:bg-accent rounded-md transition-colors">FAQ</Link>
                                    <Link href="/demo" className="font-[600] px-4 py-2 hover:bg-accent rounded-md transition-colors">Demo</Link>
                                    <div className="border-t pt-4">
                                        {/* <Button variant="ghost" asChild className="w-full">
                                            <Link href="/login">
                                                <span className="font-[900] text-primary">Login</span>
                                            </Link>
                                        </Button>
                                        <Button asChild className="w-full mt-2">
                                            <Link href="/signup">
                                                <span className="font-[900]">Sign up</span>
                                            </Link>
                                        </Button> */}
                                        <Button asChild className="w-full mt-2">
                                            <Link href="/login">
                                                <span className="font-[900]">Login</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </>
    )
}