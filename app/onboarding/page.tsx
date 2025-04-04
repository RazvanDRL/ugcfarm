"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Instagram, TikTok, Facebook, X, LinkedIn } from "@/logos";
import { supabase } from "@/lib/supabase/client/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/components/loading";

const userTypeSchema = z.object({
    userType: z.enum(["ecom", "agency"])
});

const productLinkSchema = z.object({
    productLink: z.string().url("Please enter a valid URL")
});

const storeStyleSchema = z.object({
    storeStyle: z.enum(["luxury", "classic", "edgy", "minimal", "playful", "tech", "vintage", "other"])
});

const feedbackSchema = z.object({
    source: z.enum(["instagram", "tiktok", "facebook", "twitter", "linkedin", "other", "friend"]).optional(),
    additionalInfo: z.string().optional()
});

const styleOptions = [
    { value: "luxury", label: "Luxury", emoji: "✨" },
    { value: "classic", label: "Classic", emoji: "🏛️" },
    { value: "edgy", label: "Edgy", emoji: "🔥" },
    { value: "minimal", label: "Minimal", emoji: "⚪" },
    { value: "playful", label: "Playful", emoji: "🎮" },
    { value: "tech", label: "Tech-forward", emoji: "🚀" },
    { value: "vintage", label: "Vintage", emoji: "🕰️" },
    { value: "other", label: "Other", emoji: "✏️" }
];

