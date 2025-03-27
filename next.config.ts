// import type { NextConfig } from "next";
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy({
	customDomain: "https://plausible.longtoshort.tech",
})({
	images: {
		// loader: 'custom',
		// loaderFile: './lib/loader.ts',
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ugcfarm.b-cdn.net',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn.ugc.farm',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'pbs.twimg.com',
				pathname: '/profile_images/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '/a/**',
			},
			{
				protocol: 'https',
				hostname: 'yvxmlrehhemovqibmvqt.supabase.co',
				pathname: '/storage/v1/object/sign/**',
			},
			{
				protocol: 'https',
				hostname: 'user-avatars.9383d8869beffb0a79674d2963166edf.r2.cloudflarestorage.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'captions-cdn.xyz',
				pathname: '/**',
			},
		],
		formats: ['image/webp'],
		minimumCacheTTL: 31536000, // 1 year
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
});
