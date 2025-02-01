import { YouTubeConnectionStatus } from "@/components/youtube-connection-status";

export default function YouTubePage() {
    return (
        <div className="flex flex-col gap-4 min-h-screen justify-center items-center">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">YouTube Integration</h1>
                <YouTubeConnectionStatus />
            </div>
        </div>
    )
} 