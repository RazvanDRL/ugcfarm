"use client";
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-[80vh] px-8">
            <div className="text-center space-y-8">
                <h1 className="text-7xl font-black text-primary">
                    404
                </h1>
                <h2 className="text-3xl font-[700]">
                    {"Oops! Page not found :("}
                </h2>
                <p className="text-gray-600 max-w-md mx-auto font-medium">
                    The page you&apos;re looking for seems to have wandered off. Let&apos;s get you back on track!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link href="/">
                        <Button
                            variant="outline"
                            className='w-full sm:w-auto font-[600]'
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Button
                        variant="default"
                        onClick={() => window.history.back()}
                        className="bg-primary hover:bg-primary/90 w-full sm:w-auto font-[600]"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        </main>
    )
}
