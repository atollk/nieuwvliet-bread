import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [
		plugin(({ addVariant }) => {
			addVariant('pointer-coarse', '@media (pointer: coarse)');
			addVariant('pointer-fine', '@media (pointer: fine)');
			addVariant('hover-none', '@media (hover: none)');
			addVariant('hover-hover', '@media (hover: hover)');
		})
	]
} satisfies Config;

export default config;
