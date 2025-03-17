import { NextResponse } from 'next/server';
import creators from '@/creators.json';

export async function POST(request: Request) {
    if (!process.env.C_API_KEY) {
        return NextResponse.json({ error: 'C_API_KEY is not set' }, { status: 500 });
    }

    const { creatorName, script, videoId } = await request.json();

    console.log(creatorName, script, videoId);

    const creator = creators[creatorName as keyof typeof creators];

    if (!creator) {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
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