import { NextResponse } from 'next/server';
import { speak } from 'orate';
import { elevenlabs } from 'orate/elevenlabs';

export async function GET(request: Request) {
    try {
        // Generate the speech audio using the ElevenLabs TTS model.
        const speechAudio = await speak({
            model: elevenlabs.tts('multilingual_v2', 'aria'),
            prompt: 'Friends, Romans, countrymen, lend me your ears!'
        });

        // Return the audio as an MP3 file with proper headers.
        return new NextResponse(speechAudio, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename="speech.mp3"'
            }
        });
    } catch (error) {
        console.error('Error generating speech:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
