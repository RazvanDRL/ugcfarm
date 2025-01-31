import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function TikTokAuthButton({ user_id }: { user_id: string }) {
    const state = JSON.stringify({
        user_id: user_id,
        uuid: uuidv4()
    });

    const encodedState = btoa(state);

    const scopes = [
        'user.info.basic',
        'video.publish',
        'video.upload',
    ];

    const scopeString = scopes.join(',');

    const authUrl =
        `https://www.tiktok.com/v2/auth/authorize?client_key=${process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY}&scope=${scopeString}&response_type=code&redirect_uri=${`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/tiktok/callback`}&state=${encodedState}`;

    return (
        <Link href={authUrl} className="w-full">
            <Button variant="outline" className="mt-2 text-black font-bold w-full border-none transition-all duration-300">
                <div className="flex items-center justify-center w-full">
                    <Image
                        src="/logos/tiktok.svg"
                        alt="TikTok"
                        width={16}
                        height={16}
                        className="absolute left-9"
                    />
                    <span className="mx-auto">Connect TikTok</span>
                </div>
            </Button>
        </Link>

    )
}