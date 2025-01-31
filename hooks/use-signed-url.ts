// utils/signed-url.ts
interface CachedUrl {
    url: string;
    expiresAt: number;
}

export async function getSignedUrl(key: string, bucket: string, token: string): Promise<string | null> {
    if (!token) return null
    if (!bucket) return null
    if (!key) return null

    // Check localStorage first
    const cached = localStorage.getItem(`signed_url_${bucket}_${key}`);
    if (cached) {
        const parsedCache: CachedUrl = JSON.parse(cached);
        if (parsedCache.expiresAt > Date.now()) {
            return parsedCache.url;
        }
        // Clear expired cache
        localStorage.removeItem(`signed_url_${bucket}_${key}`);
    }

    // Fetch new signed URL if no cache or expired
    try {
        const response = await fetch(`/api/generate-signed-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ key, bucket }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch signed URL');
        }

        const data = await response.json();

        // Cache the URL with expiration (1 hour - 5 minutes buffer)
        const cacheData: CachedUrl = {
            url: data.url,
            expiresAt: Date.now() + ((86400 - 5 * 60) * 1000)
        };

        localStorage.setItem(
            `signed_url_${bucket}_${key}`,
            JSON.stringify(cacheData)
        );

        return data.url;
    } catch (error) {
        console.error('Error fetching signed URL:', error);
        return null;
    }
}