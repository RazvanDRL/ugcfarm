import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { supabase } from '@/lib/supabase/admin/supabase';

interface ExtendedLatentsyncInput {
    video_url: string;
    audio_url: string;
    loop_mode: "pingpong" | "loop" | "none";
    guidance_scale: number;
}

function decode(url: string) {
    return url.replace('/avatars/', '/b1f096cf-7297-4d47-83f8-ca478330fce1/8d8e77a3-1def-4221-9abb-1e8e5917db58/d478e4cc-54e0-4aa4-962c-de1591a49546/')
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

        // check if user has enough credits
        const { data: credits, error: creditsError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single()

        if (creditsError || !credits) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
        }

        if (credits.credits < 0.5) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
        }

        await supabase
            .from('profiles')
            .update({ credits: credits.credits - 0.5 })
            .eq('id', user.id)

        let { video_url, prompt, voice } = await req.json()

        video_url = decode(video_url);

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

        fal.config({
            credentials: process.env.FAL_KEY
        });

        console.log(data.url, video_url)
        const result = await fal.subscribe("fal-ai/latentsync", {
            input: {
                video_url: video_url,
                audio_url: data.url,
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
