import styles from "./styles/workes_page.module.css"
import { FaRegEye } from "react-icons/fa6"
import Image from "next/image"

import imgBrusun from "@/resources/assets/works/brusun.png"
import imgLoboADV from "@/resources/assets/works/loboadv.png"
import imgTotalSeg from "@/resources/assets/works/totalseg.png"
import imgVeC from "@/resources/assets/works/vec.png"
import imgJHB from "@/resources/assets/works/jhn.png"
import imgPremold from "@/resources/assets/works/premold.png"
import imgInnc from "@/resources/assets/works/innc.png"
import imgUbiOne from "@/resources/assets/works/ubione.png"
import eboEcommerce from "@/resources/assets/works/ebo-ecomerce.png"
import lancamentos from "@/resources/assets/works/lancamentos.png"
import pontoverde from "@/resources/assets/works/ponto-verde.png"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

type WorksType = {
    name: string
    description: string
    image: any
    link: string
    tags: any[]
}

const worksData: WorksType[] = [
    {
        name: "E-commerce E-Bordados",
        description: "Front-end híbrido de e-commerce completo feito em next com uso eficiente de cache.",
        image: eboEcommerce,
        link: "https://next.e-bordados.net/",
        tags: [ "Next", "CSS" ]
    },{
        name: "E-Bordados Lançamentos",
        description: "Sistema de lançamento de cursos, com captação de leads, controle de aulas.",
        image: lancamentos,
        link: "",
        tags: ["Next", "Node", "CSS", "Firebase"]
    },{
        name: "UbiOne",
        description: "Site institucional para apresentar um chatbot inteligente e suas funcionalidades.",
        image: imgUbiOne,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    },
    {
        name: "Innc",
        description: "Site institucional para promover a saúde mental.",
        image: imgInnc,
        link: "",
        tags: ["React", "CSS", "Firebase"]
    },
    {
        name: "Ponto Verde",
        description: "Website institucional para divulgar soluções em energia solar.",
        image: pontoverde,
        link: "",
        tags: ["HTML", "CSS",]
    },
    {
        name: "Premold",
        description: "Site institucional para promover soluções em peças pré-moldadas.",
        image: imgPremold,
        link: "",
        tags: ["React", "CSS", "Firebase"]
    },
    {
        name: "João Henrrique Advogado",
        description: "Website institucional destacando serviços jurídicos personalizados.",
        image: imgJHB,
        link: "",
        tags: ["React", "CSS", "Firebase"]
    },
    {
        name: "V&C",
        description: "Website institucional destacando serviços de educação.",
        image: imgVeC,
        link: "",
        tags: ["React", "CSS"]
    },
    {
        name: "Total Seg",
        description: "Catálogo online para exibição de equipamentos e serviços de segurança.",
        image: imgTotalSeg,
        link: "",
        tags: ["React", "CSS", "Firebase"]
    },
    {
        name: "Lobo Advocacia",
        description: "Site institucional para destacar os serviços de advocacia da empresa.",
        image: imgLoboADV,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    },
    {
        name: "Brusun Energia Solar",
        description: "Website institucional para divulgar soluções em energia solar.",
        image: imgBrusun,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    },
]

export const WorksPage = () => {
    const t = useTranslations("WorksPage")
    
    return (
        <div className={styles.workes_page}>
            <h2>{t("title")}</h2>
            <div>
                {worksData.map((workData: WorksType) => (
                    <div key={workData.name}>
                        <Image
                            src={workData.image}
                            width={300}
                            height={200}
                            alt="Imagem de projeto"
                        />
                        <div>
                            <p className={styles.title}>{workData.name}</p>
                            <p>{workData.description}</p>
                        </div>
                        <div className={styles.tags_container}>
                            {workData.tags.map((tag: any) => (
                                <p className={styles[tag]} key={tag}>{tag}</p>
                            ))}
                        </div>
                        <div className={styles.btn_container}>
                            <Link href={workData.link as any} target="_blank">
                                <FaRegEye />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
