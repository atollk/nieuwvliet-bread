import adapter from "@sveltejs/adapter-static"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            fallback: "index.html",
        }),
        paths: {
            base: process.argv.includes("dev")
                ? ""
                : process.argv.includes("--tauri") ||
                    process.argv.map((arg) => arg.includes("prerender.js")).includes(true)
                  ? ""
                  : "/nieuwvliet-bread",
        },
        alias: {
            "@": "./src",
        },
    },
}

export default config
