import styles from "./styles/workes_page.module.css"
import Image from "next/image"
import { FaRegEye, FaCode } from "react-icons/fa6"

import Pokedex from "@/resources/assets/projects/pokedex.png"
import PassGene from "@/resources/assets/projects/pass_gene.png"
import AcoutsNode from "@/resources/assets/projects/accounts-node.png"
import Kanban from "@/resources/assets/projects/kanban.png"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

type ProjectTypes = {
    name: string
    description: string
    image: any
    link_1: string
    link_2?: string
    tags: any[]
}

const projectsData: ProjectTypes[] = [
    {
        name: "Quadro Kanban",
        description: "Quadro Kanban feito com next.",
        image: Kanban,
        link_1: "https://github.com/felipemaifredo/kanban-next",
        link_2: "https://kanban-next-felipemaifredo.vercel.app/",
        tags: [ "Next", "CSS" ]
    },{
        name: "Pokedex",
        description: "Um dos Meus Primeiros Projetos utilizando APIs com Javascript/React.",
        image: Pokedex,
        link_1: "https://github.com/felipemaifredo/pokedex-ap",
        link_2: "https://felipemaifredo.github.io/pokedex-app/",
        tags: [ "React", "CSS" ]
    },{
        name: "Gerador de Senhas",
        description: "Um dos Meus Primeiros Projetos com Javascript, criando gerador de senha.",
        image: PassGene,
        link_1: "https://github.com/felipemaifredo/password_generator",
        link_2: "https://felipemaifredo.github.io/password_generator/",
        tags: [ "HTML", "CSS", "Javascript" ]
    },{
        name: "Simulador de Banco",
        description: "Um dos Meus Primeiros Projetos com Nodejs, Projeto Simples de Simulação de Banco.",
        image: AcoutsNode,
        link_1: "https://github.com/felipemaifredo/accounts_node",
        tags: [ "Node", ]
    },
]

export const ProjectsPage = () => {
    const t = useTranslations("ProjectsPage")

    return (
        <div className={styles.workes_page}>
            <h2>{t("title")}</h2>
            <div>
                {projectsData.map((projectData: ProjectTypes) => (
                    <div key={projectData.name}>
                        <Image
                            src={projectData.image}
                            width={300}
                            height={200}
                            alt="Imagem de projeto"
                        />
                        <div>
                            <p className={styles.title}>{projectData.name}</p>
                            <p>{projectData.description}</p>
                        </div>
                        <div className={styles.tags_container}>
                            {projectData.tags.map((tag: any) => (
                                <p className={styles[tag]} key={tag}>{tag}</p>
                            ))}
                        </div>
                        <div className={styles.btn_container}>
                            <a href={projectData.link_2 as any} target="_blank">
                                <FaRegEye />
                            </a>
                            {projectData.link_2 && (
                                <Link href={projectData.link_1 as any} target="_blank">
                                    <FaCode />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
