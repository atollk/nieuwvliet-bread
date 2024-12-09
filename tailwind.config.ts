import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import typography from "@tailwindcss/typography"

const config = {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {},
    },
    plugins: [
        typography,
        plugin(({ addVariant }) => {
            addVariant("pointer-coarse", "@media (pointer: coarse)")
            addVariant("pointer-fine", "@media (pointer: fine)")
            addVariant("hover-none", "@media (hover: none)")
            addVariant("hover-hover", "@media (hover: hover)")
        }),
    ],
    darkMode: "media",
} satisfies Config

export default config
