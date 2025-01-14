import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export function Footer() {
    return (
        <footer className="max-w-5xl mx-auto py-8">
            <div className="flex justify-left items-start space-x-20">
                <div className="flex flex-col space-y-4">
                    <Image
                        src="/next.svg"
                        alt="UGC Farm"
                        width={72}
                        height={72}
                    />
                    <p className="text-sm font-medium text-[#1a1a1a]/60 max-w-xs">
                        UGC Farm is a platform for farmers to sell their products directly to consumers.
                    </p>
                </div>


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
            </div>
            <Separator className="my-8" />
            <p className="text-center text-sm font-semibold leading-5 text-gray-500">
                &copy; {new Date().getFullYear()} UGC Farm. All rights reserved.
            </p>
        </footer >
    )
}
