import styles from "./styles/hero_styles.module.css"
import { Observer } from "../components/Observer/observer"

import { MatrixRain } from "../components/animation_screens/MatrixRain"
import { ScreenNightSky } from "../components/animation_screens/Night Sky/Screen_nightSky"
import { ScreenMouseAnimation } from "../components/animation_screens/mouse animation color/ScreenMouseAnimation"

const screens = [ <MatrixRain />, <ScreenNightSky />, <ScreenMouseAnimation /> ]

export const Hero = () => {

    function randomNumber() {
        return Math.floor(Math.random() * screens.length)
    }

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
                { screens[ randomNumber() ] }
            </div>
        </section>
    )
}
