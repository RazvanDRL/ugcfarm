import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { supabase } from '@/lib/supabase/admin/supabase';
import { v4 as uuidv4 } from 'uuid';
import { uploadToR2 } from '@/lib/upload';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_AWS_SECRET_ACCESS_KEY!,
    },
});

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

        const { style, gender, age, body, skin_tone, pose, hair, background } = await req.json();

        // Create different prompt texts based on the "style" selection.
        const prompt =
            style === "selfie"
                ? `Close-up portrait of a ${age} ${gender} with ${skin_tone} skin tone vlogging with a ${hair} hair style and ${body} body type, shot from a high-quality front-facing camera perspective. ${gender === "female" ? "She" : "He"} is ${pose} on a ${background} with natural sunset lighting that illuminates ${gender === "female" ? "her" : "his"} face for a warm, flattering glow. Professional vlog-style framing with ${gender === "female" ? "her" : "his"} face positioned slightly off-center, showcasing shoulders and upper body. Shot on iPhone 15 Pro, portrait mode, f/2.8 aperture. Cinematic color grading with rich, urban tones.`
                : `Full-body shot of a ${age} ${gender} with ${skin_tone} skin tone and a ${hair} hair style and ${body} body type, ${pose} and captured from a high-quality camera perspective. ${gender === "female" ? "She" : "He"} is on a ${background} with natural sunset lighting that beautifully highlights the entire figure from head to toe, ensuring a complete view of the body. Shot on iPhone 15 Pro, portrait mode, f/2.8 aperture. Cinematic color grading with rich, urban tones.`;

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

        await uploadToR2(blob, `${user.id}/${id}.jpg`, "user-avatars", "image/jpeg")

        try {
            const url = await getSignedUrl(
                S3,
                new GetObjectCommand({
                    Bucket: "user-avatars",
                    Key: `${user.id}/${id}.jpg`,
                }),
                {
                    expiresIn: 86400, // 1 day
                }
            );
            return NextResponse.json({ url });
        } catch (error: any) {
            console.error('Error generating signed URL:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    } catch (error) {
        console.error('Error generating avatar:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
