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

    const { creatorName, script, videoId } = await request.json();

    console.log(creatorName, script, videoId);

    const creator = creators[creatorName as keyof typeof creators];

    if (!creator) {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    if(script.length > 800) {
        return NextResponse.json({ error: 'Script is too long' }, { status: 400 });
    }

    const options = {
        method: 'POST',
        headers: { 'x-api-key': process.env.C_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, creatorName, resolution: '4k' })
    };

    const response = await fetch('https://api.captions.ai/api/creator/submit', options);
    const data = await response.json();

    return NextResponse.json(data);
}