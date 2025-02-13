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

        if (credits.credits < 1) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        await supabase
            .from('profiles')
            .update({ credits: credits.credits - 1 })
            .eq('id', user.id)

        const { duration, image_url, action } = await req.json();

        if (!image_url) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
        }

        if (!duration) {
            return NextResponse.json({ error: 'Duration is required' }, { status: 400 });
        }

        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }

        // remove s from duration
        const duration_seconds = duration.replace('s', '');

        if (duration_seconds !== "5" && duration_seconds !== "10") {
            return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
        }

        const prompt = `A video of a person ${action}`

        const result = await fal.subscribe("fal-ai/kling-video/v1.6/pro/image-to-video", {
            input: {
                prompt,
                image_url: image_url,
                duration: duration_seconds,
                aspect_ratio: "9:16",
            },
            logs: true,
        });

        const url = result.data.video.url;

        return NextResponse.json({ url });
        // const id = uuidv4();

        // const { data: user_avatars, error: user_avatars_error } = await supabase
        //     .from("user_avatars")
        //     .insert({
        //         id: id,
        //         user_id: user.id,
        //         data: result.data,
        //     });

        // if (user_avatars_error) {
        //     return NextResponse.json({ error: 'Error generating avatar' }, { status: 500 });
        // }

        // const blob = await fetch(url).then((r) => r.blob());

        // const { data: upload_data, error: upload_error } = await supabase.storage
        //     .from("user_avatars")
        //     .upload(`${user.id}/${id}.jpg`, blob, {
        //         cacheControl: '3600',
        //         upsert: false
        //     });

        // if (upload_error) {
        //     return NextResponse.json({ error: 'Error uploading avatar' }, { status: 500 });
        // }

        // const { data: signed_url, error: signed_url_error } = await supabase
        //     .storage
        //     .from('user_avatars')
        //     .createSignedUrl(`${user.id}/${id}.jpg`, 86400);

        // if (signed_url_error) {
        //     return NextResponse.json({ error: 'Error getting signed url' }, { status: 500 });
        // }

        // return NextResponse.json({ url: signed_url?.signedUrl });
    } catch (error) {
        console.error('Error generating avatar:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}