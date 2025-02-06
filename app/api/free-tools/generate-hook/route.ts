"use server";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import OpenAI from 'openai';
import { z } from "zod";
import { model } from "@/constants";
import { zodResponseFormat } from "openai/helpers/zod";
// Create a new ratelimiter instance
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter that allows 5 requests per 24 hours
const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "24 h"),
});

const HookGeneratorSchema = z.object({
    hooks: z.array(z.object({
        text: z.string(),
        platform: z.enum(['facebook', 'instagram', 'tiktok']),
        tips: z.array(z.string()),
    }))
});

const systemPrompt = `You are an expert e-commerce copywriter specializing in social media hooks...`; // Your existing system prompt

const openai = new OpenAI();

export async function POST(request: NextRequest) {
    try {
        // Get IP for rate limiting
        const ip = request.headers.get('x-forwarded-for') ?? "127.0.0.1";

        // Check rate limit
        const { success } = await ratelimit.limit(ip);

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { productDescription, platform, category, intent } = body;

        if (!productDescription) {
            return NextResponse.json(
                { error: "Product description is required" },
                { status: 400 }
            );
        }

        if (productDescription.trim().length < 10) {
            return NextResponse.json(
                { error: "Product description is too short" },
                { status: 400 }
            );
        }

        if (productDescription.trim().length > 1000) {
            return NextResponse.json(
                { error: "Product description is too long" },
                { status: 400 }
            );
        }

        const userPrompt = `Generate 3 hooks for an e-commerce product with these details:

Product Description: ${productDescription}
Platform: ${platform}
Category: ${category}
Goal: ${intent}

For each hook, provide 2-3 specific tips for maximizing its performance.`;

        const completion = await openai.beta.chat.completions.parse({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: zodResponseFormat(HookGeneratorSchema, "hook_generator"),
            temperature: 0.8,
        });

        return NextResponse.json(completion.choices[0].message.parsed);

    } catch (error) {
        console.error('Hook generation error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
