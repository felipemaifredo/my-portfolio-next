"use client"

import { useState, useEffect, useRef, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LuSun, LuMoon, LuSettings2 } from "react-icons/lu"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"
import Cookies from "js-cookie"
import styles from "./theme_switcher.module.css"
import { COLORS, COLOR_SWATCHES, COOKIE_OPTIONS, type ColorTypes, type ThemeTypes } from "@/ui/theme"

const colorLabelKey: Record<ColorTypes, string> = {
    "t-green": "green", "t-rose": "rose", "t-blue": "blue", "t-orange": "orange",
    "t-purple": "purple", "t-cyan": "cyan", "t-yellow": "yellow", "t-red": "red",
}

/** Tema efetivo: o escolhido (data-theme) ou, se não houver escolha, o do sistema. */
const readTheme = (): ThemeTypes => {
    const explicit = document.body.getAttribute("data-theme") as ThemeTypes | null
    if (explicit) return explicit
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "t-dark" : "t-light"
}

export const ThemeSwitcher = () => {
    const t = useTranslations("ThemeSwitcher")
    const [theme, setTheme] = useState<ThemeTypes>("t-light")
    const [color, setColor] = useState<ColorTypes>("t-green")
    const [isOpen, setIsOpen] = useState(false)
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const menuId = useId()

    useEffect(() => {
        setTheme(readTheme())
        const currentColor = document.body.getAttribute("data-color") as ColorTypes | null
        if (currentColor) setColor(currentColor)

        // Acompanha o sistema enquanto o visitante não fizer uma escolha explícita
        const media = window.matchMedia("(prefers-color-scheme: dark)")
        const onChange = () => setTheme(readTheme())
        media.addEventListener("change", onChange)
        return () => media.removeEventListener("change", onChange)
    }, [])

    // Fecha ao clicar fora ou apertar Esc
    useEffect(() => {
        if (!isOpen) return

        const onPointerDown = (e: PointerEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false)
                buttonRef.current?.focus()
            }
        }

        document.addEventListener("pointerdown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("pointerdown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [isOpen])

    const toggleTheme = () => {
        const newTheme = theme === "t-light" ? "t-dark" : "t-light"
        setTheme(newTheme)
        document.body.setAttribute("data-theme", newTheme)
        Cookies.set("theme", newTheme, COOKIE_OPTIONS)
    }

    const changeColor = (newColor: ColorTypes) => {
        setColor(newColor)
        document.body.setAttribute("data-color", newColor)
        Cookies.set("color", newColor, COOKIE_OPTIONS)
    }

    const changeLanguage = (newLocale: "pt" | "en") => {
        router.replace(pathname, { locale: newLocale })
    }

    const isDark = theme === "t-dark"

    return (
        <div className={styles.container} ref={containerRef}>

            <motion.button
                ref={buttonRef}
                className={styles.main_button}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? t("close") : t("ariaLabel")}
                aria-expanded={isOpen}
                aria-controls={isOpen ? menuId : undefined}
            >
                <LuSettings2 aria-hidden />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id={menuId}
                        role="dialog"
                        aria-label={t("ariaLabel")}
                        className={styles.menu}
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className={styles.option_group}>
                            <p className={styles.label}>{t("themeLabel")}</p>
                            <button className={styles.toggle_btn} onClick={toggleTheme}>
                                {isDark ? <LuSun aria-hidden /> : <LuMoon aria-hidden />}
                                <span>{isDark ? t("modeLight") : t("modeDark")}</span>
                            </button>
                        </div>

                        <div className={styles.option_group} role="group" aria-label={t("colorLabel")}>
                            <p className={styles.label} aria-hidden>{t("colorLabel")}</p>
                            <div className={styles.color_options}>
                                {COLORS.map((id) => {
                                    const label = t(colorLabelKey[id])
                                    return (
                                        <button
                                            key={id}
                                            className={`${styles.color_btn} ${color === id ? styles.active : ""}`}
                                            style={{ backgroundColor: COLOR_SWATCHES[id][isDark ? "dark" : "light"] }}
                                            onClick={() => changeColor(id)}
                                            aria-label={label}
                                            aria-pressed={color === id}
                                            title={label}
                                        />
                                    )
                                })}
                            </div>
                        </div>

                        <div className={styles.option_group} role="group" aria-label={t("languageLabel")}>
                            <p className={styles.label} aria-hidden>{t("languageLabel")}</p>
                            <div className={styles.lang_options}>
                                <button
                                    className={`${styles.lang_btn} ${locale === "pt" ? styles.active_lang : ""}`}
                                    onClick={() => changeLanguage("pt")}
                                    aria-pressed={locale === "pt"}
                                    lang="pt"
                                >
                                    {t("pt")}
                                </button>
                                <button
                                    className={`${styles.lang_btn} ${locale === "en" ? styles.active_lang : ""}`}
                                    onClick={() => changeLanguage("en")}
                                    aria-pressed={locale === "en"}
                                    lang="en"
                                >
                                    {t("en")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
