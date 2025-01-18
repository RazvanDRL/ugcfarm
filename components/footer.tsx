import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export function Footer() {
    return (
        <footer className="max-w-5xl mx-auto py-8 px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-20">
                <div className="flex flex-col space-y-4 max-w-xs">
                    <Link href="/">
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
                    <p className="text-sm font-medium text-[#1a1a1a]/60">
                        Turn viewers into website visitors with automated UGC content that converts.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    <div className="flex flex-col space-y-4">
                        <p className="font-semibold text-[#1a1a1a]">
                            Quick Links
                        </p>
                        <nav className="flex flex-col space-y-3">
                            <Link href="/#pricing" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Pricing
                            </Link>
                            <Link href="/faq" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                FAQ
                            </Link>
                            <Link href="/how-it-works" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                How it works
                            </Link>
                            <Link href="/affiliates" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Affiliates
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Link href="/blogs" className="font-semibold text-[#1a1a1a] hover:text-primary hover:underline transition-colors">
                            Blogs
                        </Link>
                        <nav className="flex flex-col space-y-3">
                            <Link href="/blogs/what-is-ugc" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                What is UGC?
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm font-medium text-gray-500">
                    &copy; {new Date().getFullYear()} UGC Farm. All rights reserved.
                </p>
                <div className="flex items-center space-x-4">
                    <Link href="/privacy" className="text-sm font-[500] text-gray-500 hover:text-gray-900">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-sm font-[500] text-gray-500 hover:text-gray-900">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    )
}
