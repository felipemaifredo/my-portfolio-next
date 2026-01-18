"use client"

import { useState, useEffect } from "react"
import { usePathname } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import styles from "./styles/nav.module.css"

import { HiOutlineHome } from "react-icons/hi2"
import { TiMessage } from "react-icons/ti"
import { FaRegUser } from "react-icons/fa6"
import { LuLibrary } from "react-icons/lu"
import { GiTechnoHeart } from "react-icons/gi"

import { PageTransition } from "./PageTransition/PageTransition"

type NavLinkTypes = {
    id: string
    link: string
    icon: any
}

const navLinks: NavLinkTypes[] = [
    { id: "hero_section", link: "#hero_section", icon: <HiOutlineHome /> },
    { id: "about_section", link: "#about_section", icon: <FaRegUser /> },
    { id: "skills", link: "#skills", icon: <GiTechnoHeart /> },
    { id: "projects", link: "#projects", icon: <LuLibrary /> },
    { id: "contact", link: "#contact", icon: <TiMessage /> },
]

export const Nav = () => {
    const pathname = usePathname()
    const t = useTranslations("Nav")
    const [activeSection, setActiveSection] = useState<string>("hero_section")
    const isHome = pathname === "/"

    useEffect(() => {
        if (!isHome) return

        const observers = navLinks.map(link => {
            const element = document.querySelector(link.link)
            if (!element) return null

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(link.id)
                    }
                },
                { threshold: 0.5 }
            )

            observer.observe(element)
            return observer
        })

        return () => {
            observers.forEach(obs => obs?.disconnect())
        }
    }, [isHome])

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        e.preventDefault()
        const targetSection = document.querySelector(link)

        if (targetSection) {
            const toSection = targetSection.getBoundingClientRect().top + window.scrollY
            window.scroll({
                top: toSection,
                behavior: "smooth",
            })
        }
    }

    return (
        <nav className={styles.nav}>
            {navLinks.map((navLink) => {
                const isActive = activeSection === navLink.id && isHome

                return (
                    <div key={navLink.id} className={styles.nav_item}>
                        {isHome ? (
                            <a
                                href={navLink.link}
                                onClick={(e) => handleLinkClick(e, navLink.link)}
                                className={`${styles.link} ${isActive ? styles.active : ""}`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={styles.icon_box}
                                >
                                    {navLink.icon}
                                </motion.div>

                                {isActive && (
                                    <motion.div
                                        className={styles.active_indicator}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                )}
                            </a>
                        ) : (
                            <Link
                                href={`/${navLink.link}` as any}
                                onClick={() => PageTransition()}
                                className={styles.link}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    className={styles.icon_box}
                                >
                                    {navLink.icon}
                                </motion.div>
                            </Link>
                        )}

                        <div className={styles.tooltip}>
                            {t(navLink.id)}
                        </div>
                    </div>
                )
            })}
        </nav>
    )
}
