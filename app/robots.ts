import type { MetadataRoute } from 'next'
const BASE_URL = "https://ugc.farm"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [{
            userAgent: '*',
            allow: ['/'],
            disallow: [
                '/dashboard',
            ],
        },
        {
            userAgent: 'GPTBot',
            disallow: [
                '/',
            ],
        }],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}