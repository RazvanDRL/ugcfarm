import { NextResponse } from 'next/server';
import creators from '@/creators.json';
import { supabase } from '@/lib/supabase/admin/supabase';
import { decode } from 'base64-arraybuffer'

export async function POST(request: Request) {
    if (!process.env.C_API_KEY) {
        return NextResponse.json({ error: 'C_API_KEY is not set' }, { status: 500 });
    }

    // check auth
    // const authHeader = request.headers.get('Authorization');
    // if (!authHeader) {
    //     return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
    // }

    // const token = authHeader.split(' ')[1];

    // const { data: { user }, error } = await supabase.auth.getUser(token);
    // if (error) {
    //     return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    // }

    const { creatorName, script, mediaUrls } = await request.json();

    if (!creatorName || !script) {
        console.log('Missing required fields')
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (script.length > 800) {
        console.log('Script is too long')
        return NextResponse.json({ error: 'Script is too long' }, { status: 400 });
    }

    if (!mediaUrls || !Array.isArray(mediaUrls)) {
        console.log('Media URLs must be an array')
        return NextResponse.json({ error: 'Media URLs must be an array' }, { status: 400 });
    }

    if (mediaUrls.length < 1 || mediaUrls.length > 10) {
        console.log('Media URLs must contain 1-10 URLs')
        return NextResponse.json({ error: 'Media URLs must contain 1-10 URLs' }, { status: 400 });
    }

    for (const mediaUrl of mediaUrls) {
        if (!(mediaUrl.startsWith('https://') || mediaUrl.startsWith('data:image/png;base64,'))) {
            console.log('Media URL is not valid')
            return NextResponse.json({ error: 'Media URL is not valid' }, { status: 400 });
        }
    }

    const base64Images = await Promise.all(mediaUrls.map(async (mediaUrl) => {
        if (mediaUrl.startsWith('data:image/png;base64,')) {
            const { data: tmp_data, error: tmp_error } = await supabase
                .storage
                .from('tmp')
                .upload(`${Date.now()}.png`, decode(mediaUrl.split('base64,')[1]), {
                    contentType: "image/png",
                })

            if (tmp_error) {
                return NextResponse.json({ error: 'Error uploading image' }, { status: 500 });
            }

            const { data: upload_signed_url, error: upload_signed_url_error } = await supabase
                .storage
                .from('tmp')
                .createSignedUrl(tmp_data.path, 86400)

            if (upload_signed_url_error) {
                return NextResponse.json({ error: 'Error getting signed url' + upload_signed_url_error.message }, { status: 500 });
            }

            return upload_signed_url.signedUrl;
        }
        return mediaUrl;
    }));

    const mediaFiles = base64Images.map((mediaUrl) => {
        // Extract just the filename part without query parameters
        const urlWithoutParams = mediaUrl.split('?')[0];
        const extension = urlWithoutParams.split('.').pop();
        console.log('Extension:', extension);
        return extension;
    });

    if (mediaFiles.some((file) => {
        const ext = file ? file.toLowerCase() : '';
        return ext !== 'jpeg' && ext !== 'jpg' && ext !== 'png' && ext !== 'mov' && ext !== 'mp4';
    })) {
        return NextResponse.json({ error: 'Media file extension is not valid' }, { status: 400 });
    }

    const creator = creators[creatorName as keyof typeof creators];

    if (!creator) {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    const options = {
        method: 'POST',
        headers: { 'x-api-key': process.env.C_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            script,
            creatorName,
            resolution: '4k',
            mediaUrls: base64Images
        })
    };

    const response = await fetch('https://api.captions.ai/api/ads/submit', options);
    const data = await response.json();

    console.log(data)

    return NextResponse.json(data);
}