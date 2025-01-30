import styles from "./styles/skills.module.css"
import { Observer } from "../components/Observer/observer"

import { FaHtml5 } from "react-icons/fa"
import { FaCss3Alt } from "react-icons/fa"
import { IoLogoJavascript } from "react-icons/io5"
import { SiTypescript } from "react-icons/si"
import { FaNodeJs } from "react-icons/fa"
import { FaReact } from "react-icons/fa6"
import { SiNextdotjs } from "react-icons/si"
import { SiElectron } from "react-icons/si"
import { FaGitAlt } from "react-icons/fa6"
import { RiTailwindCssFill } from "react-icons/ri"
import { GrMysql } from "react-icons/gr"
import { IoLogoFirebase } from "react-icons/io5"
import { SiMongodb } from "react-icons/si"
import { IoMdStar } from "react-icons/io"

import { useTranslations } from "next-intl"

type SkillTypes = {
    icon: React.ReactNode
    title: string
    starsRate: number
}

type SkillsTypes = SkillTypes[]

const skillsTitle = (): Record<number, string> => {
    const t = useTranslations("HomePage")

    return {
        5: t("skills_1"),
        4: t("skills_2"),
        3: t("skills_3"),
        2: t("skills_4"),
        1: t("skills_5"),
    }
}

const skills: SkillsTypes = [
    {
        icon: <FaHtml5 />,
        title: "HTML5",
        starsRate: 5
    }, {
        icon: <FaCss3Alt />,
        title: "CSS3",
        starsRate: 5
    }, {
        icon: <IoLogoJavascript />,
        title: "JavaScript",
        starsRate: 4
    }, {
        icon: <SiTypescript />,
        title: "TypeScript",
        starsRate: 4
    }, {
        icon: <FaNodeJs />,
        title: "Node",
        starsRate: 4
    }, {
        icon: <FaReact />,
        title: "ReactJS",
        starsRate: 4
    }, {
        icon: <SiNextdotjs />,
        title: "NextJS",
        starsRate: 4
    }, {
        icon: <SiElectron />,
        title: "ElectronJS",
        starsRate: 3
    }, {
        icon: <FaReact />,
        title: "React Native",
        starsRate: 3
    }, {
        icon: <FaGitAlt />,
        title: "Git",
        starsRate: 2
    }, {
        icon: <RiTailwindCssFill />,
        title: "Tailwind",
        starsRate: 5
    }, {
        icon: <GrMysql />,
        title: "MySql",
        starsRate: 3
    }, {
        icon: <IoLogoFirebase />,
        title: "Firebase",
        starsRate: 4
    }, {
        icon: <SiMongodb />,
        title: "MongoDB",
        starsRate: 3
    }
]

export const Skills = () => {
    const titles = skillsTitle()

    const RenderStars = ({ starRate }: { starRate: number }) => {
        return (
            <div>
                {Array.from({ length: starRate }, (_, i) => (
                    <IoMdStar key={i} className="text-yellow-500" />
                ))}
            </div>
        )
    }

    return (
        <section id="skills" className={styles.skills_section}>
            <Observer>
                <h2>Tecnologias</h2>
            </Observer>
            <div className={styles.skills_container}>
                {skills.map((skill: SkillTypes, index: number) => (
                    <Observer>
                        <div key={index}>
                            <div className={styles.details}>
                                <p>{skill.title}</p>
                                {skill.icon}
                            </div>
                            <div className={styles.description}>
                                <p>{titles[skill.starsRate]}</p>
                                <RenderStars starRate={skill.starsRate} />
                            </div>
                        </div>
                    </Observer>
                ))}
            </div>
        </section>
    )
}
