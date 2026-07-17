import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./tests/setup.ts'],
		globals: true,
		include: ['tests/**/*.{test,spec}.{ts,tsx}'],
		env: {
			NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080',
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			include: [
				'lib/**/*.{ts,tsx}',
				'hooks/**/*.{ts,tsx}',
				'store/**/*.{ts,tsx}',
				'components/auth/**/*.{ts,tsx}',
				'components/common/**/*.{ts,tsx}',
				'components/dashboard/**/*.{ts,tsx}',
			],
			exclude: [
				'lib/firebase.ts',
				'lib/landing-assets.ts',
				'lib/motion.ts',
				'**/*.d.ts',
				'**/node_modules/**',
			],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '.'),
		},
	},
});
