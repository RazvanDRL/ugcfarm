import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function YouTubeAuthButton({ user_id }: { user_id: string }) {
    const state = JSON.stringify({
        user_id: user_id,
        uuid: uuidv4()
    });

    const encodedState = btoa(state);

    const SCOPES = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.readonly'
    ];

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/youtube/callback&response_type=code&scope=${SCOPES.join(' ')}&state=${encodedState}&access_type=offline&prompt=consent`;

    return (
        <Link href={authUrl} className="w-full relative">
            <Button variant="outline" className="mt-2 text-black font-bold w-full border-none transition-all duration-300">
                <div className="flex items-center justify-center w-full">
                    <img
                        src="/logos/youtube.svg"
                        alt="YouTube"
                        width={16}
                        height={16}
                        className="absolute left-9"
                    />
                    <span className="mx-auto">Connect YouTube</span>
                </div>
            </Button>
        </Link>
    )
} 