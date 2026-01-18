"use client"

import { motion } from "framer-motion"
import styles from "./styles/projects_home.module.css"
import { LuCode, LuLibrary } from "react-icons/lu"
import { GoGear } from "react-icons/go"
import { IoArrowForwardCircleOutline } from "react-icons/io5"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { PageTransition } from "@/ui/components/PageTransition/PageTransition"

type cardItem = {
    icon: any
    title: string
    descrip: string
    link: string
}

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

export const ProjectsSectionHome = () => {
    const t = useTranslations("ProjectsSectionHome")

    const renderItems = [
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

            <motion.div
                className={styles.projects_container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {renderItems.map((item: cardItem) => (
                    <motion.div
                        className={styles.card_item_project}
                        key={item.title}
                        variants={itemVariants}
                        whileHover={{ y: -10, scale: 1.02 }}
                    >
                        {item.icon}
                        <p className={styles.title}>{item.title}</p>
                        <p>{item.descrip}</p>
                        <Link href={`/${item.link}` as any} onClick={() => PageTransition()}>
                            <IoArrowForwardCircleOutline />
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
