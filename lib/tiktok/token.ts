import { supabase } from "../supabase/client/supabase";

export async function refreshTikTokToken(userId: string) {
    const { data: user, error } = await supabase
        .from('tiktok_accounts')
        .select('tiktok_refresh_token, tiktok_refresh_expires_at')
        .eq('user_id', userId)
        .single();

    if (!user || error) throw new Error('User not found');
    if (new Date(user.tiktok_refresh_expires_at) < new Date()) throw new Error('Refresh token expired');

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!,
            client_secret: process.env.TIKTOK_CLIENT_SECRET!,
            grant_type: 'refresh_token',
            refresh_token: user.tiktok_refresh_token
        })
    });

    const tokenData = await response.json();

    await supabase
        .from('users')
        .update({
            tiktok_access_token: tokenData.access_token,
            tiktok_refresh_token: tokenData.refresh_token,
            tiktok_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', userId);

    return tokenData.access_token;
} 