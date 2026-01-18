"use client"

import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import { useTranslations } from "next-intl"
import styles from "./styles/hero_styles.module.css"

import { MatrixRain } from "../components/animation_screens/MatrixRain"
import { ScreenNightSky } from "../components/animation_screens/Night Sky/Screen_nightSky"
import { ScreenMouseAnimation } from "../components/animation_screens/mouse animation color/ScreenMouseAnimation"

const screens = [<MatrixRain key="matrix" />, <ScreenNightSky key="sky" />, <ScreenMouseAnimation key="mouse" />]

export const Hero = () => {
    const t = useTranslations("Hero")
    const [screenIndex, setScreenIndex] = useState<number | null>(null)

    useEffect(() => {
        setScreenIndex(Math.floor(Math.random() * screens.length))
    }, [])

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.5
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.6, 0.05, 0.01, 0.9] // Custom Cubic Bézier for a premium feel
            }
        }
    }

    return (
        <section id="hero_section" className={styles.hero_section}>
            <motion.div
                className={styles.data_container}
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
            </motion.div>
            <div className={styles.canvas_animation}>
                {screenIndex !== null && screens[screenIndex]}
            </div>
        </section>
    )
}
