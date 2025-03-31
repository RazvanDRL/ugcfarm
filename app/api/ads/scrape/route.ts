import { NextRequest, NextResponse } from "next/server";
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const requestSchema = z.object({
    product_name: z.string().min(1, "Product name is required"),
    product_description: z.string().min(1, "Product description is required"),
})

const systemPrompt = `You are an expert product content analyzer and copywriter. Your task is to:

1. Analyze the provided scraped content (title, description, headings, and text)
2. Identify the language of the original content
3. Generate a concise product name (5 words maximum)
4. Create a compelling product description (50-100 words)
5. Return both the product name and description in the specified language

Focus on extracting key product features, benefits, and unique selling points. If the content appears to be about a product, emphasize what makes it special. If it's a service, highlight its value proposition.

IMPORTANT: Do not translate. Match the exact language provided in the CONTEXT.`;


export async function POST(request: NextRequest) {
    const { url } = await request.json();

    const response = await fetch(`http://localhost:3001/api/scrape`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({ url }),
    });
    const data = await response.json();

    const r = data;

    const images = [r.screenshot, ...r.enhancedImages];

    const language = "english";
    const title = r.title;
    const description = r.description;
    const headings = r.headings;
    const text = r.text;

    const { object } = await generateObject({
        model: google('gemini-2.5-pro-exp-03-25'),
        system: systemPrompt,
        schema: requestSchema,
        prompt: `CONTEXT: ${JSON.stringify({ title, description, headings, text, language })}`,
    });


    return NextResponse.json({ images, product_name: object.product_name, product_description: object.product_description });
}
