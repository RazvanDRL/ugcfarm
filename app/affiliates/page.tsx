import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, DollarSign, Users, Zap, Gift } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const metadata = {
    title: "Affiliate Program | Earn Up to 40% Commission",
    description: "Join UGC Farm's affiliate program and earn up to 40% commission on referrals. Enjoy instant payouts, lifetime commissions, and exclusive perks. Apply now!",
    openGraph: {
        title: "UGC Farm Affiliate Program - Earn Up to 40% Commission",
        description: "Partner with UGC Farm and earn generous commissions for every referral. Benefit from lifetime tracking, instant payouts, and exclusive affiliate perks.",
        type: "website",
        url: "https://ugc.farm/affiliates",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "UGC Farm Affiliate Program",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Join UGC Farm's Affiliate Program - Earn Up to 40% Commission",
        description: "Partner with UGC Farm and earn generous commissions for every referral. Benefit from lifetime tracking, instant payouts, and exclusive affiliate perks.",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: "https://ugc.farm/affiliates",
    },
    keywords: "UGC Farm affiliate program, affiliate marketing, commission program, referral program, UGC affiliate, content creator affiliate",
}

const commission = 30

const features = [
    {
        title: `${commission}% Commission`,
        description: `Earn ${commission}% commission on every sale you refer to UGC Farm.`,
        icon: DollarSign,
    },
    {
        title: "Lifetime Referrals",
        description: "Get paid for every purchase your referral makes, forever.",
        icon: Users,
    },
    {
        title: "Instant Payouts",
        description: "Get paid instantly when your referral makes a purchase.",
        icon: Zap,
    },
    {
        title: "Exclusive Perks",
        description: "Get access to special promotions and affiliate-only content.",
        icon: Gift,
    },
]

const tiers = [
    {
        name: "Starter",
        commission: `${commission}%`,
        sales: "0-10",
        features: [
            "Basic affiliate dashboard",
            "Marketing materials",
            "Email support",
        ],
    },
    {
        name: "Pro",
        commission: `${commission + 5}%`,
        sales: "11-50",
        features: [
            "Advanced analytics",
            "Priority support",
            "Custom landing pages",
            "Early access to features",
        ],
        popular: true,
    },
    {
        name: "Elite",
        commission: `${commission + 10}%`,
        sales: "51+",
        features: [
            "Dedicated account manager",
            "Custom commission rates",
            "Co-marketing opportunities",
            "VIP support",
            "Exclusive events",
        ],
    },
]

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "UGC Farm Affiliate Program",
    description: "Join our affiliate program and earn up to 40% commission for every customer you refer to UGC Farm.",
    provider: {
        "@type": "Organization",
        name: "UGC Farm",
        url: "https://ugc.farm"
    },
    offers: {
        "@type": "Offer",
        description: "Earn up to 40% commission on referrals",
        seller: {
            "@type": "Organization",
            name: "UGC Farm"
        }
    }
}

export default function AffiliatesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="mt-40 mb-20 px-8" role="main">
                <div className="flex flex-col items-center justify-center mx-auto max-w-5xl space-y-12">
                    <section aria-label="Hero section" className="flex flex-col items-center justify-center space-y-8 text-center">
                        <Badge variant="secondary" className="px-4 py-1">
                            Affiliate Program
                        </Badge>
                        <h1 className="text-5xl font-[900] text-[#1a1a1a] text-center">
                            Earn money by sharing <br />
                            <span className="text-primary">UGC Farm</span>
                        </h1>
                        <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center max-w-2xl">
                            Join our affiliate program and earn up to {commission + 10}% commission for every customer you refer to UGC Farm.
                        </p>
                        <Link href="https://tally.so/r/w8A5vo">
                            <Button variant="default" size="lg" className="mt-8 hover:scale-[1.05] transition-all duration-300 font-[600] text-lg px-6 py-6">
                                Become an Affiliate
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </section>

                    <section aria-label="Features" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-16">
                        {features.map((feature) => (
                            <Card key={feature.title} className="border-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                                <CardContent className="pt-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <feature.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                                            <p className="text-muted-foreground font-[500]">{feature.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    <section aria-label="Commission Tiers" className="w-full mt-24">
                        <h2 className="text-4xl font-[900] text-center mb-12">
                            Commission Tiers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {tiers.map((tier) => (
                                <Card key={tier.name} className={cn(
                                    "relative",
                                    tier.popular ? "border-primary border-2 shadow-lg" : ""
                                )}>
                                    {tier.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge variant="default" className="bg-primary text-white">
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                                        <div className="mt-4">
                                            <span className="text-4xl font-bold">{tier.commission}</span>
                                            <span className="text-muted-foreground ml-1">commission</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {tier.sales} sales per month
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex items-center">
                                                    <ArrowRight className="h-4 w-4 text-primary mr-2" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section aria-label="Call to Action" className="mt-24 text-center space-y-8">
                        <h2 className="text-4xl font-[900]">
                            Ready to start earning?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-[500]">
                            Join our affiliate program today and start earning commission for every customer you refer.
                        </p>
                        <Link href="https://tally.so/r/w8A5vo">
                            <Button variant="default" size="lg" className="mt-8 hover:scale-[1.05] transition-all duration-300 font-[600] text-lg px-6 py-6">
                                Apply Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </section>
                </div>
            </main>

        </>
    )
} 