import Link from "next/link";

export function DiscountBanner() {
    return (
        <div className="z-50 flex w-full fixed top-0 bg-primary text-background p-2 text-center items-center justify-center">
            <Link href="/affiliates" className="font-[800] hover:underline">
                🎁 50% OFF Everything! Limited Time Only
            </Link>
        </div>
    )
}