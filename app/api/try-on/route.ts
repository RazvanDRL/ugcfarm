import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { supabase } from '@/lib/supabase/admin/supabase';

export async function POST(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1]
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { human_image_url, garment_image_url } = await req.json()

        if (!human_image_url) {
            return NextResponse.json({ error: 'Human image URL is required' }, { status: 400 })
        }

        if (!garment_image_url) {
            return NextResponse.json({ error: 'Garment image URL is required' }, { status: 400 })
        }

        const result = await fal.subscribe("fal-ai/kling/v1-5/kolors-virtual-try-on", {
            input: {
                human_image_url: human_image_url,
                garment_image_url: garment_image_url
            },
            logs: true,
        });

        const url = result.data.image.url

        return NextResponse.json({ url })
    } catch (error) {
        console.error('Error generating speech:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
