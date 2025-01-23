import { getAllPosts } from '@/lib/api';
import { MetadataRoute } from 'next'
import { freeTools } from '@/constants';

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
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${BASE_URL}/demo`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blogs`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/affiliates`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/free-tools`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        // {
        //     url: `${BASE_URL}/#pricing`,
        //     lastModified: new Date(),
        //     changeFrequency: "weekly",
        //     priority: 0.9,
        // },
        {
            url: `${BASE_URL}/author/arthur-luca`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        ...freeTools.map((tool) => ({
            url: `${BASE_URL}${tool.href}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.7,
        })),
        ...pages,
    ]
}