import Stripe from 'stripe';
import { z } from 'zod';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia",
    typescript: true
});

export const ProductIds = z.enum([
    process.env.STRIPE_PRODUCT_ID_1!,
    process.env.STRIPE_PRODUCT_ID_2!,
    process.env.STRIPE_PRODUCT_ID_3!,
]);

export const productMap = {
    [process.env.STRIPE_PRODUCT_ID_1!]: {
        credits: 10,
        plan: 'starter'
    },
    [process.env.STRIPE_PRODUCT_ID_2!]: {
        credits: 50,
        plan: 'creator'
    },
    [process.env.STRIPE_PRODUCT_ID_3!]: {
        credits: 190,
        plan: 'business'
    },
} as const;
