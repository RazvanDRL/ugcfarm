import { NextResponse } from 'next/server';
import { speak } from 'orate';
import { elevenlabs } from 'orate/elevenlabs';
import { supabase } from '@/lib/supabase/admin/supabase';
import { v4 as uuidv4 } from 'uuid';

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

// This app is called UGC Farm, check it out now!

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
            model: elevenlabs.tts('multilingual_v2', voice),
            prompt: prompt
        });

        // Verify the File object is valid
        if (!(speech instanceof File) || speech.size === 0) {
            console.error('Invalid speech file object');
            return NextResponse.json({
                error: 'Generated speech file is invalid'
            }, { status: 500 });
        }

        const filename = `${uuidv4()}.mp3`;


        const { data: audio, error: audioError } = await supabase
            .storage
            .from('user_audios')
            .upload(`${user.id}/${filename}`, speech, {
                cacheControl: '3600',
                upsert: false
            })


        if (audioError) {
            return NextResponse.json({ error: 'Failed to insert audio into the database' }, { status: 500 })
        }

        return NextResponse.json({ audio: audio }, { status: 200 })

    } catch (error) {
        console.error('Error generating speech:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
