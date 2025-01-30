import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { zodResponseFormat } from "openai/helpers/zod"
import { model } from "@/constants"
import { supabase } from '@/lib/supabase/admin/supabase'

const openai = new OpenAI()

// Define the request schema
const requestSchema = z.object({
    prompt: z.string()
        .min(10, "Product description must be at least 10 characters")
        .max(1000, "Product description must not exceed 1000 characters"),
    platform: z.enum(['facebook', 'instagram', 'tiktok']).default('tiktok'),
    category: z.string().optional(),
    intent: z.enum(['sales', 'engagement', 'traffic']).default('engagement')
})

// Define the response schema matching the hook generator
const responseSchema = z.object({
    hooks: z.array(z.string())
})

const systemPrompt = `You are an expert e-commerce copywriter specializing in social media hooks. Generate hooks based on:

1. Platform-specific best practices
2. E-commerce conversion principles
3. Direct response copywriting techniques
4. Proven social media patterns
5. Target audience psychology
6. Don't use hashtags

For each hook:
- Short and concise hooks
- Keep it under 100 characters
- Make it action-oriented
- Include a clear value proposition
- Create urgency/scarcity when relevant
- Use emotional triggers
- Add pattern interrupts
- Include call-to-actions

Platform-specific guidelines:
- Facebook: Focus on problem-solution, social proof, and testimonials
- Instagram: Use emojis strategically, focus on lifestyle and benefits
- TikTok: Create curiosity gaps, use trending hooks, be more casual

Tips should be practical and actionable for improving the hook's performance.

Base your hooks on proven e-commerce copywriting formulas and high-converting patterns.`

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

        const body = await req.json()
        const { prompt, platform, category, intent } = requestSchema.parse(body)

        const userPrompt = `Generate 30 hooks for an e-commerce product with these details:

Product Description: ${prompt}
Platform: ${platform}
${category ? `Category: ${category}` : ''}
Goal: ${intent}`

        const completion = await openai.beta.chat.completions.parse({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: zodResponseFormat(responseSchema, "hook_generator"),
            temperature: 0.8,
        })

        // Extract hooks directly from the response (no need to access .text property)
        const hooks = completion.choices[0].message.parsed?.hooks

        console.log(hooks)

        const { data: savedHooks, error: dbError } = await supabase
            .from('hook_library')
            .insert({
                user_id: user.id,
                data: hooks,
                prompt: prompt,
            })
            .select()

        if (dbError) {
            console.error('Error saving hooks:', dbError)
            return NextResponse.json(
                { error: 'Failed to save hooks' },
                { status: 500 }
            )
        }

        return NextResponse.json({ hooks, hookId: savedHooks[0].id })

    } catch (error) {
        console.error('Error generating hooks:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Validation error",
                    details: error.errors
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to generate hooks' },
            { status: 500 }
        )
    }
} 