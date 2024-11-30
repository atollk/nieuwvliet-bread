import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';

const config = {
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],
	theme: {
		extend: {}
	},
	plugins: [
		skeleton({
			themes: [themes.legacy, themes.rose]
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
