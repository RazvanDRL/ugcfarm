import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client/supabase';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');

    if (!state || !code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?error=invalid_auth`);
    }

    try {
        const { user_id } = JSON.parse(atob(state));

        // Verify client configuration
        if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            throw new Error('Google OAuth client not properly configured');
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/youtube/callback`
        );

        // Add timestamp validation (authorization code expires after 10 minutes)
        const codeTimestamp = parseInt(state.split('.')[1], 10);
        if (Date.now() - codeTimestamp > 600000) {
            throw new Error('Authorization code expired');
        }

        // Exchange authorization code for tokens with error handling
        let tokens;
        try {
            const tokenResponse = await oauth2Client.getToken(code);
            tokens = tokenResponse.tokens;
        } catch (error) {
            console.error('Google token exchange failed:', error instanceof Error ? error.message : 'Unknown error');
            throw new Error('Invalid authorization code - it may have been used already');
        }

        // Validate received tokens
        if (!tokens?.access_token || !tokens.refresh_token) {
            throw new Error('Invalid token response from Google');
        }

        // Set credentials on the OAuth2 client
        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expiry_date: tokens.expiry_date
        });

        // Fetch YouTube account information
        const youtube = google.youtube('v3');
        const channelResponse = await youtube.channels.list({
            auth: oauth2Client,
            part: ['snippet'],
            mine: true
        });

        const channelInfo = channelResponse.data.items?.[0]?.snippet;
        if (!channelInfo) {
            throw new Error('Failed to fetch YouTube channel information');
        }

        console.log(channelInfo);

        // Store credentials with account info
        // const { error } = await supabase
        //     .from('youtube_accounts')
        //     .upsert({
        //         user_id,
        //         access_token: tokens.access_token,
        //         refresh_token: tokens.refresh_token,
        //         expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
        //         account_name: channelInfo.title,
        //         account_photo: channelInfo.thumbnails?.default?.url || null,
        //         updated_at: new Date().toISOString()
        //     });

        // if (error) throw error;

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);

    } catch (error) {
        console.error('YouTube auth error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?error=youtube_auth_failed&message=${encodeURIComponent(errorMessage)}`
        );
    }
} 