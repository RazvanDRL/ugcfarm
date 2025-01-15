import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Home } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function ThankYouPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-primary" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-[900] text-[#1a1a1a]">
                        Thank You!
                    </h1>
                    <p className="text-[#1a1a1a]/60 font-[500]">
                        Your application has been received. We'll review it and get back to you shortly.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button asChild variant="default">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>

                    <Button asChild variant="ghost">
                        <Link href="/affiliates">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Affiliates
                        </Link>
                    </Button>
                </div>
            </Card>
        </main>
    )
}
