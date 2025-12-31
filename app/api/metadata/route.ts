import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status}`);
        }

        const html = await response.text();
        const match = html.match(/<title>([^<]*)<\/title>/i);
        const title = match ? match[1].trim() : '';

        return NextResponse.json({ title });
    } catch (error: any) {
        console.error('Error fetching metadata:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch metadata' }, { status: 500 });
    }
}
