"use client"

import { useState, useEffect } from "react"
import { usePathname } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
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
    icon: React.ReactNode
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

        // A seção ativa é a que cruza a faixa central da tela — funciona
        // mesmo para seções mais altas que a viewport.
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id)
                })
            },
            { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
        )

        navLinks.forEach((link) => {
            const element = document.querySelector(link.link)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [isHome])

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        const targetSection = document.querySelector(link)
        if (!targetSection) return

        e.preventDefault()
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        targetSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
        history.replaceState(null, "", link)
    }

    return (
        <nav className={styles.nav} aria-label={t("navLabel")}>
            <ul className={styles.list}>
                {navLinks.map((navLink) => {
                    const isActive = activeSection === navLink.id && isHome
                    const content = (
                        <>
                            <span className={styles.icon_box} aria-hidden>
                                {navLink.icon}
                            </span>
                            <span className={styles.label}>{t(navLink.id)}</span>
                            {isActive && (
                                <motion.span
                                    layoutId="nav-active-indicator"
                                    className={styles.active_indicator}
                                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                    aria-hidden
                                />
                            )}
                        </>
                    )

                    return (
                        <li key={navLink.id} className={styles.nav_item}>
                            {isHome ? (
                                <a
                                    href={navLink.link}
                                    onClick={(e) => handleLinkClick(e, navLink.link)}
                                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                                    aria-current={isActive ? "location" : undefined}
                                >
                                    {content}
                                </a>
                            ) : (
                                <Link
                                    href={`/${navLink.link}` as any}
                                    onClick={() => PageTransition()}
                                    className={styles.link}
                                >
                                    {content}
                                </Link>
                            )}

                            <span className={styles.tooltip} aria-hidden>
                                {t(navLink.id)}
                            </span>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
