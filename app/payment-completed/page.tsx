"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Home, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const Confetti = dynamic(() => import('react-confetti'), {
    ssr: false
})

export default function PaymentCompletedPage() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        })
        setIsClient(true)

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            {isClient && <Confetti
                width={dimensions.width}
                height={dimensions.height}
                recycle={false}
                numberOfPieces={200}
            />}
            <Card className="max-w-md w-full p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-primary" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-[900] text-[#1a1a1a]">
                        Thank You!
                    </h1>
                    <p className="text-[#1a1a1a]/60 font-[500]">
                        Your purchase has been received. <br />
                        You will receive an email with a surprise.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button asChild variant="default">
                        <Link href="/login">
                            <User className="mr-2 h-4 w-4" />
                            Login
                        </Link>
                    </Button>

                    <Button asChild variant="ghost">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </Card>
        </main>
    )
}
