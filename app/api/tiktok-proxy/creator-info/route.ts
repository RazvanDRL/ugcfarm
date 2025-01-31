import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { headers, method } = req;

    try {
        const response = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
            method: 'POST',
            headers: {
                'Authorization': headers.get('Authorization') || '',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 