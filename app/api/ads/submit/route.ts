import { NextResponse } from 'next/server';
import creators from '@/creators.json';
import { supabase } from '@/lib/supabase/admin/supabase';

export async function POST(request: Request) {
    if (!process.env.C_API_KEY) {
        return NextResponse.json({ error: 'C_API_KEY is not set' }, { status: 500 });
    }

    // check auth
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { creatorName, script, videoId, mediaUrls } = await request.json();

    if (!creatorName || !script || !videoId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (script.length > 800) {
        return NextResponse.json({ error: 'Script is too long' }, { status: 400 });
    }

    if (!mediaUrls || !Array.isArray(mediaUrls)) {
        return NextResponse.json({ error: 'Media URLs must be an array' }, { status: 400 });
    }

    if (mediaUrls.length < 1 || mediaUrls.length > 10) {
        return NextResponse.json({ error: 'Media URLs must contain 1-10 URLs' }, { status: 400 });
    }

    for (const mediaUrl of mediaUrls) {
        if (typeof mediaUrl !== 'string' || !mediaUrl.startsWith('https://')) {
            return NextResponse.json({ error: 'Media URL is not valid' }, { status: 400 });
        }
    }

    const mediaFiles = mediaUrls.map((mediaUrl) => {
        const extension = mediaUrl.split('.').pop();
        return extension;
    });

    if (mediaFiles.some((file) => file.toLowerCase() !== 'jpeg' && file.toLowerCase() !== 'jpg' && file.toLowerCase() !== 'png' && file.toLowerCase() !== 'mov' && file.toLowerCase() !== 'mp4')) {
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
            mediaUrls
        })
    };

    const response = await fetch('https://api.captions.ai/api/ads/submit', options);
    const data = await response.json();

    return NextResponse.json(data);
}