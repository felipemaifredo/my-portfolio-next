"use client"

import { FaRegEye } from "react-icons/fa6"
import type { StaticImageData } from "next/image"
import { useTranslations } from "next-intl"
import { Contact } from "../sections/Contact"
import { ShowcaseGrid, type ShowcaseItem } from "../components/ShowcaseGrid"

import imgBrusun from "@/resources/assets/works/brusun.png"
import imgVeC from "@/resources/assets/works/vec.png"
import eboEcommerce from "@/resources/assets/works/ebordados-ecommerce.png"
import eboDownloads from "@/resources/assets/works/ebordados-downloads.png"
import eboMinhaConta from "@/resources/assets/works/ebordados-minhaconta.png"
import lancamentos from "@/resources/assets/works/lancamentos.png"
import imgAdmissao from "@/resources/assets/works/zoboli-admissao-com-estrategia.png"
import imgZoboliEco from "@/resources/assets/works/zoboli-ecossistema.png"
import imgBuzatoEco from "@/resources/assets/works/buzato-ecossistema.png"
import imgScarpini from "@/resources/assets/works/gruposcarpini-institucional.png"
// import imgStarAdmin from "@/resources/assets/works/star-admin.png" // oculto até trocar a imagem (expõe dados de clientes)

type WorksType = {
    id: string
    image: StaticImageData
    link: string
    tags: string[]
}

const worksData: WorksType[] = [
    // {
    //     id: "w18",
    //     image: imgStarAdmin,
    //     link: "",
    //     tags: ["Next", "CSS"]
    // },
    {
        id: "w17",
        image: imgScarpini,
        link: "https://gruposcarpini.com.br",
        tags: ["Next", "CSS"]
    },
    {
        id: "w14",
        image: imgBuzatoEco,
        link: "https://distribuidorabuzato.com.br",
        tags: ["Next", "Node", "Express", "Firebase"]
    },
    {
        id: "w13",
        image: imgZoboliEco,
        link: "https://robertazoboli.com",
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
        id: "w15",
        image: eboDownloads,
        link: "",
        tags: ["Next", "CSS"]
    }, {
        id: "w16",
        image: eboMinhaConta,
        link: "",
        tags: ["Next", "CSS"]
    }, {
        id: "w2",
        image: lancamentos,
        link: "",
        tags: ["Next", "Node", "CSS", "Firebase"]
    }, {
        id: "w8",
        image: imgVeC,
        link: "",
        tags: ["React", "CSS"]
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

    const items: ShowcaseItem[] = worksData.map((work) => ({
        id: work.id,
        image: work.image,
        name: t(`items.${work.id}_name`),
        description: t(`items.${work.id}_desc`),
        tags: work.tags,
        actions: work.link ? [{ href: work.link, label: t("btnView"), icon: <FaRegEye /> }] : [],
    }))

    return (
        <>
            <ShowcaseGrid
                title={t("title")}
                items={items}
                filterAllLabel={t("filterAll")}
                filterLabel={t("filterLabel")}
                opensNewTabLabel={t("opensNewTab")}
                privateLabel={t("privateLink")}
            />
            <Contact />
        </>
    )
}
