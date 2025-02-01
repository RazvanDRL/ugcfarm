import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { headers } = req
    const body = await req.json()

    try {
        const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status', {
            method: 'POST',
            headers: {
                'Authorization': headers.get('Authorization') || '',
                'Content-Type': 'application/octet-stream',
                'Content-Length': headers.get('Content-Length') || ''
            },
            body: JSON.stringify({
                snippet: {
                    title: body.title,
                    description: body.description,
                    categoryId: '22' // People & Blogs category
                },
                status: {
                    privacyStatus: body.privacy || 'public',
                    selfDeclaredMadeForKids: false
                }
            })
        })

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 