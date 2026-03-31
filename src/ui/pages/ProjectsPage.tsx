"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import styles from "./styles/workes_page.module.css"
import Image from "next/image"
import { FaRegEye, FaCode, FaDownload } from "react-icons/fa6"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Contact } from "../sections/Contact"

// Assets
import Pokedex from "@/resources/assets/projects/pokedex.png"
import PassGene from "@/resources/assets/projects/pass_gene.png"
import AcoutsNode from "@/resources/assets/projects/accounts-node.png"
import Kanban from "@/resources/assets/projects/kanban.png"
import pedraPapelTesouraIMG from "@/resources/assets/projects/Captura de tela 2025-03-03 203458.png"
import calculadora from "@/resources/assets/projects/calculadora.png"
import HTTPClientApp from "@/resources/assets/projects/logo.png"

type ProjectTypes = {
    id: string
    image: any
    link_1?: string
    link_2?: string
    link_download?: string
    tags: string[]
}

const projectsData: ProjectTypes[] = [
    {
        id: "p1",
        image: pedraPapelTesouraIMG,
        link_1: "https://github.com/felipemaifredo/rock-paper-scissor-game-app",
        link_2: "https://rock-paper-scissor-game-felipemaifred.netlify.app/",
        tags: ["Next", "CSS"]
    }, {
        id: "p2",
        image: Kanban,
        link_1: "https://github.com/felipemaifredo/kanban-next",
        link_2: "https://kanban-next-felipemaifredo.vercel.app/",
        tags: ["Next", "CSS"]
    }, {
        id: "p3",
        image: Pokedex,
        link_1: "https://github.com/felipemaifredo/pokedex-ap",
        link_2: "https://felipemaifredo.github.io/pokedex-app/",
        tags: ["React", "CSS"]
    }, {
        id: "p4",
        image: PassGene,
        link_1: "https://github.com/felipemaifredo/password_generator",
        link_2: "https://felipemaifredo.github.io/password_generator/",
        tags: ["HTML", "CSS", "Javascript"]
    }, {
        id: "p5",
        image: calculadora,
        link_1: "https://github.com/felipemaifredo/calculadora",
        link_2: "https://felipemaifredo.github.io/calculadora/",
        tags: ["HTML", "CSS", "Javascript"]
    }, {
        id: "p6",
        image: AcoutsNode,
        link_1: "https://github.com/felipemaifredo/accounts_node",
        tags: ["Node",]
    }, {
        id: "p7",
        image: HTTPClientApp,
        link_1: "https://github.com/felipemaifredo/HTTP-Client-electron-app",
        link_download: "https://drive.google.com/drive/folders/1HrldtgBnyXS_lOwDbq2DCqlL2EsfOqBz?usp=sharing",
        tags: ["Electron", "React", "Node"]
    }
]

export const ProjectsPage = () => {
    const t = useTranslations("ProjectsPage")
    const [filter, setFilter] = useState("All")

    const allTags = ["All", ...Array.from(new Set(projectsData.flatMap(p => p.tags)))]

    const filteredProjects = filter === "All"
        ? projectsData
        : projectsData.filter(p => p.tags.includes(filter))

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 }
    }

    return (
        <>
            <div className={styles.workes_page}>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {t("title")}
                </motion.h2>

                <div className={styles.filter_container}>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            className={`${styles.filter_btn} ${filter === tag ? styles.active : ""}`}
                            onClick={() => setFilter(tag)}
                        >
                            {tag === "All" ? t("filterAll") : tag}
                        </button>
                    ))}
                </div>

                <motion.div
                    className={styles.projects_grid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                className={styles.project_card}
                                key={project.id}
                                variants={itemVariants}
                                layout
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                whileHover={{ y: -10 }}
                            >
                                <div className={styles.image_wrapper}>
                                    <Image
                                        src={project.image}
                                        width={400}
                                        height={250}
                                        alt={t(`items.${project.id}_name`)}
                                        className={styles.project_img}
                                    />
                                </div>
                                <div className={styles.info_container}>
                                    <p className={styles.title}>{t(`items.${project.id}_name`)}</p>
                                    <p className={styles.description}>{t(`items.${project.id}_desc`)}</p>
                                    <div className={styles.tags_row}>
                                        {project.tags.map(tag => (
                                            <span className={`${styles.tag} ${styles[tag]}`} key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                    <div className={styles.btn_container}>
                                        {project.link_2 && (
                                            <Link href={project.link_2 as any} target="_blank" className={styles.action_btn}>
                                                <FaRegEye /> {t("btnDemo")}
                                            </Link>
                                        )}
                                        {project.link_download && (
                                            <Link href={project.link_download as any} target="_blank" className={styles.action_btn}>
                                                <FaDownload /> {t("btnDownload")}
                                            </Link>
                                        )}
                                        {project.link_1 && (
                                            <Link href={project.link_1 as any} target="_blank" className={styles.action_btn}>
                                                <FaCode /> {t("btnCode")}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
            <Contact />
        </>
    )
}
