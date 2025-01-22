"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wand2, Copy, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Textarea } from "@/components/ui/textarea"

type Platform = 'facebook' | 'instagram' | 'tiktok'
type ProductCategory = 'fashion' | 'beauty' | 'home' | 'tech' | 'fitness' | 'other'
type HookIntent = 'sales' | 'engagement' | 'traffic'

interface GeneratedHook {
    text: string
    platform: Platform
    tips: string[]
}

export default function HookGeneratorPage() {
    const [productDescription, setProductDescription] = useState("")
    const [platform, setPlatform] = useState<Platform>("instagram")
    const [category, setCategory] = useState<ProductCategory>("fashion")
    const [intent, setIntent] = useState<HookIntent>("sales")
    const [isLoading, setIsLoading] = useState(false)
    const [generatedHooks, setGeneratedHooks] = useState<GeneratedHook[]>([])

    const generateHooks = async () => {
        if (!productDescription.trim()) {
            toast.error("Please enter your product description")
            return
        }
        setIsLoading(true)
        try {
            const response = await fetch('/api/generate-hooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productDescription,
                    platform,
                    category,
                    intent,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate hooks')
            }

            const data = await response.json()
            setGeneratedHooks(data.hooks)
        } catch (error) {
            toast.error('Failed to generate hooks. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard!")
    }

    return (
        <>
            <Navbar />
            <main className="mt-40 mb-20 px-8">
                <div className="flex flex-col items-center justify-center mx-auto max-w-3xl space-y-12">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center justify-center space-y-8 text-center">
                        <Badge variant="secondary" className="px-4 py-1 font-bold">
                            E-commerce Hook Generator
                        </Badge>
                        <h1 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            Generate Converting Hooks<br />
                            <span className="text-primary">In Seconds</span>
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center">
                            Stop waiting for UGC creators. Generate scroll-stopping hooks<br />
                            that drive traffic and sales to your store.
                        </p>
                    </div>

                    {/* Generator Tool */}
                    <Card className="w-full border-2">
                        <CardHeader className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-[800] text-[#1a1a1a]/60">
                                        Product Description
                                    </label>
                                    <Textarea
                                        placeholder="Describe your product, its key features, and target audience..."
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                        className="h-24 resize-none py-2 font-[500]"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-[600] text-[#1a1a1a]/60">
                                            Platform
                                        </label>
                                        <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                                            <SelectTrigger className="font-[500]">
                                                <SelectValue placeholder="Select platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="facebook">Facebook</SelectItem>
                                                <SelectItem value="instagram">Instagram</SelectItem>
                                                <SelectItem value="tiktok">TikTok</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-[600] text-[#1a1a1a]/60">
                                            Category
                                        </label>
                                        <Select value={category} onValueChange={(value) => setCategory(value as ProductCategory)}>
                                            <SelectTrigger className="font-[500]">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fashion">Fashion</SelectItem>
                                                <SelectItem value="beauty">Beauty</SelectItem>
                                                <SelectItem value="home">Home</SelectItem>
                                                <SelectItem value="tech">Tech</SelectItem>
                                                <SelectItem value="fitness">Fitness</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-[600] text-[#1a1a1a]/60">
                                            Goal
                                        </label>
                                        <Select value={intent} onValueChange={(value) => setIntent(value as HookIntent)}>
                                            <SelectTrigger className="font-[500]">
                                                <SelectValue placeholder="Select goal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sales">Drive Sales</SelectItem>
                                                <SelectItem value="engagement">Boost Engagement</SelectItem>
                                                <SelectItem value="traffic">Increase Traffic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={generateHooks}
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
                                        Generate Hooks
                                    </>
                                )}
                            </Button>
                        </CardHeader>

                        {generatedHooks.length > 0 && (
                            <CardContent className="space-y-6 pt-6">
                                {generatedHooks.map((hook, index) => (
                                    <div key={index} className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <Badge variant="outline" className="capitalize">
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                {hook.platform}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(hook.text)}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-lg font-[600]">{hook.text}</p>
                                        <div className="space-y-2">
                                            {hook.tips.map((tip, tipIndex) => (
                                                <p key={tipIndex} className="text-sm text-muted-foreground">
                                                    • {tip}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        )}
                    </Card>
                </div>
            </main>

        </>
    )
} 