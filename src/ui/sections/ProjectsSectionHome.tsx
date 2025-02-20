"use client"
import styles from "./styles/projects_home.module.css"

import { LuCode } from "react-icons/lu"
import { GoGear } from "react-icons/go"
import { LuLibrary } from "react-icons/lu"
import { IoArrowForwardCircleOutline } from "react-icons/io5"

import { Link } from "@/i18n/routing"
import { Observer } from "../components/Observer/observer"
import { PageTransition } from "@/ui/components/PageTransition/PageTransition"

type cardItem = {
    icon: any
    title: string
    descrip: string
    link: string
}

type RenderItemLinkProjectType = {
    item: cardItem
}

const renderItems = [
    {
        icon: <LuCode />,
        title: "Projetos",
        descrip: "Ferramentas criadas para treinar e me aprimorar.",
        link: "projects"
    }, {
        icon: <GoGear />,
        title: "Trabalhos",
        descrip: "Meus trabalhos reais.",
        link: "works"
    }, {
        icon: <LuLibrary />,
        title: "Biblioteca",
        descrip: "Componentes prontos.",
        link: "library"
    }
]

const RenderItemLinkProject = ({ item }: RenderItemLinkProjectType) => (
    <div className={styles.card_item_project} key={item.title}>
        {item.icon}
        <p className={styles.title}>{item.title}</p>
        <p>{item.descrip}</p>
        <Link href={`/${item.link}` as any} onClick={() => PageTransition()}>
            <IoArrowForwardCircleOutline />
        </Link>
    </div>
)

export const ProjectsSectionHome = () => {
    return (
        <section id="projects" className={styles.porjects_section}>
            <Observer>
                <h2>Meus Projetos e Trabalhos</h2>
            </Observer>
            <Observer>
                <div className={styles.projects_container}>
                    {renderItems.map((item: cardItem) => 
                        <RenderItemLinkProject key={item.title} item={item} /> 
                    )}
                </div>
            </Observer>
        </section>
    )
}
