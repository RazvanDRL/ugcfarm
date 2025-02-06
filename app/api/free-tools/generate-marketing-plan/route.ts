"use server";
import { NextResponse } from "next/server"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import { OpenAI } from "openai"
import { model } from "@/constants"
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";


// Define the request schema
const marketingPlanRequestSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessDescription: z.string().min(10, "Business description is too short"),
  industry: z.string().min(1, "Industry is required"),
})

// Define the response schema for the generated plan
const marketingPlanResponseSchema = z.object({
  plan: z.string()
})

const systemPrompt = `
You are an expert marketing strategist. Based on the provided business information, create a comprehensive, actionable, and creative marketing plan.
Include clear strategies, channels, actionable steps, and measurable KPIs. Format your response as plain text with clear sections, without using markdown.
`

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter that allows 5 requests per 24 hours
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "24 h"),
});


export async function POST(request: Request) {
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

    const body = await request.json()
    const { businessName, businessDescription, industry } = marketingPlanRequestSchema.parse(body)

    const userPrompt = `
Generate a marketing plan for the following business:

Business Name: ${businessName}
Business Description: ${businessDescription}
Industry: ${industry}

Provide a detailed step-by-step marketing plan including recommended strategies, channels, actions, and measurable KPIs.
`

    const openai = new OpenAI()

    const completion = await openai.beta.chat.completions.parse({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: zodResponseFormat(marketingPlanResponseSchema, "marketing_plan"),
      temperature: 0.7
    })

    const plan = completion.choices[0].message.parsed?.plan

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Marketing plan generation error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to generate marketing plan" }, { status: 500 })
  }
} 