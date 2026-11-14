"use client"

import { FaRegEye } from "react-icons/fa6"
import type { StaticImageData } from "next/image"
import { useTranslations } from "next-intl"
import { Contact } from "../sections/Contact"
import { ShowcaseGrid, type ShowcaseItem } from "../components/ShowcaseGrid"

import imgBrusun from "@/resources/assets/works/brusun.png"
import imgLoboADV from "@/resources/assets/works/loboadv.png"
import imgTotalSeg from "@/resources/assets/works/totalseg.png"
import imgVeC from "@/resources/assets/works/vec.png"
import imgJHB from "@/resources/assets/works/jhn.png"
import imgPremold from "@/resources/assets/works/premold.png"
import imgInnc from "@/resources/assets/works/innc.png"
import imgUbiOne from "@/resources/assets/works/ubione.png"
import eboEcommerce from "@/resources/assets/works/ebordados-ecommerce.png"
import lancamentos from "@/resources/assets/works/lancamentos.png"
import pontoverde from "@/resources/assets/works/ponto-verde.png"
import imgAdmissao from "@/resources/assets/works/zoboli-admissao-com-estrategia.png"
import imgZoboliEco from "@/resources/assets/works/zoboli-ecossistema.png"
import imgBuzatoEco from "@/resources/assets/works/buzato-ecossistema.png"

type WorksType = {
    id: string
    image: StaticImageData
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
