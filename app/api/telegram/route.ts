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

        const chatIds = telegramChatId.split(',');

        // Format the message
        const formattedMessage = url ?
            `New product URL submission: ${url}\n\n${message || ''}` :
            message;

        // Send message to all Telegram chat IDs
        const telegramResponses = await Promise.all(
            chatIds.map(chatId =>
                fetch(
                    `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: formattedMessage,
                            parse_mode: 'HTML',
                        }),
                    }
                ).then(res => res.json())
            )
        );

        // Check if any of the messages failed to send
        const failedResponses = telegramResponses.filter(response => !response.ok);

        if (failedResponses.length > 0) {
            return NextResponse.json(
                { error: 'Failed to send message to some Telegram chats', details: failedResponses },
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