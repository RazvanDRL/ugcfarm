'use client'

export default function myImageLoader({ src, width, quality }: { src: string, width: number, quality: number }) {
    const isLocal = !src.startsWith('http');
    const query = new URLSearchParams();

    const imageOptimizationApi = 'http://transformation-lk444kowgkgw4k8s8w8sgsgc.159.89.13.196.sslip.io';
    // Your NextJS application URL
    const baseUrl = 'https://ugc.farm';

    const fullSrc = `${baseUrl}${src}`;

    if (width) query.set('width', width.toString());
    if (quality) query.set('quality', quality.toString());

    // if (isLocal && process.env.NODE_ENV === 'development') {
    //     return src;
    // }
    if (isLocal) {
        return `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
    }
    return `${imageOptimizationApi}/image/${src}?${query.toString()}`;
}