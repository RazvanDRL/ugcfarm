import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { supabase } from '@/lib/supabase/admin/supabase';
import { uploadToR2 } from '@/lib/upload';
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

        const image_uuid = image_url.split('/').pop()?.split('.')[0];

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

        console.log(result.data)

        const id = uuidv4();

        const { data: user_avatars, error: user_avatars_error } = await supabase
            .from("user_avatar_videos")
            .insert({
                id: id,
                user_id: user.id,
                thumbnail: image_uuid,
                data: result.data,
            });

        if (user_avatars_error) {
            console.error(user_avatars_error)
            return NextResponse.json({ error: 'Error generating avatar' }, { status: 500 });
        }

        const blob = await fetch(url).then((r) => r.blob());

        const { key } = await uploadToR2(blob, `${user.id}/${id}.mp4`, 'output-bucket', 'video/mp4');
        return NextResponse.json({ key: key });
    } catch (error) {
        console.error('Error generating avatar:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}