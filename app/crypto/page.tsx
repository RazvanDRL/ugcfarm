"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function CryptoPaymentPage() {
    const walletAddress = "9zXrZMHcG7BeH2V9ZMpq3nikt6DsyGcotnPhYHzqFQsm";
    const [price, setPrice] = useState<number>(0);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            toast.success("Wallet address copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy wallet address!");
        }
    };

    const handleCopyPlan = async (amount: string) => {
        try {
            await navigator.clipboard.writeText(amount);
            toast.success(`Amount ${amount} copied to clipboard!`);
        } catch (error) {
            toast.error("Failed to copy amount!");
        }
    };

    useEffect(() => {
        fetch('/api/solprice')
            .then(response => response.json())
            .then(data => setPrice(data.price));
    }, []);

    const pricingPackages = [
        { id: 1, name: "Starter", usdPrice: 19 },
        { id: 2, name: "Creator", usdPrice: 49 },
        { id: 3, name: "Business", usdPrice: 139 },
    ];

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Pay with Solana</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Send your Solana payment to the wallet address below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
                        <span className="font-mono text-sm break-all">{walletAddress}</span>
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Please send the exact amount of SOL to the above address. Once your payment is confirmed on the blockchain, your credits will be updated.
                    </p>
                    {price > 0 ? (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">Pricing Packages</h3>
                            <ul className="space-y-3">
                                {pricingPackages.map(pkg => {
                                    const solCost = pkg.usdPrice / price;
                                    return (
                                        <li key={pkg.id} className="bg-gray-100 p-4 rounded-md">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">{pkg.name}</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-mono">
                                                        {`${solCost.toFixed(6)} SOL `}
                                                        <span className="text-muted-foreground">
                                                            ({pkg.usdPrice} USD)
                                                        </span>
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCopyPlan(solCost.toFixed(6))}
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <p className="mt-6 text-sm text-muted-foreground">
                            Fetching SOL price and pricing packages...
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                    <Button variant="default" asChild>
                        <Link href="/payment-completed">Confirm Payment</Link>
                    </Button>
                    <Link href="/#pricing" className="text-sm text-primary underline">
                        Cancel and return to Pricing
                    </Link>
                </CardFooter>
            </Card>
        </main>
    );
}
