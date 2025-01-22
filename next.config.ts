// import type { NextConfig } from "next";
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy({
	customDomain: "https://plausible.longtoshort.tech",
})({
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ugcfarm.b-cdn.net',
				pathname: '/photos/**',
			},
		],
		formats: ['image/webp'],
		minimumCacheTTL: 31536000, // 1 year
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
});
