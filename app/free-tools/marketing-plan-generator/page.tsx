"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2, FileText, Copy } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"

export default function MarketingPlanGenerator() {
    const [businessName, setBusinessName] = useState("")
    const [businessDescription, setBusinessDescription] = useState("")
    const [industry, setIndustry] = useState("")
    const [marketingPlan, setMarketingPlan] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const generatePlan = async () => {
        if (!businessName || !businessDescription || !industry) {
            toast.error("Please fill out all fields")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/free-tools/generate-marketing-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    businessName,
                    businessDescription,
                    industry,
                })
            })

            if (!response.ok) {
                throw new Error("Failed to generate marketing plan")
            }

            const data = await response.json()
            setMarketingPlan(data.plan)
            toast.success("Marketing plan generated successfully!")
        } catch (error) {
            console.error("Error generating marketing plan:", error)
            toast.error("Failed to generate marketing plan")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="mt-40 mb-20 px-8">
                <div className="flex flex-col items-center justify-center mx-auto max-w-3xl space-y-12">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center justify-center space-y-8 text-center">
                        <Badge variant="secondary" className="px-4 py-1 font-bold">
                            Marketing Plan Generator
                        </Badge>
                        <h1 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            Generate Professional <br />Marketing Plans <span className="text-primary">In Minutes</span>
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                            Create comprehensive marketing strategies tailored to your business goals.
                        </p>
                    </div>

                    {/* Generator Tool */}
                    <Card className="w-full border-2">
                        <CardHeader className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-[800] text-[#1a1a1a]/60">
                                            Business Name
                                        </label>
                                    </div>
                                    <Input
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="Enter your business name"
                                        className="font-[500]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-[800] text-[#1a1a1a]/60">
                                            Business Description
                                        </label>
                                    </div>
                                    <Textarea
                                        value={businessDescription}
                                        onChange={(e) => setBusinessDescription(e.target.value)}
                                        placeholder="Describe your business, products/services, and target audience..."
                                        className="h-24 py-2 font-[500]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-[800] text-[#1a1a1a]/60">
                                            Industry
                                        </label>
                                    </div>
                                    <Input
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        placeholder="Enter your industry"
                                        className="font-[500]"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={generatePlan}
                                disabled={isLoading}
                                className="w-full font-[600]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Generate Marketing Plan
                                    </>
                                )}
                            </Button>
                        </CardHeader>

                        {marketingPlan && (
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <Badge variant="outline">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Marketing Plan
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(marketingPlan);
                                                toast.success("Copied to clipboard!");
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="whitespace-pre-wrap break-words text-lg font-[500]">
                                        {marketingPlan}
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </main>
        </>
    )
} 