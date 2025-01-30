"use client"
import styles from "./styles/nav.module.css"
import { ReactNode } from "react"
import { HiOutlineHome } from "react-icons/hi2"
import { TiMessage } from "react-icons/ti"
import { FaRegUser } from "react-icons/fa6"
import { LuLibrary } from "react-icons/lu"
import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { usePathname } from "@/i18n/routing"
import { PageTransition } from "./PageTransition/PageTransition"
import { GiTechnoHeart } from "react-icons/gi"

type NavLinkTypes = {
    link: string
    icon: ReactNode
}

type RenderLinkTypes = {
    navLink: NavLinkTypes
}

const navLinks: NavLinkTypes[] = [
    {
        link: "#hero_section",
        icon: <HiOutlineHome />
    }, {
        link: "#about_section",
        icon: <FaRegUser />
    }, {
        link: "#skills",
        icon: <GiTechnoHeart />
    }, {
        link: "#projects",
        icon: <LuLibrary />
    }, {
        link: "#contact",
        icon: <TiMessage />
    },
]

export const Nav = () => {
    const pathname = usePathname()
    const [ isHome, setIsHome ] = useState<boolean>(true)

    useEffect(() => {
        if (pathname != "/") {
            setIsHome(false)
        } else {
            setIsHome(true)
        }
    }, [pathname])

    function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault()
        const element = e.currentTarget.getAttribute("href")
        if (element) {
            const targetSection = document.querySelector(element)
    
            if (targetSection) {
                const toSection = targetSection.getBoundingClientRect().top + window.scrollY
    
                window.scroll({
                    top: toSection,
                    behavior: "smooth",
                })
            }
        }
    }

    const RenderLink = ({navLink}: RenderLinkTypes) => {
        return(<>{
            isHome ? (
                <a key={navLink.link} onClick={handleLinkClick} href={navLink.link}>
                    {navLink.icon}
                </a>
            ) : (
                <Link onClick={() => PageTransition()} key={navLink.link} href="/">
                    {navLink.icon}
                </Link>
            )
        }</>)
    }

    return (
        <nav className={styles.nav}>
            {navLinks.map((navLink: NavLinkTypes) => <RenderLink key={navLink.link} navLink={navLink} /> )}
        </nav>
    )
}
