import type { Config } from "tailwindcss";
import { colors } from "./src/app/ui/theme/colors";
import { typography } from "./src/app/ui/theme/typography";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        ...typography.fontFamily,
        agbalumo: ['var(--font-agbalumo)'],
      },
      fontSize: typography.fontSize,
      fontWeight: {
        normal: '400',
        medium: '500', 
        semibold: '600',
        bold: '700'
      }
    },
  },
  plugins: [],
} satisfies Config;