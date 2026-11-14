"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image, { type StaticImageData } from "next/image"
import { LuLock } from "react-icons/lu"
import styles from "@/ui/pages/styles/workes_page.module.css"

export type ShowcaseAction = {
    href: string
    label: string
    icon: React.ReactNode
}

export type ShowcaseItem = {
    id: string
    image: StaticImageData
    name: string
    description: string
    tags: string[]
    actions: ShowcaseAction[]
}

type ShowcaseGridProps = {
    title: string
    items: ShowcaseItem[]
    filterAllLabel: string
    filterLabel: string
    opensNewTabLabel: string
    /** Mostrado quando o item não tem nenhum link público */
    privateLabel?: string
}

const itemVariants = {
    hidden: { scale: 0.96, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.96, opacity: 0 }
}

export const ShowcaseGrid = ({ title, items, filterAllLabel, filterLabel, opensNewTabLabel, privateLabel }: ShowcaseGridProps) => {
    const [filter, setFilter] = useState("All")

    const allTags = ["All", ...Array.from(new Set(items.flatMap(p => p.tags)))]
    const filteredItems = filter === "All" ? items : items.filter(p => p.tags.includes(filter))

    return (
        <div className={styles.workes_page}>
            <motion.h1
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {title}
            </motion.h1>

            <div className={styles.filter_container} role="group" aria-label={filterLabel}>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        className={`${styles.filter_btn} ${filter === tag ? styles.active : ""}`}
                        onClick={() => setFilter(tag)}
                        aria-pressed={filter === tag}
                    >
                        {tag === "All" ? filterAllLabel : tag}
                    </button>
                ))}
            </div>

            <ul className={styles.projects_grid}>
                <AnimatePresence mode="popLayout" initial={false}>
                    {filteredItems.map((item, index) => (
                        <motion.li
                            className={styles.project_card}
                            key={item.id}
                            variants={itemVariants}
                            layout
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <div className={styles.image_wrapper}>
                                <Image
                                    src={item.image}
                                    alt=""
                                    sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 360px"
                                    placeholder="blur"
                                    priority={index < 3}
                                    className={styles.project_img}
                                />
                            </div>
                            <div className={styles.info_container}>
                                <h2 className={styles.title}>{item.name}</h2>
                                <p className={styles.description}>{item.description}</p>
                                <ul className={styles.tags_row} aria-label="Tags">
                                    {item.tags.map(tag => (
                                        <li className={`${styles.tag} ${styles[tag] ?? ""}`} key={tag}>{tag}</li>
                                    ))}
                                </ul>
                                <div className={styles.btn_container}>
                                    {item.actions.map(action => (
                                        <a
                                            key={action.href}
                                            href={action.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.action_btn}
                                        >
                                            <span aria-hidden className={styles.action_icon}>{action.icon}</span>
                                            {action.label}
                                            <span className="sr-only"> — {item.name} {opensNewTabLabel}</span>
                                        </a>
                                    ))}
                                    {item.actions.length === 0 && privateLabel && (
                                        <span className={styles.private_badge}>
                                            <LuLock aria-hidden /> {privateLabel}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    )
}
