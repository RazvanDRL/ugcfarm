import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Demo Videos',
    description: 'Watch how brands are using UGC Farm to create converting content. See real examples of user-generated content created through our platform.',
    openGraph: {
        title: 'Demo Videos | UGC Farm',
        description: 'Watch how brands are using UGC Farm to create converting content. See real examples of user-generated content created through our platform.',
        type: 'website',
        url: 'https://ugc.farm/demo',
        images: [
            {
                url: '/opengraph-image.png', // Make sure to add this image to your public folder
                width: 1200,
                height: 630,
                alt: 'UGC Farm Demo Videos',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Demo Videos | UGC Farm',
        description: 'Watch how brands are using UGC Farm to create converting content. See real examples of user-generated content created through our platform.',
        images: ['/opengraph-image.png'], // Make sure to add this image to your public folder
    },
}

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
} 