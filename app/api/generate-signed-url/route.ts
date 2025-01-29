import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { supabase } from '@/lib/supabase/admin/supabase';

export const runtime = "edge";

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_AWS_SECRET_ACCESS_KEY!,
    },
});

// Rate limiting for 50 requests per 10 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(50, '10 s'),
    analytics: true,
});

export async function POST(request: NextRequest) {
    // Get the authorization header
    const auth_header = request.headers.get('Authorization');
    if (!auth_header || !auth_header.startsWith('Bearer ')) {
        console.log("Unauthorized: Missing or invalid Authorization header");
        return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }

    const token = auth_header.split(' ')[1];

    const { data: { user }, error: user_error } = await supabase.auth.getUser(token);
    if (user_error || !user) {
        console.log("Unauthorized: Missing or invalid user");
        return NextResponse.json({ error: 'Unauthorized: Missing or invalid user' }, { status: 401 });
    }

    // Apply rate limiting
    const { success, limit, reset, remaining } = await ratelimit.limit(user.id);
    if (!success) {
        return NextResponse.json(
            { error: 'Too many requests', limit, reset },
            { status: 429, headers: { 'X-RateLimit-Limit': limit.toString(), 'X-RateLimit-Remaining': remaining.toString(), 'X-RateLimit-Reset': reset.toString() } }
        );
    }

    // Get the bucket and key from the request body as JSON 
    const { bucket, key } = await request.json();

    // Check if the bucket and key are present
    if (!bucket || !key) {
        return NextResponse.json({ error: 'Missing bucket or key' }, { status: 400 });
    }

    // Check if the bucket is valid
    if (bucket !== "output-bucket" && bucket !== "upload-bucket") {
        return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
    }

    const fullKey = `${user.id}/${key}`;

    console.log('Generating signed URL for', fullKey);

    try {
        const url = await getSignedUrl(
            S3,
            new GetObjectCommand({
                Bucket: bucket,
                Key: fullKey,
            }),
            {
                expiresIn: 86400, // 1 day
            }
        );
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Error generating signed URL:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}