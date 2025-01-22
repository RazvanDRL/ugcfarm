"use server";
import type { hookGenerator } from "@/trigger/hook-generator";
import { tasks } from "@trigger.dev/sdk/v3";
import { runs } from "@trigger.dev/sdk/v3";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter instance
// const redis = new Redis({
//     url: process.env.UPSTASH_REDIS_REST_URL!,
//     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

// Create a new ratelimiter that allows 5 requests per 24 hours
// const ratelimit = new Ratelimit({
//     redis,
//     limiter: Ratelimit.slidingWindow(5, "24 h"),
// });

//tasks.trigger also works with the edge runtime
//export const runtime = "edge";

export async function POST(request: NextRequest) {
    try {
        // Get IP for rate limiting
        // const ip = request.headers.get('x-forwarded-for') ?? "127.0.0.1";

        // // Check rate limit
        // const { success } = await ratelimit.limit(ip);

        // if (!success) {
        //     return NextResponse.json(
        //         { error: "Too many requests. Please try again later." },
        //         { status: 429 }
        //     );
        // }

        const body = await request.json();
        const { productDescription, platform, category, intent } = body;

        if (!productDescription) {
            return NextResponse.json(
                { error: "Product description is required" },
                { status: 400 }
            );
        }

        const handle = await tasks.trigger<typeof hookGenerator>(
            "hook-generator",
            {
                productDescription,
                platform,
                category,
                intent,
            }
        );

        for await (const run of runs.subscribeToRun<typeof hookGenerator>(handle.id)) {
            if (run.output) {
                return NextResponse.json(run.output);
            }
        }

        return NextResponse.json(
            { error: "Failed to generate hooks" },
            { status: 500 }
        );
    } catch (error) {
        console.error('Hook generation error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
