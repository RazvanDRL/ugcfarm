import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client/supabase';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');

    // Exchange code for access token
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!,
            client_secret: process.env.TIKTOK_CLIENT_SECRET!,
            code: code || '',
            grant_type: 'authorization_code',
            redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/tiktok/callback`
        })
    });

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/', {
        headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
        }
    });

    const userData = await userResponse.json();

    console.log(userData);

    return NextResponse.redirect('/dashboard');
} 