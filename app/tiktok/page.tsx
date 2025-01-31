import { TikTokConnectionStatus } from "@/components/tiktok-connection-status";

export default function TikTokPage() {
    return (
        <div className="flex flex-col gap-4 min-h-screen justify-center items-center">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">TikTok</h1>
                <TikTokConnectionStatus />
            </div>
        </div>
    )
}