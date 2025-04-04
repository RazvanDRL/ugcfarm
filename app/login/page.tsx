"use client"
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState<{
        email: boolean;
        google: boolean;
        twitter: boolean;
    }>({
        email: false,
        google: false,
        twitter: false,
    });

    useEffect(() => {
        async function checkUser() {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (user && !error) {
                router.push(`/onboarding`);
            }
        }
        checkUser();
    }, [router]);

    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function handleLoginWithEmail(email: string) {
        setIsLoading(prev => ({ ...prev, email: true }));

        // const redirect = decodeURIComponent(new URLSearchParams(window.location.search).get("redirect") || "/dashboard")
        let redirect = "/onboarding"


        if (!isValidEmail(email)) {
            toast.error("Invalid email address");
            setIsLoading(prev => ({ ...prev, email: false }));
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/onboarding`
                },
            });

            if (error) {
                throw error;
            }

            toast.success("Check your email for a login link");
        } catch (error: any) {
            toast.error(error.message || "Failed to send login link. Please try again.");
        } finally {
            setIsLoading(prev => ({ ...prev, email: false }));
        }
    }

    async function handleLoginWithProvider(provider: "google" | "twitter") {
        setIsLoading(prev => ({ ...prev, [provider]: true }));

        // const redirect = decodeURIComponent(new URLSearchParams(window.location.search).get("redirect") || "/dashboard")
        let redirect = "/onboarding"

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${window.location.origin}${redirect}`,
            },
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(prev => ({ ...prev, [provider]: false }));
            return;
        }
    }

    return (
        <>
            <main className="max-w-5xl mx-auto min-h-screen flex items-center justify-center p-4">
                <div className="flex flex-col items-start justify-center space-y-6 w-full max-w-xs">
                    <Link href="/">
                        <Image
                            src="/favicon.svg"
                            alt="UGC Farm Logo"
                            width={36}
                            height={36}
                            priority
                            loading="eager"
                            quality={75}
                        />
                    </Link>
                    <div className="flex flex-col gap-2.5 w-full">
                        {/* Google Login */}
                        <Button
                            variant="outline"
                            onClick={() => handleLoginWithProvider("google")}
                            disabled={isLoading.google}
                            className="w-full"
                        >
                            <Image
                                src="/logos/google.svg"
                                alt="Google"
                                width={16}
                                height={16}
                                className="mr-auto"
                            />
                            {isLoading.google ? <span className="flex w-full justify-center items-center">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </span>
                                :
                                <span className="flex w-full justify-center items-center">
                                    Continue with Google
                                </span>
                            }
                        </Button>

                        {/* Twitter Login */}
                        <Button
                            variant="outline"
                            onClick={() => handleLoginWithProvider("twitter")}
                            disabled={isLoading.twitter}
                            className="w-full"
                        >
                            <Image
                                src="/logos/x.svg"
                                alt="Twitter"
                                width={16}
                                height={16}
                                className="mr-auto"
                            />
                            {isLoading.twitter ? <span className="flex w-full justify-center items-center">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </span>
                                :
                                <span className="flex w-full justify-center items-center">
                                    Continue with Twitter
                                </span>
                            }
                        </Button>
                    </div>

                    <Separator className="w-full my-2" />

                    {/* Email Login */}
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="email" className="text-sm font-[600] text-muted-foreground text-left w-full">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="placeholder:font-[500] font-[600]"
                        />
                    </div>
                    <Button
                        variant="default"
                        onClick={() => handleLoginWithEmail(email)}
                        disabled={isLoading.email}
                        className="w-full font-[600]"
                    >
                        {isLoading.email ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : "Login"}
                    </Button>
                </div>
            </main>
        </>
    );
}