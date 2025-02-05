import { speak } from 'orate';
import { elevenlabs } from 'orate/elevenlabs';

const speech = await speak({
    model: elevenlabs.tts('multilingual_v2', 'aria'),
    prompt: 'Friends, Romans, countrymen, lend me your ears!'
});

console.log(speech);