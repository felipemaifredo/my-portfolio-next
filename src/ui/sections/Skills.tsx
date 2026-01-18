"use client"

import { motion } from "framer-motion"
import { FaHtml5, FaCss3Alt, FaNodeJs, FaReact, FaGitAlt } from "react-icons/fa"
import { FaReact as FaReactNative } from "react-icons/fa6"
import { IoLogoJavascript, IoLogoFirebase } from "react-icons/io5"
import { SiTypescript, SiNextdotjs, SiElectron, SiMongodb } from "react-icons/si"
import { RiTailwindCssFill } from "react-icons/ri"
import { GrMysql } from "react-icons/gr"
import { IoMdStar } from "react-icons/io"
import { useTranslations } from "next-intl"
import styles from "./styles/skills.module.css"

type SkillTypes = {
    icon: React.ReactNode
    title: string
    starsRate: number
    category: "frontend" | "backend" | "others"
}

export const Skills = () => {
    const t = useTranslations("HomePage")
    const t_skills = useTranslations("Skills")

    const skills: SkillTypes[] = [
        { icon: <FaHtml5 />, title: "HTML5", starsRate: 5, category: "frontend" },
        { icon: <FaCss3Alt />, title: "CSS3", starsRate: 5, category: "frontend" },
        { icon: <IoLogoJavascript />, title: "JavaScript", starsRate: 4, category: "frontend" },
        { icon: <SiTypescript />, title: "TypeScript", starsRate: 4, category: "frontend" },
        { icon: <FaReact />, title: "ReactJS", starsRate: 4, category: "frontend" },
        { icon: <SiNextdotjs />, title: "NextJS", starsRate: 4, category: "frontend" },
        { icon: <RiTailwindCssFill />, title: "Tailwind", starsRate: 5, category: "frontend" },
        { icon: <FaReactNative />, title: "React Native", starsRate: 3, category: "frontend" },
        { icon: <FaNodeJs />, title: "Node", starsRate: 4, category: "backend" },
        { icon: <GrMysql />, title: "MySql", starsRate: 3, category: "backend" },
        { icon: <IoLogoFirebase />, title: "Firebase", starsRate: 4, category: "backend" },
        { icon: <SiMongodb />, title: "MongoDB", starsRate: 3, category: "backend" },
        { icon: <SiElectron />, title: "ElectronJS", starsRate: 3, category: "others" },
        { icon: <FaGitAlt />, title: "Git", starsRate: 2, category: "others" },
    ]

    const titles: Record<number, string> = {
        5: t("skills_1"),
        4: t("skills_2"),
        3: t("skills_3"),
        2: t("skills_4"),
        1: t("skills_5"),
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    const categories = [
        { id: "frontend" as const, label: t_skills("frontend") },
        { id: "backend" as const, label: t_skills("backend") },
        { id: "others" as const, label: t_skills("others") }
    ]

    const RenderStars = ({ starRate }: { starRate: number }) => (
        <div className={styles.stars_row}>
            {Array.from({ length: 5 }, (_, i) => (
                <IoMdStar
                    key={i}
                    className={i < starRate ? styles.star_active : styles.star_inactive}
                />
            ))}
        </div>
    )

    return (
        <section id="skills" className={styles.skills_section}>
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                {t_skills("title")}
            </motion.h2>

            <div className={styles.categories_wrapper}>
                {categories.map(cat => (
                    <div key={cat.id} className={styles.category_group}>
                        <h3 className={styles.category_title}>{cat.label}</h3>
                        <motion.div
                            className={styles.skills_container}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            {skills
                                .filter(s => s.category === cat.id)
                                .map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        className={styles.skill_card}
                                        variants={itemVariants}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                    >
                                        <div className={styles.details}>
                                            <div className={styles.icon_wrapper}>
                                                {skill.icon}
                                            </div>
                                            <p className={styles.skill_title}>{skill.title}</p>
                                        </div>
                                        <div className={styles.description}>
                                            <p className={styles.level_text}>{titles[skill.starsRate]}</p>
                                            <RenderStars starRate={skill.starsRate} />
                                        </div>
                                    </motion.div>
                                ))}
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    )
}
