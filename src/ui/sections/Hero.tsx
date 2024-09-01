import { MatrixRain } from "../components/animation_screens/MatrixRain"
import styles from "./styles/hero_styles.module.css"
import { Observer } from "../components/Observer/observer"
export const Hero = () => {
    return (
        <section id="hero_section" className={styles.hero_section}>
            <div className={styles.data_container}>
                <h1 className={styles.title}>
                    <Observer>
                        <span className={styles.p_1}>Olá</span>
                    </Observer>
                    <Observer>
                        <span className={styles.p_2}>Sou o Felipe</span>
                    </Observer>
                    <Observer>
                        <span className={styles.p_3}>Desenvolvedor FullStack</span>
                    </Observer>
                </h1>
            </div>
            <div className={styles.canvas_animation}>
                <MatrixRain />
            </div>
        </section>
    )
}
