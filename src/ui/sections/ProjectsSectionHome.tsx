"use client"

import { motion } from "framer-motion"
import styles from "./styles/projects_home.module.css"
import { LuCode, LuLibrary } from "react-icons/lu"
import { GoGear } from "react-icons/go"
import { IoArrowForwardCircleOutline } from "react-icons/io5"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PageTransition } from "@/ui/components/PageTransition/PageTransition"

type CardItem = {
    icon: React.ReactNode
    title: string
    descrip: string
    link: string
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
}

export const ProjectsSectionHome = () => {
    const t = useTranslations("ProjectsSectionHome")

    const renderItems: CardItem[] = [
        {
            icon: <LuCode />,
            title: t("projectsTitle"),
            descrip: t("projectsDesc"),
            link: "projects"
        }, {
            icon: <GoGear />,
            title: t("worksTitle"),
            descrip: t("worksDesc"),
            link: "works"
        }, {
            icon: <LuLibrary />,
            title: t("libraryTitle"),
            descrip: t("libraryDesc"),
            link: "library"
        }
    ]

    return (
        <section id="projects" className={styles.porjects_section}>
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                {t("title")}
            </motion.h2>

            <motion.ul
                className={styles.projects_container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {renderItems.map((item) => (
                    <motion.li key={item.link} className={styles.card_wrapper} variants={itemVariants}>
                        {/* O cartão inteiro é o link */}
                        <Link
                            href={`/${item.link}` as any}
                            onClick={() => PageTransition()}
                            className={styles.card_item_project}
                        >
                            <span className={styles.card_icon} aria-hidden>{item.icon}</span>
                            <span className={styles.title}>{item.title}</span>
                            <span className={styles.description}>{item.descrip}</span>
                            <span className={styles.arrow} aria-hidden>
                                <IoArrowForwardCircleOutline />
                            </span>
                        </Link>
                    </motion.li>
                ))}
            </motion.ul>
        </section>
    )
}
