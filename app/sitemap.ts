import { MetadataRoute } from 'next'
const BASE_URL = "https://ugc.farm"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    return [
        {
            url: `${BASE_URL}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
    ]
}