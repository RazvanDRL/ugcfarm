// get sol price from alchemy
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = 'https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=SOL';
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.ALCHEMY_API_KEY}`
    };

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    })
        .then(response => response.json())
        .then((data: { data: Array<{ symbol: string; prices: any[] }> }) => {
            const fetchedPrice = Number(data.data[0]?.prices[0].value);

            // leave a 0.5% buffer for the price change
            return NextResponse.json({ price: (fetchedPrice * 0.995) });
        })
        .catch(error => console.error('Error:', error));

    return response;
}