import { useTranslations } from "next-intl"
import styles from "./styles/about_section.module.css"
import { Observer } from "../components/Observer/observer"

export const About = () => {
    const t = useTranslations("HomePage")
    return (
        <section id="about_section" className={styles.about_section}>
            <Observer>
                <h2> {t("title")} </h2>
            </Observer>
            <Observer>
                <p> {t("paragraph_1")} </p>
            </Observer>
            <Observer>
                <p> {t("paragraph_2")} </p>
            </Observer>
            <Observer>
                <p> {t("paragraph_3")} </p>
            </Observer>
            <Observer>
                <p> {t("paragraph_4")} </p>
            </Observer>
        </section>
    )
}
