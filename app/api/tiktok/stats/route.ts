import { refreshTikTokToken } from "@/lib/tiktok/token";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client/supabase";

export async function GET(request: NextRequest) {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    // Check if token needs refresh
    const { data: tiktokUser } = await supabase
        .from('tiktok_accounts')
        .select('tiktok_access_token, tiktok_expires_at')
        .eq('user_id', user.id)
        .single();

    let accessToken = tiktokUser?.tiktok_access_token;

    if (new Date(tiktokUser?.tiktok_expires_at) < new Date()) {
        accessToken = await refreshTikTokToken(user.id);
    }

    // Now use the valid accessToken for API calls
    const response = await fetch('https://api.tiktok.com/v2/user/info/', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();

    return NextResponse.json(data);
} 