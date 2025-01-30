// hooks/use-demo-video.ts
import { useState, useCallback } from 'react';
import { parseMedia } from '@remotion/media-parser';
import { getSignedUrl } from '@/hooks/use-signed-url';

interface UseDemoVideoReturn {
    demoUrl: string | null;
    demoDuration: number;
    setDemo: (id: number, videos: string[], token: string) => Promise<void>;
    resetDemo: () => void;
}

export function useDemoVideo(): UseDemoVideoReturn {
    const [demoUrl, setDemoUrl] = useState<string | null>(null);
    const [demoDuration, setDemoDuration] = useState<number>(0);

    const setDemo = useCallback(async (id: number, videos: string[], token: string) => {
        try {
            if (id === 0) {
                setDemoUrl(null);
                setDemoDuration(0);
                return;
            }

            const videoKey = videos[id - 1]?.replace('.mp4', '');
            if (!videoKey) throw new Error('Invalid demo video selected');

            const url = await getSignedUrl(videoKey + '.mp4', 'upload-bucket', token);
            if (!url) throw new Error('Failed to get signed URL');

            const metadata = await parseMedia({
                src: url,
                fields: {
                    slowDurationInSeconds: true,
                }
            });

            setDemoUrl(url);
            setDemoDuration(Math.round(metadata.slowDurationInSeconds * 30));
        } catch (error) {
            console.error('Error setting demo:', error);
            throw error;
        }
    }, []);

    const resetDemo = useCallback(() => {
        setDemoUrl(null);
        setDemoDuration(0);
    }, []);

    return {
        demoUrl,
        demoDuration,
        setDemo,
        resetDemo
    };
}