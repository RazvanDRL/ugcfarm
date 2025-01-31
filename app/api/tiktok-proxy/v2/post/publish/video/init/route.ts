import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { headers } = req;
    const body = await req.json();

    try {
        const response = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
            method: 'POST',
            headers: {
                'Authorization': headers.get('Authorization') || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 