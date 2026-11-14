"use client"

import { useEffect, useRef } from "react"

/* ---------- Ajustes ---------- */
const SPACING_DESKTOP = 28
const SPACING_MOBILE = 22
const DOT_RADIUS = 1.1
const DOT_RADIUS_MAX = 2.6
const BASE_ALPHA = 0.32

const POINTER_RADIUS = 150 // alcance do "ímã" do cursor
const POINTER_PUSH = 16 // deslocamento máximo, em px
const POINTER_SMOOTHING = 0.18 // 0..1 — quanto o cursor "persegue" a posição real por quadro

const RIPPLE_SPEED = 0.55 // px por ms
const RIPPLE_WIDTH = 70
const RIPPLE_PUSH = 10
const RIPPLE_LIFETIME = 1800 // ms
const MAX_RIPPLES = 5

const IDLE_DELAY = 2500 // ms sem interação antes das ondas automáticas
const IDLE_INTERVAL: [number, number] = [2600, 4200]

type Ripple = { x: number; y: number; start: number }

/**
 * Grade de pontos na cor do tema.
 * - o cursor afasta e acende os pontos por perto
 * - clique/toque solta uma onda; sem interação, ondas surgem sozinhas
 * - só redesenha quando algo está se mexendo; pausa fora da tela
 * - com "reduzir movimento" mostra a grade parada
 */
