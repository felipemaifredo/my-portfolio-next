"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import styles from "./styles/preloader.module.css"

export const Preloader = () => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2200)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={styles.preloader_container}
                    initial={{ opacity: 1 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    <div className={styles.logo_wrapper}>
                        <motion.div className={styles.text_contain}>
                            <motion.span
                                className={styles.logo_text}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                F
                            </motion.span>
                            <motion.span
                                className={styles.logo_text}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            >
                                M
                            </motion.span>
                        </motion.div>
                        <motion.div
                            className={styles.underline}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
