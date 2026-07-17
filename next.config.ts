import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'coin-images.coingecko.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'assets.coingecko.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'cryptologos.cc',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '**',
				pathname: '/**',
			},
		],
	},
	turbopack: {},
	webpack: (config, { dev }) => {
		if (dev) {
			config.watchOptions = {
				poll: 1000,
				aggregateTimeout: 300,
				ignored: /node_modules\/(?!@base-ui)/,
			};
		}

		return config;
	},
};

export default nextConfig;
