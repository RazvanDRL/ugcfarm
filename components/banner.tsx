"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

// Add this helper function to format time
const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
};

export function DiscountBanner() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const endDate = 1738173600000;
        console.log(endDate)
        const timer = setInterval(() => {
            const now = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), new Date().getUTCHours(), new Date().getUTCMinutes(), new Date().getUTCSeconds());
            const distance = endDate - now;


            console.log(distance)
            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="z-50 flex w-full fixed top-0 bg-primary text-background p-2 text-center items-center justify-center gap-2">
            <Link href="#pricing" className="font-[800] text-xs md:text-base hover:underline flex items-center gap-2">
                Pre-order now!&nbsp;Launching in
                <span className="font-mono font-[500] bg-background text-primary px-1 rounded-sm">
                    {`${formatTime(timeLeft.days)}d:${formatTime(timeLeft.hours)}h:${formatTime(timeLeft.minutes)}m:${formatTime(timeLeft.seconds)}s`}
                </span>
            </Link>

        </div>
    );
}