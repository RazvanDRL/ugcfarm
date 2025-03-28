"use client"

import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Image from 'next/image';
import purchases from '@/purchases.json';
import { Purchase } from '@/genPurchases';

const calculateHoursAgo = (timestamp: number): number => {
    const now = Date.now();
    const diffInHours = Math.floor((now - timestamp) / (1000 * 60 * 60));
    return diffInHours;
};

export function PurchaseNotification() {
    const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [shownPurchases, setShownPurchases] = useState<number[]>([]);

    useEffect(() => {
        let currentIndex = 0;
        let intervalId: NodeJS.Timeout;

        const showNotification = () => {
            // Stop if all purchases have been shown
            if (shownPurchases.length >= purchases.length) {
                clearInterval(intervalId);
                return;
            }

            // Find the next unshown purchase
            while (shownPurchases.includes(currentIndex)) {
                currentIndex = (currentIndex + 1) % purchases.length;
            }

            setCurrentPurchase(purchases[currentIndex]);
            setShownPurchases(prev => [...prev, currentIndex]);
            setIsVisible(true);

            setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % purchases.length;
                }, 300);
            }, 3000);
        };

        const initialTimeout = setTimeout(() => {
            showNotification();
            intervalId = setInterval(showNotification, 2000);
        }, 5000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(intervalId);
        };
    }, [shownPurchases]);

    if (!currentPurchase) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 left-4 z-50 transition-all duration-300 ease-in-out transform",
                isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            )}
        >
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-[300px] border border-gray-200">
                <div className="flex items-start gap-2">
                    <div className="text-sm text-gray-800 flex-1">
                        <span className="font-semibold">{currentPurchase.name}</span> purchased
                        <span className="font-semibold"> {currentPurchase.product}</span>
                        <br />
                        <span className="text-gray-500 flex items-center gap-1.5">
                            {calculateHoursAgo(currentPurchase.timestamp)} hours ago
                            •
                            <span className="flex items-center gap-1 ml-1">
                                {/* Stripe Logo */}
                                <Image
                                    src="/logos/stripe.svg"
                                    alt="Stripe"
                                    width={32}
                                    height={16}
                                    className="inline-block mt-[3px]"
                                />
                                <span className="inline-flex items-center">
                                    verified
                                    <CheckCircle2 className="h-3 w-3 text-green-500 ml-1" />
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}