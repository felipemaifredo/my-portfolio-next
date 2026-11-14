"use client"

import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import { useTranslations } from "next-intl"
import { LuArrowRight, LuChevronDown } from "react-icons/lu"
import { Link } from "@/i18n/routing"
import styles from "./styles/hero_styles.module.css"

import { MatrixRain } from "../components/animation_screens/MatrixRain"
import { ScreenMouseAnimation } from "../components/animation_screens/mouse animation color/ScreenMouseAnimation"
import { PageTransition } from "../components/PageTransition/PageTransition"

const screens = [<MatrixRain key="matrix" />, <ScreenMouseAnimation key="mouse" />]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
    }
}

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] }
    }
}

export const Hero = () => {
    const t = useTranslations("Hero")
    const [screenIndex, setScreenIndex] = useState<number | null>(null)

    useEffect(() => {
        setScreenIndex(Math.floor(Math.random() * screens.length))
    }, [])

    return (
        <section id="hero_section" className={styles.hero_section}>
            <div className={styles.canvas_animation} aria-hidden>
                {screenIndex !== null && screens[screenIndex]}
            </div>

            <div className={styles.data_container}>
                <motion.div
                    className={styles.hero_card}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h1 className={styles.title}>
                        <motion.span className={styles.p_1} variants={itemVariants}>
                            {t("greeting")}
                        </motion.span>
                        <motion.span className={styles.p_2} variants={itemVariants}>
                            {t("iam")}
                        </motion.span>
                        <motion.span className={styles.p_3} variants={itemVariants}>
                            {t("role")}
                        </motion.span>
                    </h1>

                    <motion.div className={styles.cta_row} variants={itemVariants}>
                        <Link
                            href="/works"
                            className={`${styles.cta} ${styles.cta_primary}`}
                            onClick={() => PageTransition()}
                        >
                            {t("ctaWorks")}
                            <LuArrowRight aria-hidden />
                        </Link>
                        <a href="#contact" className={`${styles.cta} ${styles.cta_secondary}`}>
                            {t("ctaContact")}
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            <a href="#about_section" className={styles.scroll_hint} aria-label={t("scrollHint")}>
                <LuChevronDown aria-hidden />
            </a>
        </section>
    )
}
