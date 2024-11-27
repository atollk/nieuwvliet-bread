import { join } from 'path';
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'media',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		skeleton({
			themes: { preset: ['skeleton'] }
		}),
		plugin(({ addVariant }) => {
			addVariant('pointer-coarse', '@media (pointer: coarse)');
			addVariant('pointer-fine', '@media (pointer: fine)');
			addVariant('hover-none', '@media (hover: none)');
			addVariant('hover-hover', '@media (hover: hover)');
		})
	]
} satisfies Config;

export default config;
