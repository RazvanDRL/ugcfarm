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
            price: 0,
            originalPrice: 5,
            features: [
                "1 exercise with feedback",
                <Link key="affiliate_starter" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
                "✕ Portfolio Builder",
                "✕ Progress tracking",
                "✕ Full-access to the app",
            ],
            cta: "Start Free",
            paymentLink: null,
            popular: false
        },
        {
            title: "Essential",
            emoji: "🚀",
            description: "All you need to get started",
            price: !referral ? (19 / 35).toFixed(2) : ((19 * 0.7) / 35).toFixed(2),
            totalPrice: !referral ? 19 : (19 * 0.7).toFixed(2),
            originalPrice: 39,
            features: [
                "35 exercises",
                "Personalized AI feedback",
                "Portfolio builder",
                "Progress tracking",
                <Link key="affiliate_essential" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
                "Full-access to the app",
            ],
            cta: "Get Started",
            paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_ID1,
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
                <span key="unlimited" className="bg-[#007FFF]/10 px-1 rounded">Unlimited exercises</span>,
                "Personalized AI feedback",
                "Portfolio builder",
                "Progress tracking",
                <Link key="affiliate_unlimited" href="/affiliates" className='hover:underline'>Affiliate program</Link>,
                "Full-access to the app",
            ],
            cta: "Go Unlimited",
            paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_ID2,
            popular: false
        }
    ]

    return (
        <div className={`${className}`}>
            <div className="max-w-5xl mt-16">
                <h1 className={cn("text-4xl sm:text-5xl font-extrabold mb-8 text-center")}>
                    Learn copywriting by <span className="text-[#007FFF]">actually writing</span>
                </h1>
                <p className="text-xl text-muted-foreground text-center mb-12">
                    Start learning today. Choose the perfect plan for you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan, index) => (
                        <Card key={index} className={cn(
                            "flex flex-col px-6 rounded-xl mb-2",
                            plan.popular ? "border-[#007FFF] border-2 shadow-lg md:scale-105" : "",
                            "transition-all duration-200 hover:shadow-md relative"
                        )}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#007FFF] text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                    Popular
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex justify-between items-center mb-4">
                                    <CardTitle className={cn("text-2xl font-bold")}>{plan.title}</CardTitle>
                                    <span className="text-3xl">{plan.emoji}</span>
                                </div>
                                <CardDescription className="text-md">{plan.description}</CardDescription>
                                <div className={cn("text-4xl font-bold")}>
                                    {/* <span className="line-through mr-2 text-lg font-normal text-muted-foreground">
                                        ${plan.originalPrice}
                                    </span> */}
                                    ${plan.price}
                                    <span className="text-base font-normal text-muted-foreground">&nbsp;per exercise</span>
                                </div>
                                {plan.totalPrice && (
                                    <div className={cn("text-4xl font-bold mb-2")}>
                                        <span className="text-sm font-normal text-muted-foreground/70">&nbsp;total&nbsp;${plan.totalPrice} one-time</span>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center">
                                            {typeof feature === 'string' && feature.startsWith("✕") ? (
                                                <>
                                                    <span className="mr-2 text-red-500 font-bold">✕</span>
                                                    <span className="text-gray-500">{feature.substring(2)}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-5 w-5 text-[#007FFF]" />
                                                    {typeof feature === 'string' ? feature : feature}
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="flex flex-col items-center">
                                <Button className={cn("w-full text-lg py-6 font-bold", plan.popular ? "bg-[#007FFF] text-white" : "bg-white text-black")} variant={plan.popular ? "default" : "outline"} asChild>
                                    <Link href={plan.paymentLink ? linkify(plan.paymentLink, user?.id!, user?.email!, referral!) : `https://copy-coach.com/signup`} target="_blank">
                                        {plan.cta}
                                        {plan.popular && (
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        )}
                                    </Link>
                                </Button>
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Access forever (no subscription)
                                </p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Building2 className="h-6 w-6 text-[#007FFF]" />
                        <h2 className={cn("text-2xl font-bold")}>Enterprise</h2>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Need a custom solution for your team? Let&apos;s talk.
                    </p>

                    <Link href="https://calendly.com/arthurluca/enterprise-plan-copycoach" target="_blank" >
                        <Button variant="outline" className="">
                            Schedule a call
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                </div>

                <Link href="https://stripe.com/" rel="noopener noreferrer" target="_blank" className="flex items-center justify-center mt-4 h-10">
                    <Lock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Secured by</span>
                    <Image src={StripeLogo} alt="Stripe" width={37} height={10} className="ml-1" />
                </Link>
            </div>
        </div >
    );
}

export default Pricing;
