"use client"

import { useEffect, useRef } from "react"

const ALPHABET = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const FONT_SIZE = 16
const FRAME_MS = 60
const FADE_ALPHA = 0.08

/**
 * Chuva de caracteres desenhada com as cores do tema atual (--c-primary sobre --c-white-to-black).
 * - acompanha troca de tema/cor e redimensionamento
 * - pausa fora da tela e com a aba em segundo plano
 * - com "reduzir movimento" ativo desenha um quadro estático
 */
export const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")

        let width = 0
        let height = 0
        let drops: number[] = []
        let fg = "#4ade80"
        let bg = "#121212"
        let rafId = 0
        let lastFrame = 0
        let isOnScreen = true

        const readColors = () => {
            const styles = getComputedStyle(document.body)
            fg = styles.getPropertyValue("--c-primary").trim() || fg
            bg = styles.getPropertyValue("--c-white-to-black").trim() || bg
        }

        const clear = () => {
            ctx.globalAlpha = 1
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, width, height)
        }

        const step = () => {
            ctx.globalAlpha = FADE_ALPHA
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, width, height)

            ctx.globalAlpha = 1
            ctx.fillStyle = fg
            ctx.font = `${FONT_SIZE}px monospace`
            for (let i = 0; i < drops.length; i++) {
                const char = ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
                ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE)
                if (drops[i] * FONT_SIZE > height && Math.random() > 0.975) drops[i] = 0
                drops[i]++
            }
        }

        /** Quadro estático com rastros já formados, para quem prefere menos movimento. */
        const drawStill = () => {
            clear()
            drops = drops.map(() => Math.floor(Math.random() * (height / FONT_SIZE)))
            for (let i = 0; i < 80; i++) step()
        }

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const rect = canvas.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            // Mantém as colunas existentes e cria as novas espalhadas
            const columns = Math.ceil(width / FONT_SIZE)
            drops = Array.from({ length: columns }, (_, i) => drops[i] ?? Math.floor(Math.random() * -50))

            clear()
            if (reducedMotion.matches) drawStill()
        }

        const loop = (time: number) => {
            rafId = requestAnimationFrame(loop)
            if (time - lastFrame < FRAME_MS) return
            lastFrame = time
            step()
        }

        const start = () => {
            if (rafId || reducedMotion.matches || !isOnScreen || document.hidden) return
            rafId = requestAnimationFrame(loop)
        }

        const stop = () => {
            cancelAnimationFrame(rafId)
            rafId = 0
        }

        const restart = () => {
            stop()
            if (reducedMotion.matches) drawStill()
            else start()
        }

        const onThemeChange = () => {
            readColors()
            if (reducedMotion.matches) drawStill()
            else clear()
        }

        readColors()
        resize()
        start()

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)

        const visibilityObserver = new IntersectionObserver(([entry]) => {
            isOnScreen = entry.isIntersecting
            if (isOnScreen) start()
            else stop()
        })
        visibilityObserver.observe(canvas)

        const themeObserver = new MutationObserver(onThemeChange)
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-theme", "data-color"] })

        const onVisibility = () => (document.hidden ? stop() : start())
        document.addEventListener("visibilitychange", onVisibility)
        reducedMotion.addEventListener("change", restart)
        colorScheme.addEventListener("change", onThemeChange)

        return () => {
            stop()
            resizeObserver.disconnect()
            visibilityObserver.disconnect()
            themeObserver.disconnect()
            document.removeEventListener("visibilitychange", onVisibility)
            reducedMotion.removeEventListener("change", restart)
            colorScheme.removeEventListener("change", onThemeChange)
        }
    }, [])

    return <canvas ref={canvasRef} aria-hidden style={{ display: "block", width: "100%", height: "100%" }} />
}
