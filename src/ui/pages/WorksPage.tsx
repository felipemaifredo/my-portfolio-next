"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import styles from "./styles/workes_page.module.css"
import { FaRegEye } from "react-icons/fa6"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Contact } from "../sections/Contact"

import imgBrusun from "@/resources/assets/works/brusun.png"
import imgLoboADV from "@/resources/assets/works/loboadv.png"
import imgTotalSeg from "@/resources/assets/works/totalseg.png"
import imgVeC from "@/resources/assets/works/vec.png"
import imgJHB from "@/resources/assets/works/jhn.png"
import imgPremold from "@/resources/assets/works/premold.png"
import imgInnc from "@/resources/assets/works/innc.png"
import imgUbiOne from "@/resources/assets/works/ubione.png"
import eboEcommerce from "@/resources/assets/works/ebo-ecomerce.png"
import lancamentos from "@/resources/assets/works/lancamentos.png"
import pontoverde from "@/resources/assets/works/ponto-verde.png"
import imgAdmissao from "@/resources/assets/works/zoboli-admissao-com-estrategia.png"
import imgZoboliEco from "@/resources/assets/works/zoboli-ecossistema.png"
import imgBuzatoEco from "@/resources/assets/works/buzato-ecossistema.png"

type WorksType = {
    id: string
    image: any
    link: string
    tags: string[]
}

const worksData: WorksType[] = [
    {
        id: "w14",
        image: imgBuzatoEco,
        link: "",
        tags: ["Next", "Node", "Express", "Firebase"]
    },
    {
        id: "w13",
        image: imgZoboliEco,
        link: "",
        tags: ["Next", "Bun", "Elysia", "Firebase"]
    },
    {
        id: "w12",
        image: imgAdmissao,
        link: "",
        tags: ["Next", "CSS"]
    }, {
        id: "w1",
        image: eboEcommerce,
        link: "https://next.e-bordados.net/",
        tags: ["Next", "CSS"]
    }, {
        id: "w2",
        image: lancamentos,
        link: "",
        tags: ["Next", "Node", "CSS", "Firebase"]
    }, {
        id: "w3",
        image: imgUbiOne,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    },
    {
        id: "w4",
        image: imgInnc,
        link: "",
        tags: ["React", "CSS", "Firebase"]
    },
    {
        id: "w5",
        image: pontoverde,
        link: "",
        tags: ["HTML", "CSS",]
    },
    {
        id: "w6",
        image: imgPremold,
        link: "",
        tags: ["React", "CSS", "Firebase"]
    },
    {
        id: "w7",
        image: imgJHB,
        link: "",
        tags: ["React", "CSS", "Firebase"]
    },
    {
        id: "w8",
        image: imgVeC,
        link: "",
        tags: ["React", "CSS"]
    },
    {
        id: "w9",
        image: imgTotalSeg,
        link: "",
        tags: ["React", "CSS", "Firebase"]
    },
    {
        id: "w10",
        image: imgLoboADV,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    },
    {
        id: "w11",
        image: imgBrusun,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    },
]

export const WorksPage = () => {
    const t = useTranslations("WorksPage")
    const [filter, setFilter] = useState("All")

    const allTags = ["All", ...Array.from(new Set(worksData.flatMap(w => w.tags)))]

    const filteredWorks = filter === "All"
        ? worksData
        : worksData.filter(w => w.tags.includes(filter))

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
                        {filteredWorks.map((work) => (
                            <motion.div
                                className={styles.project_card}
                                key={work.id}
                                variants={itemVariants}
                                layout
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                whileHover={{ y: -10 }}
                            >
                                <div className={styles.image_wrapper}>
                                    <Image
                                        src={work.image}
                                        width={400}
                                        height={250}
                                        alt={t(`items.${work.id}_name`)}
                                        className={styles.project_img}
                                    />
                                </div>
                                <div className={styles.info_container}>
                                    <p className={styles.title}>{t(`items.${work.id}_name`)}</p>
                                    <p className={styles.description}>{t(`items.${work.id}_desc`)}</p>
                                    <div className={styles.tags_row}>
                                        {work.tags.map(tag => (
                                            <span className={`${styles.tag} ${styles[tag]}`} key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                    <div className={styles.btn_container}>
                                        {work.link && (
                                            <Link href={work.link as any} target="_blank" className={styles.action_btn}>
                                                <FaRegEye /> {t("btnView")}
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
