// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        bsf13orange: '#ff6222',
        bsf13purple: '#d4caff',
        bsf13green: '#c4ffe8',
      },
    },
  },
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  plugins: [],
}

export default config
