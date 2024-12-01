import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import typography from "@tailwindcss/typography"
import daisyui, { type Config as DaisyUiConfig } from "daisyui"

const config = {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {},
    },
    plugins: [
        typography,
        daisyui,
        plugin(({ addVariant }) => {
            addVariant("pointer-coarse", "@media (pointer: coarse)")
            addVariant("pointer-fine", "@media (pointer: fine)")
            addVariant("hover-none", "@media (hover: none)")
            addVariant("hover-hover", "@media (hover: hover)")
        }),
    ],
    daisyui: {
        logs: false,
        themes: ["light", "dark"],
    } satisfies DaisyUiConfig,
    darkMode: "media",
} satisfies Config

export default config