export const DotField = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")

        let width = 0
        let height = 0
        let dotsX: Float32Array = new Float32Array()
        let dotsY: Float32Array = new Float32Array()
        let dotsWeight: Float32Array = new Float32Array() // mais forte nas bordas, mais fraco atrás do cartão
        let color = "#4ade80"

        // Posição real do ponteiro e a suavizada que de fato desenha
        let target: { x: number; y: number } | null = null
        let pointer = { x: -9999, y: -9999, strength: 0 }

        let ripples: Ripple[] = []
        let lastInteraction = performance.now()
        let nextIdleRipple = performance.now() + IDLE_DELAY

        let rafId = 0
        let timeoutId = 0
        let isOnScreen = true

        const readColor = () => {
            color = getComputedStyle(document.body).getPropertyValue("--c-primary").trim() || color
        }

        const buildGrid = () => {
            const spacing = width < 768 ? SPACING_MOBILE : SPACING_DESKTOP
            const cols = Math.ceil(width / spacing) + 1
            const rows = Math.ceil(height / spacing) + 1
            const offsetX = (width - (cols - 1) * spacing) / 2
            const offsetY = (height - (rows - 1) * spacing) / 2
            const cx = width / 2
            const cy = height / 2
            const maxDist = Math.hypot(cx, cy)

            const count = cols * rows
            dotsX = new Float32Array(count)
            dotsY = new Float32Array(count)
            dotsWeight = new Float32Array(count)

            let i = 0
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = offsetX + c * spacing
                    const y = offsetY + r * spacing
                    dotsX[i] = x
                    dotsY[i] = y
                    dotsWeight[i] = 0.35 + 0.65 * Math.min(1, Math.hypot(x - cx, y - cy) / (maxDist * 0.75))
                    i++
                }
            }
        }

        const draw = (now: number) => {
            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = color

            const px = pointer.x
            const py = pointer.y
            const pStrength = pointer.strength

            for (let i = 0; i < dotsX.length; i++) {
                let x = dotsX[i]
                let y = dotsY[i]
                let energy = 0

                // Cursor: empurra para fora e acende
                if (pStrength > 0.01) {
                    const dx = x - px
                    const dy = y - py
                    const dist = Math.hypot(dx, dy)
                    if (dist < POINTER_RADIUS && dist > 0.001) {
                        const falloff = (1 - dist / POINTER_RADIUS) ** 2 * pStrength
                        x += (dx / dist) * falloff * POINTER_PUSH
                        y += (dy / dist) * falloff * POINTER_PUSH
                        energy = Math.max(energy, falloff)
                    }
                }

                // Ondas: anel que se expande e perde força
                for (let r = 0; r < ripples.length; r++) {
                    const ripple = ripples[r]
                    const age = now - ripple.start
                    const radius = age * RIPPLE_SPEED
                    const dx = dotsX[i] - ripple.x
                    const dy = dotsY[i] - ripple.y
                    const dist = Math.hypot(dx, dy)
                    const band = Math.abs(dist - radius)
                    if (band < RIPPLE_WIDTH && dist > 0.001) {
                        const life = 1 - age / RIPPLE_LIFETIME
                        const wave = Math.cos((band / RIPPLE_WIDTH) * (Math.PI / 2)) * life
                        x += (dx / dist) * wave * RIPPLE_PUSH
                        y += (dy / dist) * wave * RIPPLE_PUSH
                        energy = Math.max(energy, wave * 0.85)
                    }
                }

                const alpha = Math.min(1, BASE_ALPHA * dotsWeight[i] + energy * 0.7)
                const radius = DOT_RADIUS + (DOT_RADIUS_MAX - DOT_RADIUS) * energy

                ctx.globalAlpha = alpha
                ctx.beginPath()
                ctx.arc(x, y, radius, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.globalAlpha = 1
        }

        const spawnRipple = (x: number, y: number, now = performance.now()) => {
            ripples.push({ x, y, start: now })
            if (ripples.length > MAX_RIPPLES) ripples.shift()
        }

        const randomBetween = ([min, max]: [number, number]) => min + Math.random() * (max - min)

        const tick = (now: number) => {
            rafId = 0

            // Suaviza o ponteiro e faz o efeito sumir devagar quando ele sai
            if (target) {
                pointer.x += (target.x - pointer.x) * POINTER_SMOOTHING
                pointer.y += (target.y - pointer.y) * POINTER_SMOOTHING
                pointer.strength += (1 - pointer.strength) * 0.12
            } else {
                pointer.strength *= 0.9
            }

            ripples = ripples.filter((r) => now - r.start < RIPPLE_LIFETIME)

            // Ondas automáticas, preferindo as bordas (o centro fica atrás do cartão)
            if (now - lastInteraction > IDLE_DELAY && now > nextIdleRipple) {
                const edge = Math.random() < 0.5
                const x = edge ? (Math.random() < 0.5 ? width * 0.12 : width * 0.88) : Math.random() * width
                const y = edge ? Math.random() * height : (Math.random() < 0.5 ? height * 0.15 : height * 0.85)
                spawnRipple(x, y, now)
                nextIdleRipple = now + randomBetween(IDLE_INTERVAL)
            }

            draw(now)

            const isMoving = target !== null || pointer.strength > 0.01 || ripples.length > 0
            if (isMoving) {
                schedule()
            } else {
                // Nada se mexendo: dorme até a próxima onda automática em vez de redesenhar à toa
                const wakeAt = Math.max(nextIdleRipple, lastInteraction + IDLE_DELAY)
                timeoutId = window.setTimeout(() => {
                    timeoutId = 0
                    schedule()
                }, Math.max(16, wakeAt - now))
            }
        }

        const schedule = () => {
            if (rafId || reducedMotion.matches || !isOnScreen || document.hidden) return
            window.clearTimeout(timeoutId)
            timeoutId = 0
            rafId = requestAnimationFrame(tick)
        }

        const stop = () => {
            cancelAnimationFrame(rafId)
            window.clearTimeout(timeoutId)
            rafId = 0
            timeoutId = 0
        }

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const rect = canvas.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            buildGrid()
            draw(performance.now())
            schedule()
        }

        /* ---------- Entrada ---------- */
        // O canvas fica atrás do conteúdo do hero, então escutamos na janela e conferimos a área
        const toLocal = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            return x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { x, y } : null
        }

        const onPointerMove = (e: PointerEvent) => {
            const local = toLocal(e)
            if (!local) {
                target = null
                return
            }
            if (!target) {
                // Entrando agora: começa do ponto certo, sem "voar" desde a posição antiga
                pointer.x = local.x
                pointer.y = local.y
            }
            target = local
            lastInteraction = performance.now()
            nextIdleRipple = Math.max(nextIdleRipple, lastInteraction + IDLE_DELAY)
            schedule()
        }

        const onPointerDown = (e: PointerEvent) => {
            if ((e.target as Element | null)?.closest("nav")) return
            const local = toLocal(e)
            if (!local) return
            lastInteraction = performance.now()
            nextIdleRipple = Math.max(nextIdleRipple, lastInteraction + IDLE_DELAY)
            spawnRipple(local.x, local.y)
            schedule()
        }

        const onPointerEnd = (e: PointerEvent) => {
            // No toque não existe "hover": ao soltar o dedo o efeito some
            if (e.pointerType !== "mouse") target = null
        }

        const onPointerLeaveWindow = () => {
            target = null
        }

        const onThemeChange = () => {
            readColor()
            draw(performance.now())
        }

        const onReducedMotionChange = () => {
            stop()
            ripples = []
            pointer.strength = 0
            draw(performance.now())
            schedule()
        }

        readColor()
        resize()

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)

        const visibilityObserver = new IntersectionObserver(([entry]) => {
            isOnScreen = entry.isIntersecting
            if (isOnScreen) schedule()
            else stop()
        })
        visibilityObserver.observe(canvas)

        const themeObserver = new MutationObserver(onThemeChange)
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-theme", "data-color"] })

        const onVisibility = () => (document.hidden ? stop() : schedule())

        window.addEventListener("pointermove", onPointerMove, { passive: true })
        window.addEventListener("pointerdown", onPointerDown, { passive: true })
        window.addEventListener("pointerup", onPointerEnd, { passive: true })
        window.addEventListener("pointercancel", onPointerEnd, { passive: true })
        document.documentElement.addEventListener("pointerleave", onPointerLeaveWindow)
        document.addEventListener("visibilitychange", onVisibility)
        reducedMotion.addEventListener("change", onReducedMotionChange)
        colorScheme.addEventListener("change", onThemeChange)

        return () => {
            stop()
            resizeObserver.disconnect()
            visibilityObserver.disconnect()
            themeObserver.disconnect()
            window.removeEventListener("pointermove", onPointerMove)
            window.removeEventListener("pointerdown", onPointerDown)
            window.removeEventListener("pointerup", onPointerEnd)
            window.removeEventListener("pointercancel", onPointerEnd)
            document.documentElement.removeEventListener("pointerleave", onPointerLeaveWindow)
            document.removeEventListener("visibilitychange", onVisibility)
            reducedMotion.removeEventListener("change", onReducedMotionChange)
            colorScheme.removeEventListener("change", onThemeChange)
        }
    }, [])

    return <canvas ref={canvasRef} aria-hidden style={{ display: "block", width: "100%", height: "100%" }} />
}
