import styles from "./style.module.css"

export const ScreenNightSky = () => {
    return (
        <div className={styles.container_pai}>
            <div className={styles.container}>
                <div className={styles.moon}></div>
                <div className={styles.montains}></div>
                <div className={styles.land}></div>
                <div className={styles.windmill}>
                    <div className={styles.light}></div>
                    <div className={styles.blades}></div>
                </div>
            </div>
        </div>
    )
}
