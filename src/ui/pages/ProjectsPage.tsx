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
import MaiColorPicker from "@/resources/assets/projects/mai-color-picker.png"
import MaiPaint from "@/resources/assets/projects/mai-paint.png"
import MaiScreenRuller from "@/resources/assets/projects/mai-screen-ruller.png"
import CineScope from "@/resources/assets/projects/cinescope-mai-app.png"

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
        id: "p11",
        image: CineScope,
        link_1: "https://github.com/felipemaifredo/CineScope-electron-app",
        tags: ["Electron", "React", "Typescript", "Tailwind"]
    },
    {
        id: "p8",
        image: MaiPaint,
        link_1: "https://github.com/felipemaifredo/macos-mai-paint-electron-app",
        tags: ["Electron", "Typescript"]
    }, {
        id: "p9",
        image: MaiScreenRuller,
        link_1: "https://github.com/felipemaifredo/macos-mai-screen-ruller-electron-app",
        tags: ["Electron", "Typescript"]
    }, {
        id: "p10",
        image: MaiColorPicker,
        link_1: "https://github.com/felipemaifredo/macos-mai-color-picker-electron-app",
        tags: ["Electron", "Typescript"]
    },
    {
        id: "p1",
        image: pedraPapelTesouraIMG,
        link_1: "https://github.com/felipemaifredo/rock-paper-scissor-game-app",
        link_2: "https://rock-paper-scissor-game-felipemaifred.netlify.app/",
        tags: ["Next", "Typescript", "CSS"]
    }, {
        id: "p2",
        image: Kanban,
        link_1: "https://github.com/felipemaifredo/kanban-next",
        link_2: "https://kanban-next-felipemaifredo.vercel.app/",
        tags: ["Next", "Typescript", "CSS"]
    }, {
        id: "p3",
        image: Pokedex,
        link_1: "https://github.com/felipemaifredo/pokedex-ap",
        link_2: "https://felipemaifredo.github.io/pokedex-app/",
        tags: ["React", "Typescript", "CSS"]
    }, {
        id: "p4",
        image: PassGene,
        link_1: "https://github.com/felipemaifredo/password_generator",
        link_2: "https://felipemaifredo.github.io/password_generator/",
        tags: ["HTML", "CSS", "Typescript"]
    }, {
        id: "p5",
        image: calculadora,
        link_1: "https://github.com/felipemaifredo/calculadora",
        link_2: "https://felipemaifredo.github.io/calculadora/",
        tags: ["HTML", "CSS", "Typescript"]
    }, {
        id: "p6",
        image: AcoutsNode,
        link_1: "https://github.com/felipemaifredo/accounts_node",
        tags: ["Node", "Typescript"]
    }, {
        id: "p7",
        image: HTTPClientApp,
        link_1: "https://github.com/felipemaifredo/HTTP-Client-electron-app",
        link_download: "https://drive.google.com/drive/folders/1HrldtgBnyXS_lOwDbq2DCqlL2EsfOqBz?usp=sharing",
        tags: ["Electron", "Typescript", "React", "Node"]
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