const sourceOptions = [
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "tiktok", label: "TikTok", icon: TikTok },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "twitter", label: "Twitter", icon: X },
    { value: "linkedin", label: "LinkedIn", icon: LinkedIn },
    { value: "friend", label: "Friend", icon: "👥" },
    { value: "other", label: "Other", icon: "🔍" }
];

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const [userType, setUserType] = useState<"ecom" | "agency" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        productLink: "",
        storeStyle: "",
        source: "",
        additionalInfo: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
            } else {
                // fetch user onboarding data
                const { data: onboardingData } = await supabase
                    .from("onboarding")
                    .select("*")
                    .eq("user_id", user.id);

                if (onboardingData && onboardingData.length > 0) {
                    router.push("/dashboard");
                }
            }
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
        fetchUser();
    }, []);

    // User type form
    const userTypeForm = useForm<z.infer<typeof userTypeSchema>>({
        resolver: zodResolver(userTypeSchema),
        defaultValues: {
            userType: undefined
        }
    });

    // Product link form
    const productLinkForm = useForm<z.infer<typeof productLinkSchema>>({
        resolver: zodResolver(productLinkSchema),
        defaultValues: {
            productLink: ""
        }
    });

    // Store style form
    const storeStyleForm = useForm<z.infer<typeof storeStyleSchema>>({
        resolver: zodResolver(storeStyleSchema),
        defaultValues: {
            storeStyle: undefined
        }
    });

    // Feedback form
    const feedbackForm = useForm<z.infer<typeof feedbackSchema>>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            source: undefined,
            additionalInfo: ""
        }
    });

    // Handle user type selection
    const onUserTypeSubmit = (data: z.infer<typeof userTypeSchema>) => {
        setUserType(data.userType);
        setFormData({ ...formData });
        setStep(1);
    };

    // Handle product link submission
    const onProductLinkSubmit = (data: z.infer<typeof productLinkSchema>) => {
        setFormData({ ...formData, productLink: data.productLink });
        setStep(2);
    };

    // Handle store style submission
    const onStoreStyleSubmit = (data: z.infer<typeof storeStyleSchema>) => {
        setFormData({ ...formData, storeStyle: data.storeStyle });
        setStep(3);
    };

    // Handle feedback submission
    const onFeedbackSubmit = async (data: z.infer<typeof feedbackSchema>) => {
        setIsSubmitting(true);

        const finalData = {
            user_type: userType,
            product_link: formData.productLink,
            store_style: formData.storeStyle,
            source: data.source || "",
            additional_info: data.additionalInfo || "",
        };

        try {
            const { error } = await supabase
                .from("onboarding")
                .insert([finalData]);

            if (error) {
                console.error("Error inserting data:", error);
                toast.error("There was a problem saving your information.");
            } else {
                toast.success("Your information has been saved!");

                setStep(4);

                setTimeout(() => {
                    router.push("/dashboard");
                }, 1000);
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Skip feedback step
    const skipFeedback = async () => {
        setIsSubmitting(true);

        // Still save the data we have so far, just without feedback info
        const finalData = {
            user_type: userType,
            product_link: formData.productLink,
            store_style: formData.storeStyle,
            source: "",
            additional_info: "",
        };

        try {
            const { error } = await supabase
                .from("onboarding")
                .insert([finalData]);

            if (error) {
                console.error("Error inserting data:", error);
                toast.error("There was a problem saving your information.");
            } else {
                setStep(4);

                setTimeout(() => {
                    router.push("/dashboard");
                }, 1000);
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate total steps and progress
    const totalSteps = userType === "ecom" ? 4 : 2;
    const progress = (step / totalSteps) * 100;

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container max-w-lg mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full px-8 md:px-4 lg:px-0">
                <div className="mb-8">
                    <Progress value={progress} className="w-full" />
                </div>

                {step === 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to UGC Farm</CardTitle>
                            <CardDescription>Let us know who you are so we can personalize your experience</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={userTypeForm.handleSubmit(onUserTypeSubmit)}>
                                <div className="space-y-4">
                                    <RadioGroup
                                        onValueChange={(value) => userTypeForm.setValue("userType", value as "ecom" | "agency")}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-slate-50 cursor-pointer">
                                            <RadioGroupItem value="ecom" id="ecom" />
                                            <Label htmlFor="ecom" className="flex-1 cursor-pointer">E-commerce Brand Owner</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-slate-50 cursor-pointer">
                                            <RadioGroupItem value="agency" id="agency" />
                                            <Label htmlFor="agency" className="flex-1 cursor-pointer">Agency</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <Button type="submit" className="w-full mt-6">Continue</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === 1 && userType === "ecom" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Drop your product link</CardTitle>
                            <CardDescription>We&apos;ll use this to understand your brand better</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={productLinkForm.handleSubmit(onProductLinkSubmit)}>
                                <div className="space-y-4">
                                    <Input
                                        placeholder="https://yourbrand.com/product"
                                        {...productLinkForm.register("productLink")}
                                    />
                                    {productLinkForm.formState.errors.productLink && (
                                        <p className="text-sm text-red-500">
                                            {productLinkForm.formState.errors.productLink.message}
                                        </p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full mt-6">Continue</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === 2 && userType === "ecom" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>What describes your store style better?</CardTitle>
                            <CardDescription>This helps us match your brand aesthetics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={storeStyleForm.handleSubmit(onStoreStyleSubmit)}>
                                <div className="grid grid-cols-2 gap-4">
                                    {styleOptions.map((style) => (
                                        <div
                                            key={style.value}
                                            className={`border p-4 rounded-md text-center hover:bg-slate-50 cursor-pointer ${storeStyleForm.watch("storeStyle") === style.value ? "border-primary bg-slate-50" : ""
                                                }`}
                                            onClick={() => storeStyleForm.setValue("storeStyle", style.value as any)}
                                        >
                                            <div className="text-2xl mb-2">{style.emoji}</div>
                                            <div className="font-medium">{style.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <Button type="submit" className="w-full mt-6">Continue</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {(step === 3 || (step === 1 && userType === "agency")) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Almost done!</CardTitle>
                            <CardDescription>This step is optional but helps us improve</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)}>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Where have you heard of us?</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {sourceOptions.map((source) => (
                                                <div
                                                    key={source.value}
                                                    className={`items-center justify-center flex flex-col border p-2 rounded-md text-center hover:bg-slate-50 cursor-pointer ${feedbackForm.watch("source") === source.value ? "border-primary bg-slate-50" : ""
                                                        }`}
                                                    onClick={() => feedbackForm.setValue("source", source.value as any)}
                                                >
                                                    <div className="text-lg">
                                                        {typeof source.icon === 'string' ? source.icon : source.icon && React.createElement(source.icon)}
                                                    </div>
                                                    <div className="text-sm">{source.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Any info you want to tell us?</Label>
                                        <Textarea
                                            placeholder="Share your thoughts with us..."
                                            {...feedbackForm.register("additionalInfo")}
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-4 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-1/2"
                                        onClick={skipFeedback}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Processing..." : "Skip"}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-1/2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Saving..." : "Complete"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === 4 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Thank you!</CardTitle>
                            <CardDescription>Your onboarding is complete</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>We&apos;ll personalize your experience based on your preferences.</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => window.location.href = "/dashboard"}>
                                Go to Dashboard
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}
