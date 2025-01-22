import { task } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from 'openai';
import { model } from "@/constants";
const openai = new OpenAI();

const HookGeneratorSchema = z.object({
  hooks: z.array(z.object({
    text: z.string(),
    platform: z.enum(['facebook', 'instagram', 'tiktok']),
    tips: z.array(z.string()),
  }))
});

const systemPrompt = `You are an expert e-commerce copywriter specializing in social media hooks. Generate hooks based on:

1. Platform-specific best practices
2. E-commerce conversion principles
3. Direct response copywriting techniques
4. Proven social media patterns
5. Target audience psychology

For each hook:
- Keep it under 280 characters
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

export const hookGenerator = task({
  id: "hook-generator",
  run: async (payload: {
    productDescription: string;
    platform: 'facebook' | 'instagram' | 'tiktok';
    category: string;
    intent: 'sales' | 'engagement' | 'traffic';
  }) => {
    if (!payload.productDescription) {
      throw new Error("Product description is required");
    }

    const userPrompt = `Generate 3 hooks for an e-commerce product with these details:

Product Description: ${payload.productDescription}
Platform: ${payload.platform}
Category: ${payload.category}
Goal: ${payload.intent}

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

    return completion.choices[0].message.parsed;
  },
});