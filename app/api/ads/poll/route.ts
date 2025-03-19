import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    if (!process.env.C_API_KEY) {
        return NextResponse.json({ error: 'C_API_KEY is not set' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const operationId = searchParams.get('operationId');

    if (!operationId) {
        return NextResponse.json({ error: 'operationId is not set' }, { status: 400 });
    }

    console.log(JSON.stringify({ operationId }));

    const options = {
        method: 'POST',
        headers: {
            'x-api-key': process.env.C_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ operationId })
    };

    const response = await fetch('https://api.captions.ai/api/ads/poll', options);
    const data = await response.json();

    return NextResponse.json(data);
}
