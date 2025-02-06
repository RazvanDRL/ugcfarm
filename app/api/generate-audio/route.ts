import { NextResponse } from 'next/server';
import { speak } from 'orate';
import { elevenlabs } from 'orate/elevenlabs';
import { supabase } from '@/lib/supabase/admin/supabase';
import axios from 'axios';
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

        console.log(speech)

        const filename = `${uuidv4()}.mp3`;

        // Use absolute URL for API call
        const audioResponse = await fetch("http://localhost:3000/api/upload", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                filename: filename,
                fileSize: speech.size,
                fileType: speech.type,
            }),
        });

        if (!audioResponse.ok) {
            const errorData = await audioResponse.json();
            return NextResponse.json({ error: errorData.error || 'Failed to upload audio' }, { status: audioResponse.status })
        }

        const { url: audioUrl, key: audioKey } = await audioResponse.json();

        // Upload video to R2
        const uploadResponse = await axios.put(audioUrl, speech, {
            headers: {
                'Content-Type': speech.type,
            },
        });

        if (uploadResponse.status !== 200) {
            return NextResponse.json({ error: 'Failed to upload audio' }, { status: 500 })
        }

        const { data: audio, error: audioError } = await supabase
            .from('user_audios')
            .insert({
                user_id: user.id,
                key: audioKey,
            });

        if (audioError) {
            return NextResponse.json({ error: 'Failed to insert audio into the database' }, { status: 500 })
        }

        return NextResponse.json({ audio: audioUrl }, { status: 200 })

    } catch (error) {
        console.error('Error generating speech:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
