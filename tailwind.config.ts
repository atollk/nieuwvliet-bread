import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import daisyui, { type Config as DaisyUiConfig } from 'daisyui';

const config = {
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [
		daisyui,
		plugin(({ addVariant }) => {
			addVariant('pointer-coarse', '@media (pointer: coarse)');
			addVariant('pointer-fine', '@media (pointer: fine)');
			addVariant('hover-none', '@media (hover: none)');
			addVariant('hover-hover', '@media (hover: hover)');
		})
	],
	daisyui: {
		logs: false
	} satisfies DaisyUiConfig
} satisfies Config;

export default config;
