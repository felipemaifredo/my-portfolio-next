"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import styles from "./styles/about_section.module.css"

export const About = () => {
    const t = useTranslations("HomePage")

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <section id="about_section" className={styles.about_section}>
            <motion.div
                className={styles.content_wrapper}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <motion.h2 variants={itemVariants}> {t("title")} </motion.h2>
                <motion.p variants={itemVariants}> {t("paragraph_1")} </motion.p>
                <motion.p variants={itemVariants}> {t("paragraph_2")} </motion.p>
                <motion.p variants={itemVariants}> {t("paragraph_3")} </motion.p>
                <motion.p variants={itemVariants}> {t("paragraph_4")} </motion.p>
            </motion.div>
        </section>
    )
}
