"use client"

import { FaRegEye, FaCode, FaDownload } from "react-icons/fa6"
import type { StaticImageData } from "next/image"
import { useTranslations } from "next-intl"
import { Contact } from "../sections/Contact"
import { ShowcaseGrid, type ShowcaseItem } from "../components/ShowcaseGrid"

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
    image: StaticImageData
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

    const items: ShowcaseItem[] = projectsData.map((project) => ({
        id: project.id,
        image: project.image,
        name: t(`items.${project.id}_name`),
        description: t(`items.${project.id}_desc`),
        tags: project.tags,
        actions: [
            project.link_2 && { href: project.link_2, label: t("btnDemo"), icon: <FaRegEye /> },
            project.link_download && { href: project.link_download, label: t("btnDownload"), icon: <FaDownload /> },
            project.link_1 && { href: project.link_1, label: t("btnCode"), icon: <FaCode /> },
        ].filter(Boolean) as ShowcaseItem["actions"],
    }))

    return (
        <>
            <ShowcaseGrid
                title={t("title")}
                items={items}
                filterAllLabel={t("filterAll")}
                filterLabel={t("filterLabel")}
                opensNewTabLabel={t("opensNewTab")}
            />
            <Contact />
        </>
    )
}
