import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export function Footer() {
    return (
        <footer className="max-w-5xl mx-auto py-8 px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-20">
                <div className="flex flex-col space-y-4 max-w-xs">
                    <Image
                        src="/next.svg"
                        alt="UGC Farm"
                        width={72}
                        height={72}
                    />
                    <p className="text-sm font-medium text-[#1a1a1a]/60">
                        UGC Farm is a platform for farmers to sell their products directly to consumers.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    <div className="flex flex-col space-y-4">
                        <p className="font-semibold text-[#1a1a1a]">
                            Products
                        </p>
                        <nav className="flex flex-col space-y-3">
                            <Link href="/" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Home
                            </Link>
                            <Link href="/about" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                About
                            </Link>
                            <Link href="/contact" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <p className="font-semibold text-[#1a1a1a]">
                            Resources
                        </p>
                        <nav className="flex flex-col space-y-3">
                            <Link href="/blog" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Blog
                            </Link>
                            <Link href="/docs" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Documentation
                            </Link>
                            <Link href="/help" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Help Center
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <p className="font-semibold text-[#1a1a1a]">
                            Legal
                        </p>
                        <nav className="flex flex-col space-y-3">
                            <Link href="/privacy" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:underline transition-colors font-medium">
                                Terms
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
