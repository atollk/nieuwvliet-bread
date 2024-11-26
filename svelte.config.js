import adapter from '@sveltejs/adapter-static';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import {preprocessMeltUI, sequence} from '@melt-ui/pp';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: sequence([
        vitePreprocess(),
        preprocessMeltUI(),
    ]),

    kit: {
        adapter: adapter({
            fallback: '404.html'
        }),
        paths: {
            base: process.argv.includes('dev') ? '' : '/nieuwvliet-bread'
        },
        alias: {
            '@': './src'
        },
    }
};

export default config;
