import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get the URL from query parameters
        const url = decodeURIComponent(request.nextUrl.searchParams.get('url') || '');

        if (!url) {
            return NextResponse.json(
                { error: 'Missing URL parameter' },
                { status: 400 }
            );
        }

        // Validate the URL format
        try {
            new URL(url);
        } catch (e) {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Fetch the file from the provided URL
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch file: ${response.statusText}` },
                { status: response.status }
            );
        }

        // Get the file data as an array buffer
        const fileBuffer = await response.arrayBuffer();

        // Extract filename from URL or use Content-Disposition header if available
        let filename = "ugc_farm_downloaded_file";
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }

        // Create response with appropriate headers to trigger download
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
                'Content-Length': response.headers.get('content-length') || '',
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Failed to process download' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get URL from request body
        const body = await request.json();
        const url = decodeURIComponent(body.url);

        if (!url) {
            return NextResponse.json(
                { error: 'Missing URL in request body' },
                { status: 400 }
            );
        }

        // Validate the URL format
        try {
            new URL(url);
        } catch (e) {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Fetch the file from the provided URL
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch file: ${response.statusText}` },
                { status: response.status }
            );
        }

        // Get the file data as an array buffer
        const fileBuffer = await response.arrayBuffer();

        // Extract filename from URL or use Content-Disposition header if available
        let filename = "ugc_farm_downloaded_file";
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }

        // Create response with appropriate headers to trigger download
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
                'Content-Length': response.headers.get('content-length') || '',
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Failed to process download' },
            { status: 500 }
        );
    }
}
