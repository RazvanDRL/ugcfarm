import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { supabase } from '@/lib/supabase/admin/supabase';

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

        const { style, gender, age, body, hair, background } = await req.json()

        const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
            input: {
                prompt: `Close-up portrait of a ${age} ${gender} vlogging, with a ${hair} hair style and ${body} body type, shot from a high-quality front-facing camera perspective. ${gender === "female" ? "She" : "He"}'s on a ${background}. Natural sunset lighting illuminates her face creating a warm, flattering glow. ${gender === "female" ? "She" : "He"} has an authentic, engaging smile and is looking directly at the camera lens. Professional vlog-style framing with ${gender === "female" ? "her" : "his"} face positioned slightly off-center, shoulders and upper body visible. Shot on iPhone 15 Pro, portrait mode, f/2.8 aperture. Cinematic color grading with rich, urban tones.`,
                num_images: 1,
                enable_safety_checker: true,
                safety_tolerance: "1",
                output_format: "jpeg",
                aspect_ratio: "9:16",
                raw: true
            },
            logs: true,
        });

        if (result.data.has_nsfw_concepts[0]) {
            return NextResponse.json({ error: 'NSFW content detected' }, { status: 400 })
        }

        const url = result.data.images[0].url
        const seed = result.data.seed

        return NextResponse.json({ url, seed })
    } catch (error) {
        console.error('Error generating speech:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
