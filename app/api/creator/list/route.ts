import { NextResponse } from 'next/server';
import creators from '@/creators.json';

export async function GET(request: Request) {
    if (!process.env.C_API_KEY) {
        return NextResponse.json({ error: 'C_API_KEY is not set' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const local = searchParams.get('local') || 'true';

    const options = { method: 'POST', headers: { 'x-api-key': process.env.C_API_KEY } };
    if (local === 'false') {
        console.log('Fetching from API');
        try {
            const response = await fetch('https://api.captions.ai/api/creator/list', options);
            const data = await response.json();

            return NextResponse.json(data.thumbnails);
        } catch (err) {
            console.error(err);
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }
    } else if (local === 'true') {
        console.log('Fetching from local');
        return NextResponse.json(creators);
    }
}