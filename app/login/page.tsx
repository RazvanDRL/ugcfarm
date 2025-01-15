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
                router.push(`/dashboard?message=already-logged-in`);
            }
        }
        checkUser();
    }, []);

    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function handleLoginWithEmail(email: string) {
        setIsLoading(prev => ({ ...prev, email: true }));
        if (!isValidEmail(email)) {
            toast.error("Invalid email address");
            setIsLoading(prev => ({ ...prev, email: false }));
            return;
        }

        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: "http://localhost:3000/dashboard",
            },
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Check your email for a login link");
        }
        setIsLoading(prev => ({ ...prev, email: false }));
    }

    async function handleLoginWithProvider(provider: "google" | "twitter") {

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: "http://localhost:3000/dashboard",
            },
        });

        if (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <main className="max-w-5xl mx-auto min-h-screen flex items-center justify-center p-4">
                <div className="flex flex-col items-start justify-center space-y-6 w-full max-w-xs">
                    <Image
                        src="/favicon.svg"
                        alt="UGC Farm Logo"
                        width={36}
                        height={36}
                        priority
                        loading="eager"
                        quality={75}
                    />
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
                                className="mr-2"
                            />
                            Continue with Google
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
                                className="mr-2"
                            />
                            Continue with Twitter
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
                        ) : (
                            "Login"
                        )}
                    </Button>
                </div>
            </main>
        </>
    );
}