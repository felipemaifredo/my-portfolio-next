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

import { Link } from "@/i18n/routing"

type WorksType = {
    name: string
    description: string
    image: any
    link: string
    tags: any[]
}

const worksData: WorksType[] = [
    {
        name: "UbiOne",
        description: "aaaaaaaaaaaaaaaaa",
        image: imgUbiOne,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    }, {
        name: "Innc",
        description: "",
        image: imgInnc,
        link: "",
        tags: ["React", "CSS"]
    }, {
        name: "Premold",
        description: "",
        image: imgPremold,
        link: "",
        tags: ["React", "CSS"]
    }, {
        name: "João Henrrique Advogado",
        description: "",
        image: imgJHB,
        link: "",
        tags: ["React", "CSS"]
    }, {
        name: "V&C",
        description: "",
        image: imgVeC,
        link: "",
        tags: ["React", "CSS"]
    }, {
        name: "Total Seg",
        description: "",
        image: imgTotalSeg,
        link: "",
        tags: ["React", "CSS"]
    }, {
        name: "Lobo Adovacia",
        description: "",
        image: imgLoboADV,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    }, {
        name: "Brusun Energia Solar",
        description: "",
        image: imgBrusun,
        link: "",
        tags: ["HTML", "CSS", "Javascript"]
    },
]

export const WorksPage = () => {
    return (
        <div className={styles.workes_page}>
            <h2>Meus Trabalhos</h2>
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
