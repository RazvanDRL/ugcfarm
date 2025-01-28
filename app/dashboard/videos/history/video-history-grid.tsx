import { formatDistanceToNow } from 'date-fns'
import { Video } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type VideoHistoryItem = {
    id: string
    prompt: string
    text_style: any
    created_at: string
    video_id: string
    video_url: string
}

interface VideoHistoryGridProps {
    videos: VideoHistoryItem[]
}

export function VideoHistoryGrid({ videos }: VideoHistoryGridProps) {
    if (!videos.length) {
        return (
            <div className="text-center py-10">
                <Video className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">No videos</h3>
                <p className="mt-1 text-sm text-gray-500">
                    You haven&apos;t generated any videos yet.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
                <Card className="hover:bg-accent transition-colors max-w-[400px]" key={video.id}>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-left">
                            <Video className="h-5 w-5" />
                            <p className="line-clamp-2 text-lg font-[600]">{video.prompt}</p>
                        </div>
                        <div className="flex items-center justify-center mt-4">
                            <video
                                src={video.video_url}
                                className="max-h-[500px] rounded-lg"
                                controls
                                playsInline
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
} 