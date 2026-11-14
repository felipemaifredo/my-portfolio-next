export const THEMES = ["t-light", "t-dark"] as const
export const COLORS = ["t-green", "t-rose", "t-blue", "t-orange", "t-purple", "t-cyan", "t-yellow", "t-red"] as const

export type ThemeTypes = (typeof THEMES)[number]
export type ColorTypes = (typeof COLORS)[number]

/** Tons de cada cor no tema claro/escuro — espelham --p-light / --p-dark em globals.css */
export const COLOR_SWATCHES: Record<ColorTypes, { light: string; dark: string }> = {
    "t-green": { light: "#3f7a24", dark: "#4ade80" },
    "t-rose": { light: "#9d4f96", dark: "#f472b6" },
    "t-blue": { light: "#0b6bcb", dark: "#60a5fa" },
    "t-orange": { light: "#b45309", dark: "#fb923c" },
    "t-purple": { light: "#7e22ce", dark: "#c084fc" },
    "t-cyan": { light: "#0e7490", dark: "#22d3ee" },
    "t-yellow": { light: "#a16207", dark: "#fde047" },
    "t-red": { light: "#b91c1c", dark: "#f87171" },
}

export const COOKIE_OPTIONS = { expires: 365, sameSite: "lax" as const, path: "/" }
