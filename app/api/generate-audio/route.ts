import { NextResponse } from 'next/server';
import { speak } from 'orate';
import { ElevenLabs } from 'orate/elevenlabs';
import { supabase } from '@/lib/supabase/admin/supabase';
import { v4 as uuidv4 } from 'uuid';
import { uploadToR2 } from '@/lib/upload';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_AWS_SECRET_ACCESS_KEY!,
    },
});

const voices = {
    alice: "alice",
    aria: "aria",
    bill: "bill",
    brian: "brian",
    callum: "callum",
    charlie: "charlie",
    charlotte: "charlotte",
    chris: "chris",
    daniel: "daniel",
    eric: "eric",
    george: "george",
    jessica: "jessica",
    laura: "laura",
    liam: "liam",
    lily: "lily",
    matilda: "matilda",
    river: "river",
    roger: "roger",
    sarah: "sarah",
    will: "will"
} as const;


export async function POST(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1]
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { prompt, input_voice } = await req.json()

        const voice = input_voice.toLowerCase()

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        if (!voice) {
            return NextResponse.json({ error: 'Voice is required' }, { status: 400 })
        }

        if (prompt.length < 10) {
            return NextResponse.json({ error: 'Prompt is too short' }, { status: 400 })
        }

        if (prompt.length > 1000) {
            return NextResponse.json({ error: 'Prompt is too long' }, { status: 400 })
        }

        if (!voices[voice as keyof typeof voices]) {
            return NextResponse.json({ error: 'Invalid voice' }, { status: 400 })
        }

        // Generate the speech audio using the ElevenLabs TTS model.
        const speech = await speak({
            model: new ElevenLabs().tts('eleven_multilingual_v2', voice),
            prompt: prompt
        });

        const filename = `${uuidv4()}.mp3`;

        await uploadToR2(speech, `${user.id}/${filename}`, "user-audios", "audio/mpeg")

        try {
            const url = await getSignedUrl(
                S3,
                new GetObjectCommand({
                    Bucket: "user-audios",
                    Key: `${user.id}/${filename}`,
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
    } catch (error) {
        console.error('Error generating speech:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
