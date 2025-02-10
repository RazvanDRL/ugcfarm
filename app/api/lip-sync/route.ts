import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { supabase } from '@/lib/supabase/admin/supabase';

interface ExtendedLatentsyncInput {
    video_url: string;
    audio_url: string;
    loop_mode: "pingpong" | "loop" | "none";
    guidance_scale: number;
}

export async function POST(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1]
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { video_url, prompt, voice } = await req.json()

        const SITE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL

        const response = await fetch(`${SITE_URL}/api/generate-audio`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                prompt: prompt,
                input_voice: voice
            })
        })

        const data = await response.json()

        console.log(data)

        const { data: audio, error: audioError } = await supabase
            .storage
            .from('user_audios')
            .createSignedUrl(data.audio.path, 3600)

        fal.config({
            credentials: process.env.FAL_KEY
        });

        console.log(audio!.signedUrl, video_url)
        const result = await fal.subscribe("fal-ai/latentsync", {
            input: {
                video_url: video_url,
                audio_url: audio!.signedUrl,
                loop_mode: "pingpong"
            } as ExtendedLatentsyncInput,
            logs: true,
        });

        const url = result.data.video.url

        return NextResponse.json({ url })
    } catch (error) {
        console.error('Error generating speech:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
