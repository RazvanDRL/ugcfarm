import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client/supabase';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');

    if (!state) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?error=invalid_state`);
    }

    const { user_id, uuid } = JSON.parse(atob(state));

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

    console.log(tokenData);

    // Get user info
    const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', {
        headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/json'
        }
    });

    const userData = await userResponse.json();

    console.log(userData);

    // if (authError || !user) {
    //     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
    // }

    const { data, error } = await supabase
        .from('tiktok_accounts')
        .upsert({
            user_id: user_id,
            tiktok_id: userData.data.user.open_id,
            tiktok_access_token: tokenData.access_token,
            tiktok_refresh_token: tokenData.refresh_token,
            tiktok_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            tiktok_refresh_expires_at: new Date(Date.now() + tokenData.refresh_expires_in * 1000).toISOString(),
            display_name: userData.data.user.display_name,
            avatar_url: userData.data.user.avatar_url,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(data);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
} 