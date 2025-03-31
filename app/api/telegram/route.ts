import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { message, url } = await req.json();

        // Get Telegram bot token and chat ID from environment variables
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_IDS;

        if (!telegramBotToken || !telegramChatId) {
            return NextResponse.json(
                { error: 'Telegram configuration is missing' },
                { status: 500 }
            );
        }

        // Format the message
        const formattedMessage = url ?
            `New product URL submission: ${url}\n\n${message || ''}` :
            message;

        // Send message to Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: formattedMessage,
                    parse_mode: 'HTML',
                }),
            }
        );

        const telegramData = await telegramResponse.json();

        if (!telegramResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to send message to Telegram', details: telegramData },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
} 