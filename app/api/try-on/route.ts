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

        if (credits.credits < 0.1) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
        }

        await supabase
            .from('profiles')
            .update({ credits: credits.credits - 0.1 })
            .eq('id', user.id)

        const { human_image_url, garment_image_base64 } = await req.json()


        if (!human_image_url) {
            return NextResponse.json({ error: 'Human image URL is required' }, { status: 400 })
        }

        if (!garment_image_base64) {
            return NextResponse.json({ error: 'Garment image URL is required' }, { status: 400 })
        }

        const garment_image_base64_2 = garment_image_base64.split(',')[1]

        const result = await fal.subscribe("fal-ai/kling/v1-5/kolors-virtual-try-on", {
            input: {
                human_image_url: decodeURIComponent(human_image_url),
                garment_image_url: garment_image_base64_2
            },
            logs: true,
        });

        if ('detail' in result && result.detail) {
            return NextResponse.json({ error: result.detail }, { status: 500 })
        }

        if (!result.data) {
            return NextResponse.json({ error: 'No data returned from try-on service' }, { status: 500 })
        }

        const url = result.data.image.url

        const id = uuidv4();

        const { data: user_try_ons, error: user_try_ons_error } = await supabase
            .from("user_try_ons")
            .insert({
                id: id,
                user_id: user.id,
                data: result.data,
            });

        const { data: user_avatar, error: user_avatar_error } = await supabase
            .from("user_avatars")
            .insert({
                id: id,
                user_id: user.id,
                data: result.data,
            });

        if (user_try_ons_error) {
            return NextResponse.json({ error: 'Error generating try-on' }, { status: 500 });
        }

        const blob = await fetch(url).then((r) => r.blob());

        await uploadToR2(blob, `${user.id}/${id}.png`, "user-avatars", "image/png")

        try {
            const url = await getSignedUrl(
                S3,
                new GetObjectCommand({
                    Bucket: "user-avatars",
                    Key: `${user.id}/${id}.png`,
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
        console.error('Error generating try-on:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
