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

const Pricing: React.FC<PricingProps> = ({ className, user, referral }) => {
    const plans = [
        {
            title: "Starter",
            emoji: "🌱",
            description: "Convince yourself",
            price: !referral ? 1 : ((10 * 0.7) / 10).toFixed(2),
            totalPrice: !referral ? 10 : (10 * 0.7).toFixed(2),
            originalPrice: 5,
            features: [
                "10 videos",
                <Link key="affiliate_starter" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
                "✕ Portfolio Builder",
                "✕ Progress tracking",
                "✕ Full-access to the app",
            ],
            cta: "Start Free",
            paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_ID_1,
            popular: false
        },
        {
            title: "Essential",
            emoji: "🚀",
            description: "All you need to get started",
            price: !referral ? (19 / 50).toFixed(2) : ((19 * 0.7) / 50).toFixed(2),
            totalPrice: !referral ? 19 : (19 * 0.7).toFixed(2),
            originalPrice: 39,
            features: [
                "50 videos",
                "Personalized AI feedback",
                "Portfolio builder",
                "Progress tracking",
                <Link key="affiliate_essential" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
                "Full-access to the app",
            ],
            cta: "Get Started",
            paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_ID_2,
            popular: true
        },
        {
            title: "Unlimited",
            emoji: "🏆",
            description: "Perfect for committed learners",
            price: !referral ? (49 / 500).toFixed(2) : ((49 * 0.7) / 500).toFixed(2),
            totalPrice: !referral ? 49 : (49 * 0.7).toFixed(2),
            originalPrice: 99,
            features: [
                <span key="unlimited" className="bg-primary/10 px-1 rounded">Unlimited videos</span>,
                "Personalized AI feedback",
                "Portfolio builder",
                "Progress tracking",
                <Link key="affiliate_unlimited" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
                "Full-access to the app",
            ],
            cta: "Go Unlimited",
            paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_ID_3,
            popular: false
        }
    ]

    return (
        <div className={`${className}`}>
            <div className="max-w-5xl mt-16">
                <h1 className={cn("text-5xl text-[#1a1a1a] sm:text-5xl font-black mb-8 text-center")}>
                    Learn copywriting by <span className="text-primary">actually writing</span>
                </h1>
                <p className="text-xl font-[600] text-[#1a1a1a]/60 text-center mb-12">
                    Start learning today. Choose the perfect plan for you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan, index) => (
                        <Card key={index} className={cn(
                            "flex flex-col px-6 rounded-xl mb-2",
                            plan.popular ? "border-primary border-2 shadow-lg md:scale-105" : "",
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
                                    {/* <span className="line-through mr-2 text-lg font-normal text-muted-foreground">
                                        ${plan.originalPrice}
                                    </span> */}
                                    ${plan.price}
                                    <span className="text-base font-[500] text-muted-foreground">&nbsp;per video</span>
                                </div>
                                {plan.totalPrice && (
                                    <span className="text-sm font-[500] pt-2 text-[#1a1a1a]/60">&nbsp;total&nbsp;${plan.totalPrice} one-time</span>
                                )}
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
                                <p className="mt-3 text-xs text-muted-foreground font-[500]">
                                    Access forever (no subscription)
                                </p>
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

                </div>

                <Link href="https://stripe.com/" rel="noopener noreferrer" target="_blank" className="flex items-center justify-center mt-4 h-10">
                    <Lock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Secured by</span>
                    <Image src={StripeLogo} alt="Stripe" width={37} height={10} className="ml-1" />
                </Link> */}
            </div>
        </div >
    );
}

export default Pricing;
