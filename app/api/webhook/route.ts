import { NextRequest, NextResponse } from 'next/server';
import { stripe, ProductIds, productMap } from '@/lib/stripe';
import { supabase } from '@/lib/supabase/admin/supabase';
import Stripe from 'stripe';

// stripe listen --forward-to http://localhost:3000/api/webhook

function isEmpty(value: string | undefined): boolean {
    return value === undefined || value === null || value === '';
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ message: 'No signature found' }, { status: 400 });
        }

        if (typeof signature !== 'string') {
            return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
        }

        let event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (error: any) {
            console.error(`Webhook signature verification failed: ${error.message}`);
            return NextResponse.json({ message: 'Webhook Error' }, { status: 400 });
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session: Stripe.Checkout.Session = event.data.object;
            console.log(session);
            let userId = session.client_reference_id;
            if (!userId) {
                console.log('No client_reference_id found in session');
                userId = "";
            }
            let email = session.customer_details?.email;
            if (!email) {
                console.error('No email found in session');
                return NextResponse.json({ message: 'No email found in session' }, { status: 400 });
            }

            // Get the price ID from the session
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            const productId = lineItems.data[0]?.price?.product as string;
            if (!productId || !(productId in productMap)) {
                console.log('Invalid product', productId);
                return NextResponse.json({ message: 'Invalid product' }, { status: 400 });
            }
            const credits: 10 | 50 | 1500 = productMap[productId].credits;
            const plan: 'starter' | 'creator' | 'business' = productMap[productId].plan;

            // check if user exists
            let user, userError;

            if (isEmpty(userId)) {
                console.log('no user id, checking email');
                const { data: user_data, error: user_error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', email)
                    .maybeSingle();

                if (user_error) {
                    console.error(user_error.message);
                    return NextResponse.json({ message: user_error.message }, { status: 500 });
                }

                user = user_data;
                userError = user_error;
                userId = user_data?.id || "";
            } else {
                const { data: user_data, error: user_error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();

                if (user_error) {
                    console.error(user_error.message);
                    return NextResponse.json({ message: user_error.message }, { status: 500 });
                }

                user = user_data;
                userError = user_error;
            }

            if (!user || !user.id || !user.email) {
                console.log('user not found, creating new auth user and profile');
                // No need for createUser() first, generateLink with 'magiclink' will handle it
                const { data: signInData, error: signInError } = await supabase.auth.admin
                    .inviteUserByEmail(email.toLowerCase(), {
                        redirectTo: `https://ugc.farm/dashboard`
                    });

                if (signInError) {
                    console.error('Error sending magic link:', signInError.message);
                    return NextResponse.json({ message: signInError.message }, { status: 500 });
                }

                // Get the user ID from the response
                userId = signInData.user.id;
            }

            const { error: addCreditsError } = await supabase
                .rpc('add_user_credits', {
                    user_id: userId,
                    amount: Number(credits),
                });

            if (addCreditsError) {
                console.error(addCreditsError.message);
                return NextResponse.json({ message: addCreditsError.message }, { status: 500 });
            }

            const { data: logs, error: logsError } = await supabase
                .from('stripe_logs')
                .insert({
                    data: session
                });

            if (logsError) {
                console.error(logsError.message);
                return NextResponse.json({ message: logsError.message }, { status: 500 });
            }

            const { data: user_data, error: user_error } = await supabase
                .from('profiles')
                .update({
                    plan: plan
                })
                .eq('id', userId);
        }

        return NextResponse.json({ message: 'success' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}