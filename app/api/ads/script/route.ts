import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const requestSchema = z.object({
    scripts: z.object({
        script_type: z.string(),
        script: z.string().max(800).min(1),
    }).array(),
});

const systemPrompt = `
You are a video hook expert for a company that sells products.
You are given a product name and description.
You need to write a script for an ad that is 800 characters or less.
The ad will be used on a video content.

IMPORTANT: The script type will be provided in the CONTEXT.
IMPORTANT: You need to return an array of scripts - one for each script type.
`;

const script_types = [
    "Product Review",
    "Three Benefits",
    "Problem Solution",
    "Target Audience",
    "Unique Selling Proposition",
    "Call to Action",
    "FOMO",
    "Attention Grabber",
];

export async function POST(request: Request) {
    const { product_name, product_description } = await request.json();

    const { object } = await generateObject({
        model: google('gemini-2.0-pro-exp-02-05'),
        system: systemPrompt.trim(),
        schema: requestSchema,
        prompt: `CONTEXT: ${JSON.stringify({ product_name, product_description, script_types })}`,
    });

    return NextResponse.json({
        scripts: object.scripts,
    });
}
