"use client"

import { motion } from "framer-motion"
import { FaHtml5, FaCss3Alt, FaNodeJs, FaReact, FaGitAlt } from "react-icons/fa"
import { FaReact as FaReactNative } from "react-icons/fa6"
import { IoLogoJavascript, IoLogoFirebase } from "react-icons/io5"
import { SiTypescript, SiNextdotjs, SiElectron, SiMongodb, SiBun } from "react-icons/si"
import { RiTailwindCssFill } from "react-icons/ri"
import { GrMysql } from "react-icons/gr"
import { useTranslations } from "next-intl"
import styles from "./styles/skills.module.css"

type SkillTypes = {
    icon: React.ReactNode
    title: string
    category: "frontend" | "backend" | "others"
}

const skills: SkillTypes[] = [
    { icon: <FaHtml5 />, title: "HTML5", category: "frontend" },
    { icon: <FaCss3Alt />, title: "CSS3", category: "frontend" },
    { icon: <IoLogoJavascript />, title: "JavaScript", category: "frontend" },
    { icon: <SiTypescript />, title: "TypeScript", category: "frontend" },
    { icon: <FaReact />, title: "ReactJS", category: "frontend" },
    { icon: <SiNextdotjs />, title: "NextJS", category: "frontend" },
    { icon: <RiTailwindCssFill />, title: "Tailwind", category: "frontend" },
    { icon: <FaReactNative />, title: "React Native", category: "frontend" },
    { icon: <FaNodeJs />, title: "Node", category: "backend" },
    { icon: <SiBun />, title: "Bun", category: "backend" },
    { icon: <GrMysql />, title: "MySql", category: "backend" },
    { icon: <IoLogoFirebase />, title: "Firebase", category: "backend" },
    { icon: <SiMongodb />, title: "MongoDB", category: "backend" },
    { icon: <SiElectron />, title: "ElectronJS", category: "others" },
    { icon: <FaGitAlt />, title: "Git", category: "others" },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
}

const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1 }
}

export const Skills = () => {
    const t = useTranslations("Skills")

    const categories = [
        { id: "frontend" as const, label: t("frontend") },
        { id: "backend" as const, label: t("backend") },
        { id: "others" as const, label: t("others") }
    ]

    return (
        <section id="skills" className={styles.skills_section}>
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                {t("title")}
            </motion.h2>

            <div className={styles.categories_wrapper}>
                {categories.map(cat => (
                    <div key={cat.id} className={styles.category_group}>
                        <h3 className={styles.category_title}>{cat.label}</h3>
                        <motion.ul
                            className={styles.skills_container}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                        >
                            {skills
                                .filter(s => s.category === cat.id)
                                .map((skill) => (
                                    <motion.li
                                        key={skill.title}
                                        className={styles.skill_card}
                                        variants={itemVariants}
                                    >
                                        <span className={styles.icon_wrapper} aria-hidden>
                                            {skill.icon}
                                        </span>
                                        <span className={styles.skill_title}>{skill.title}</span>
                                    </motion.li>
                                ))}
                        </motion.ul>
                    </div>
                ))}
            </div>
        </section>
    )
}
