export const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": "https://ugc.farm/#website",
            "url": "https://ugc.farm",
            "name": "UGC Farm",
            "description": "AI-Powered UGC Content Creation Platform",
            "publisher": {
                "@id": "https://ugc.farm/#organization"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ugc.farm/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            },
            "image": "/opengraph-image.png"
        },
        {
            "@type": "Organization",
            "@id": "https://ugc.farm/#organization",
            "name": "UGC Farm",
            "url": "https://ugc.farm",
            "logo": {
                "@type": "ImageObject",
                "url": "/logo.svg",
                "width": 190,
                "height": 60
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "support@ugc.farm"
            }
        },
        {
            "@type": "SoftwareApplication",
            "name": "UGC Farm",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "offers": {
                "@type": "Offer",
                "price": "19",
                "priceCurrency": "USD"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "ratingCount": "100"
            }
        }
    ]
} 