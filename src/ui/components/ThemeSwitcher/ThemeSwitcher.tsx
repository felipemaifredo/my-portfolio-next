"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LuSun, LuMoon, LuPalette } from "react-icons/lu"
import { useTranslations } from "next-intl"
import Cookies from "js-cookie"
import styles from "./theme_switcher.module.css"

export type ThemeTypes = "t-light" | "t-dark"
export type ColorTypes = "t-green" | "t-rose" | "t-blue" | "t-orange" | "t-purple" | "t-cyan" | "t-yellow" | "t-red"

export const ThemeSwitcher = () => {
    const t = useTranslations("ThemeSwitcher")
    const [theme, setTheme] = useState<ThemeTypes>("t-light")
    const [color, setColor] = useState<ColorTypes>("t-green")
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const currentTheme = document.body.getAttribute("data-theme") as ThemeTypes
        const currentColor = document.body.getAttribute("data-color") as ColorTypes

        if (currentTheme) setTheme(currentTheme)
        if (currentColor) setColor(currentColor)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "t-light" ? "t-dark" : "t-light"
        setTheme(newTheme)
        document.body.setAttribute("data-theme", newTheme)
        Cookies.set("theme", newTheme, { expires: 365 })
    }

    const changeColor = (newColor: ColorTypes) => {
        setColor(newColor)
        document.body.setAttribute("data-color", newColor)
    }

    const colorOptions: { id: ColorTypes; label: string; hex: string }[] = [
        { id: "t-green", label: t("green"), hex: "#599636" },
        { id: "t-rose", label: t("rose"), hex: "#b367ac" },
        { id: "t-blue", label: t("blue"), hex: "#1e90ff" },
        { id: "t-orange", label: t("orange"), hex: "#ff8c00" },
        { id: "t-purple", label: t("purple"), hex: "#9333ea" },
        { id: "t-cyan", label: t("cyan"), hex: "#0891b2" },
        { id: "t-yellow", label: t("yellow"), hex: "#eab308" },
        { id: "t-red", label: t("red"), hex: "#dc2626" }
    ]

    return (
        <div className={styles.container}>
            <motion.button
                className={styles.main_button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t("ariaLabel")}
            >
                <LuPalette />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.menu}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    >
                        <div className={styles.option_group}>
                            <p className={styles.label}>{t("themeLabel")}</p>
                            <button className={styles.toggle_btn} onClick={toggleTheme}>
                                {theme === "t-light" ? <LuMoon /> : <LuSun />}
                                <span>{theme === "t-light" ? t("modeDark") : t("modeLight")}</span>
                            </button>
                        </div>

                        <div className={styles.option_group}>
                            <p className={styles.label}>{t("colorLabel")}</p>
                            <div className={styles.color_options}>
                                {colorOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        className={`${styles.color_btn} ${color === opt.id ? styles.active : ""}`}
                                        style={{ backgroundColor: opt.hex }}
                                        onClick={() => changeColor(opt.id)}
                                        title={opt.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
