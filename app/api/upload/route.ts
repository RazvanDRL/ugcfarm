import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

// Rate limiting for 100 requests per 15 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '15 s'),
    analytics: true,
});

export async function POST(request: NextRequest) {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');

    // Check if the authorization header is present
    if (!authHeader) {
        return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Get the user from the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting
    const { success, limit, reset, remaining } = await ratelimit.limit(user.id);
    if (!success) {
        return NextResponse.json(
            { error: 'Too many requests', limit, reset },
            { status: 429, headers: { 'X-RateLimit-Limit': limit.toString(), 'X-RateLimit-Remaining': remaining.toString(), 'X-RateLimit-Reset': reset.toString() } }
        );
    }

    // Get the filename, file size, and file type from the request body as JSON 
    const { filename, fileSize, fileType } = await request.json();

    // Check if the filename is present
    if (!filename) {
        return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    // Check if the file type is mp4
    if (fileType !== 'video/mp4' && fileType !== 'image/webp') {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Check if the file size is greater than 100MB
    if (fileSize > 100 * 1024 ** 2) {
        return NextResponse.json({ error: 'File size too large' }, { status: 400 });
    }

    const key = `${user.id}/${filename}`;

    console.log('Generating signed URL for', key);

    try {
        const url = await getSignedUrl(
            S3,
            new PutObjectCommand({
                Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
                Key: key,
                ContentType: fileType,
                ContentLength: fileSize,
            }),
            {
                expiresIn: 5 * 60, // 5 minutes
            }
        );
        return NextResponse.json({ url, key });
    } catch (error: any) {
        console.error('Error generating signed URL:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}