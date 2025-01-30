import Link from "next/link";
import { Sparkles } from "lucide-react";

export function DiscountBanner() {
    return (
        <div className="z-50 flex w-full fixed top-0 bg-primary text-background p-2 text-center items-center justify-center gap-2">
            <Link href="#pricing" className="font-[800] text-xs md:text-base hover:underline flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>
                    Launch Offer: Save $40 on Creator Plan
                </span>
            </Link>
        </div>
    );
}