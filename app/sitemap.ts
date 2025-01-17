import { getAllPosts } from '@/lib/api';
import { MetadataRoute } from 'next'

const BASE_URL = "https://ugc.farm"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = getAllPosts();

    const pages = posts.map((post) => {
        return {
            url: `${BASE_URL}/blogs/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: "daily" as const,
            priority: 0.8,
        }
    });

    return [
        {
            url: `${BASE_URL}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/blogs`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/affiliates`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/#pricing`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        ...pages,
    ]
}