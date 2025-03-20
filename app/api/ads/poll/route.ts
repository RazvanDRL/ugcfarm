import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase/admin/supabase';
import { uploadToR2 } from '@/lib/upload';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_AWS_SECRET_ACCESS_KEY!,
    },
});

type STATE = 'QUEUED' | 'PROCESSING' | 'COMPLETE';

export async function POST(request: Request) {
    if (!process.env.C_API_KEY) {
        return NextResponse.json({ error: 'C_API_KEY is not set' }, { status: 500 });
    }

    // check auth
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const operationId = searchParams.get('operationId');

    if (!operationId) {
        return NextResponse.json({ error: 'operationId is not set' }, { status: 400 });
    }

    // Create a streaming response using Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            const options = {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.C_API_KEY as string,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ operationId })
            };

            // Delay between polling attempts in milliseconds
            const POLL_DELAY = 2000;
            let data;

            let uuid = uuidv4();

            // Start the polling process
            (async () => {
                try {
                    do {
                        const response = await fetch('https://api.captions.ai/api/ads/poll', options);
                        data = await response.json();
                        console.log(data);

                        // Send the current progress update to the client
                        controller.enqueue(
                            encoder.encode(JSON.stringify(data))
                        );

                        if ((data.state as STATE) === 'COMPLETE') {
                            const { data: insert_data, error: insert_error } = await supabase
                                .from('video_history')
                                .insert({
                                    video_id: uuid,
                                    user_id: user.id,
                                    options: JSON.stringify(options),
                                    inputs: JSON.stringify(operationId),
                                });

                            if (insert_error) {
                                console.error(insert_error);
                            }

                            const blob = await fetch(data.url).then((r) => r.blob());

                            await uploadToR2(blob, `${user.id}/${uuid}.mp4`, "output-bucket", "video/mp4")

                            try {
                                const url = await getSignedUrl(
                                    S3,
                                    new GetObjectCommand({
                                        Bucket: "output-bucket",
                                        Key: `${user.id}/${uuid}.mp4`,
                                    }),
                                    {
                                        expiresIn: 86400, // 1 day
                                    }
                                );
                                // Send plain JSON with url
                                controller.enqueue(
                                    encoder.encode(JSON.stringify({ state: 'COMPLETE', url, completed: true }))
                                );
                            } catch (error: any) {
                                console.error('Error generating signed URL:', error);
                                controller.enqueue(
                                    encoder.encode(JSON.stringify({ error: (error as Error).message }))
                                );
                            }

                            // Break out of the loop after completion
                            break;
                        }

                        // Wait before next poll
                        await new Promise(resolve => setTimeout(resolve, POLL_DELAY));
                    } while (true);
                } catch (error) {
                    // Send error to client
                    controller.enqueue(
                        encoder.encode(JSON.stringify({ error: (error as Error).message }))
                    );
                } finally {
                    // Signal that we're done sending updates
                    controller.close();
                }
            })();
        }
    });

    // Return a streaming response using Server-Sent Events (SSE)
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
}
