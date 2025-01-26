"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, ArrowRight, Lock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import StripeLogo from '@/public/logos/stripe.svg';
import Image from 'next/image';

type User = {
    id: string;
    email: string;
}

interface PricingProps {
    id?: string;
    className?: string;
    user?: User | null;
    referral?: string | null;
}

function isEmpty(value: string | undefined | null): boolean {
    return value === undefined || value === null || value === '';
}

function linkify(paymentLink: string, userId: string | undefined, email: string | undefined, referral: string | undefined): string {
    const baseUrl = `https://buy.stripe.com/${paymentLink}`;
    const params = new URLSearchParams();

    if (!isEmpty(email)) params.set('prefilled_email', email!);
    if (!isEmpty(userId)) params.set('client_reference_id', userId!);
    if (!isEmpty(referral)) params.set('prefilled_promo_code', referral!);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

const Pricing: React.FC<PricingProps> = ({ id, className, user, referral }) => {
    const plans = [
        {
            title: "Starter",
            emoji: "🌱",
            description: "Convince yourself",
            price: !referral ? 19 : (29 * 0.7).toFixed(2),
            originalPrice: 49,
            features: [
                "10 videos",
                "$1.90 per video",
                "10 UGC avatars",
                "Viral Hook Generator",
                <Link key="affiliate_essential" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
                "✕ Schedule videos",
                "✕ Full analytics",
                "✕ Custom avatars",
            ],
            cta: "Start Now",
            paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_ID_1,
            popular: false
        },
        {
            title: "Creator",
            emoji: "🚀",
            description: "All you need to get started",
            price: !referral ? 49 : (49 * 0.7).toFixed(2),
            originalPrice: 99,
            features: [
                "50 videos",
                "$0.98 per video",
                "90+ UGC avatars",
                "Custom avatars",
                "Viral Hook Generator",
                "Schedule videos",
                "Full analytics",
                <Link key="affiliate_essential" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
            ],
            cta: "Get Started",
            paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_ID_2,
            popular: true
        },
        {
            title: "Business",
            emoji: "🏆",
            description: "Perfect for businesses",
            price: 1290,
            originalPrice: 1990,
            features: [
                "1500 videos",
                "$0.86 per video",
                "90+ UGC avatars",
                "Custom avatars",
                "Viral Hook Generator",
                "Schedule videos",
                "Full analytics",
                "Feature previews",
                <Link key="affiliate_essential" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
            ],
            cta: "Scale Now",
            paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_ID_3,
            popular: false
        }
    ]

    return (
        <div id={id} className={`${className}`}>
            <div className="max-w-5xl">
                <h2 className={cn("text-5xl text-[#1a1a1a] sm:text-5xl font-black mb-8 text-center")}>
                    Presale Pricing
                </h2>
                <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center mb-12">
                    Lock in these prices forever.
                    <br />
                    You can top-up your account with more videos at any time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan, index) => (
                        <Card key={index} className={cn(
                            "flex flex-col px-6 rounded-xl mb-2",
                            plan.popular ? "border-primary border-2 shadow-lg md:scale-[1.06]" : "opacity-90",
                            "transition-all duration-200 hover:shadow-md relative"
                        )}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-black px-3 py-1 rounded-full">
                                    Popular
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex justify-between items-center mb-4">
                                    <CardTitle className={cn("text-2xl font-black text-[#1a1a1a]")}>{plan.title}</CardTitle>
                                    <span className="text-3xl">{plan.emoji}</span>
                                </div>
                                <CardDescription className="text-md font-[500]">{plan.description}</CardDescription>
                                <div className={cn("text-4xl font-extrabold text-[#1a1a1a]")}>
                                    <span className="line-through mr-2 text-base font-normal text-muted-foreground">
                                        ${plan.originalPrice}
                                    </span>
                                    ${plan.price}
                                    <span className="ml-1 text-base text-muted-foreground font-[500]">
                                        one-time
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center font-[500]">
                                            {typeof feature === 'string' && feature.startsWith("✕") ? (
                                                <>
                                                    <span className="mr-2 text-red-500 font-bold">✕</span>
                                                    <span className="text-[#1a1a1a]/60">{feature.substring(2)}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-5 w-5 text-primary" />
                                                    {typeof feature === 'string' ? feature : feature}
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="flex flex-col items-center">
                                <Button className={cn("w-full text-lg py-6 font-[900]", plan.popular ? "bg-primary text-white" : "bg-white text-[#1a1a1a]")} variant={plan.popular ? "default" : "outline"} asChild>
                                    <Link href={linkify(plan.paymentLink!, user?.id!, user?.email!, referral!)} target="_blank">
                                        {plan.cta}
                                        {plan.popular && (
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        )}
                                    </Link>
                                </Button>
                                {plan.popular ? (
                                    <p className="mt-3 text-xs text-primary font-[500] opacity-80">
                                        Access forever (no subscription)
                                    </p>
                                ) : (
                                    <p className="mt-3 text-xs text-muted-foreground font-[500] opacity-80">
                                        Access forever (no subscription)
                                    </p>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                {/* enterprise */}
                {/* <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Building2 className="h-6 w-6 text-primary" />
                        <h2 className={cn("text-2xl font-bold")}>Enterprise</h2>
                    </div>
                    <p className="text-muted-foreground mb-6 font-[500]">
                        Need a custom solution for your team? Let&apos;s talk.
                    </p>

                    <Link href="/" target="_blank" >
                        <Button variant="outline" className="font-[600]">
                            Schedule a call
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                </div> */}

                <Link href="https://stripe.com/" rel="noopener noreferrer" target="_blank" className="flex items-center grayscale justify-center mt-4 h-10">
                    <Lock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Secured by</span>
                    <Image src={StripeLogo} alt="Stripe" width={37} height={10} className="ml-1" />
                </Link>
            </div>
        </div >
    );
}

export default Pricing;
