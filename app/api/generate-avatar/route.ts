import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { supabase } from '@/lib/supabase/admin/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // check if user has enough credits
        const { data: credits, error: creditsError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single()

        if (creditsError || !credits) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        if (credits.credits < 0.2) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        await supabase
            .from('profiles')
            .update({ credits: credits.credits - 0.2 })
            .eq('id', user.id)

        const { style, gender, age, body, hair, background } = await req.json();

        // Create different prompt texts based on the "style" selection.
        const prompt =
            style === "selfie"
                ? `Close-up portrait of a ${age} ${gender} vlogging with a ${hair} hair style and ${body} body type, shot from a high-quality front-facing camera perspective. ${gender === "female" ? "She" : "He"} is on a ${background} with natural sunset lighting that illuminates ${gender === "female" ? "her" : "his"} face for a warm, flattering glow. Professional vlog-style framing with ${gender === "female" ? "her" : "his"} face positioned slightly off-center, showcasing shoulders and upper body. Shot on iPhone 15 Pro, portrait mode, f/2.8 aperture. Cinematic color grading with rich, urban tones.`
                : `Full-body shot of a ${age} ${gender} with a ${hair} hair style and ${body} body type, captured from a high-quality camera perspective. ${gender === "female" ? "She" : "He"} is on a ${background} with natural sunset lighting that beautifully highlights the entire figure from head to toe, ensuring a complete view of the body. Shot on iPhone 15 Pro, portrait mode, f/2.8 aperture. Cinematic color grading with rich, urban tones.`;

        const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
            input: {
                prompt,
                num_images: 1,
                enable_safety_checker: true,
                safety_tolerance: "4",
                output_format: "jpeg",
                aspect_ratio: "9:16",
                raw: true
            },
            logs: true,
        });

        if (result.data.has_nsfw_concepts[0]) {
            return NextResponse.json({ error: 'NSFW content detected' }, { status: 400 });
        }

        const url = result.data.images[0].url;
        const seed = result.data.seed;
        const id = uuidv4();

        const { data: user_avatars, error: user_avatars_error } = await supabase
            .from("user_avatars")
            .insert({
                id: id,
                user_id: user.id,
                data: result.data,
                seed: seed,
            });

        if (user_avatars_error) {
            return NextResponse.json({ error: 'Error generating avatar' }, { status: 500 });
        }

        const blob = await fetch(url).then((r) => r.blob());

        const { data: upload_data, error: upload_error } = await supabase.storage
            .from("user_avatars")
            .upload(`${user.id}/${id}.jpg`, blob, {
                cacheControl: '3600',
                upsert: false
            });

        if (upload_error) {
            return NextResponse.json({ error: 'Error uploading avatar' }, { status: 500 });
        }

        const { data: signed_url, error: signed_url_error } = await supabase
            .storage
            .from('user_avatars')
            .createSignedUrl(`${user.id}/${id}.jpg`, 86400);

        if (signed_url_error) {
            return NextResponse.json({ error: 'Error getting signed url' }, { status: 500 });
        }

        return NextResponse.json({ url: signed_url?.signedUrl });
    } catch (error) {
        console.error('Error generating avatar:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
