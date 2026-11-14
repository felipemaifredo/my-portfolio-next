"use client"

import { useEffect, useRef } from "react"

/* ---------- Ruído de Perlin 3D (x, y, tempo) ---------- */
const createNoise = () => {
    const perm = new Uint8Array(512)
    const base = Array.from({ length: 256 }, (_, i) => i)
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[base[i], base[j]] = [base[j], base[i]]
    }
    for (let i = 0; i < 512; i++) perm[i] = base[i & 255]

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
    const lerp = (a: number, b: number, t: number) => a + t * (b - a)
    const grad = (hash: number, x: number, y: number, z: number) => {
        const h = hash & 15
        const u = h < 8 ? x : y
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
    }

    return (x: number, y: number, z: number) => {
        const X = Math.floor(x) & 255
        const Y = Math.floor(y) & 255
        const Z = Math.floor(z) & 255
        x -= Math.floor(x)
        y -= Math.floor(y)
        z -= Math.floor(z)
        const u = fade(x)
        const v = fade(y)
        const w = fade(z)
        const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z
        const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z
        return lerp(
            lerp(
                lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
                lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
                v
            ),
            lerp(
                lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
                lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u),
                v
            ),
            w
        )
    }
}

/* ---------- Ajustes ---------- */
const CELL_DESKTOP = 14 // resolução da malha, em px
const CELL_MOBILE = 12
const SCALE = 1 / 280 // tamanho dos "morros"
const TIME_SPEED = 0.00005 // velocidade da deformação
const LEVEL_STEP = 0.085 // distância entre curvas
const INDEX_EVERY = 4 // a cada N curvas, uma mais forte
const LINE_ALPHA = 0.22
const INDEX_ALPHA = 0.5
const FRAME_MS = 33 // ~30 fps: o movimento é lento, não precisa de 60

const DIP_RADIUS = 110 // alcance do "afundamento" do cursor
const DIP_DEPTH = 0.6
const POINTER_SMOOTHING = 0.12

const CENTER_FADE = 0.55 // quanto as linhas somem atrás do cartão (0..1)

/*
 * Marching squares: para cada combinação de cantos acima/abaixo do nível,
 * quais arestas da célula a curva cruza (0 topo, 1 direita, 2 base, 3 esquerda).
 */
const CASES: number[][] = [
    [], [3, 2], [2, 1], [3, 1], [0, 1], [0, 1, 3, 2], [0, 2], [0, 3],
    [0, 3], [0, 2], [0, 3, 1, 2], [0, 1], [3, 1], [2, 1], [3, 2], [],
]

/**
 * Curvas de nível de um "terreno" que se deforma devagar.
 * - o cursor afunda o terreno e cria anéis em volta
 * - mais apagado no centro, atrás do cartão
 * - ~30 fps, pausa fora da tela; com "reduzir movimento" fica parado
 */
export const Contours = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")
        const noise = createNoise()

        let width = 0
        let height = 0
        let cell = CELL_DESKTOP
        let cols = 0
        let rows = 0
        let field = new Float32Array()
        let color = "#4ade80"

        let target: { x: number; y: number } | null = null
        const pointer = { x: -9999, y: -9999, strength: 0 }

        let time = Math.random() * 100
        let rafId = 0
        let lastFrame = 0
        let isOnScreen = true

        const readColor = () => {
            color = getComputedStyle(document.body).getPropertyValue("--c-primary").trim() || color
        }

        const sampleField = () => {
            const dipActive = pointer.strength > 0.01
            const sigma2 = 2 * DIP_RADIUS * DIP_RADIUS
            let i = 0
            for (let r = 0; r <= rows; r++) {
                const y = r * cell
                for (let c = 0; c <= cols; c++) {
                    const x = c * cell
                    let v = noise(x * SCALE, y * SCALE, time) + 0.35 * noise(x * SCALE * 2.2, y * SCALE * 2.2, time * 1.6 + 10)
                    if (dipActive) {
                        const dx = x - pointer.x
                        const dy = y - pointer.y
                        v -= DIP_DEPTH * pointer.strength * Math.exp(-(dx * dx + dy * dy) / sigma2)
                    }
                    field[i++] = v
                }
            }
        }

        const draw = () => {
            sampleField()
            ctx.clearRect(0, 0, width, height)
            ctx.strokeStyle = color
            ctx.lineJoin = "round"

            const stride = cols + 1
            const minLevel = Math.ceil(-1.1 / LEVEL_STEP)
            const maxLevel = Math.floor(1.1 / LEVEL_STEP)

            const regular = new Path2D()
            const index = new Path2D()

            for (let k = minLevel; k <= maxLevel; k++) {
                const level = k * LEVEL_STEP
                const path = k % INDEX_EVERY === 0 ? index : regular

                for (let r = 0; r < rows; r++) {
                    const y0 = r * cell
                    for (let c = 0; c < cols; c++) {
                        const i = r * stride + c
                        const a = field[i] // topo-esquerda
                        const b = field[i + 1] // topo-direita
                        const cc = field[i + stride + 1] // base-direita
                        const d = field[i + stride] // base-esquerda
                        const code = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (cc > level ? 2 : 0) | (d > level ? 1 : 0)
                        if (code === 0 || code === 15) continue

                        const x0 = c * cell
                        const edgePoint = (edge: number): [number, number] => {
                            switch (edge) {
                                case 0: return [x0 + ((level - a) / (b - a)) * cell, y0]
                                case 1: return [x0 + cell, y0 + ((level - b) / (cc - b)) * cell]
                                case 2: return [x0 + ((level - d) / (cc - d)) * cell, y0 + cell]
                                default: return [x0, y0 + ((level - a) / (d - a)) * cell]
                            }
                        }

                        const edges = CASES[code]
                        for (let e = 0; e < edges.length; e += 2) {
                            const [x1, y1] = edgePoint(edges[e])
                            const [x2, y2] = edgePoint(edges[e + 1])
                            path.moveTo(x1, y1)
                            path.lineTo(x2, y2)
                        }
                    }
                }
            }

            ctx.globalAlpha = LINE_ALPHA
            ctx.lineWidth = 1
            ctx.stroke(regular)
            ctx.globalAlpha = INDEX_ALPHA
            ctx.lineWidth = 1.4
            ctx.stroke(index)
            ctx.globalAlpha = 1

            // Apaga parte das linhas no centro, onde fica o cartão
            const gradient = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, Math.max(width, height) * 0.5
            )
            gradient.addColorStop(0, `rgba(0, 0, 0, ${CENTER_FADE})`)
            gradient.addColorStop(0.55, `rgba(0, 0, 0, ${CENTER_FADE * 0.4})`)
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
            ctx.globalCompositeOperation = "destination-out"
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)
            ctx.globalCompositeOperation = "source-over"
        }

        /* ---------- Loop ---------- */
        const tick = (now: number) => {
            rafId = requestAnimationFrame(tick)
            const dt = now - lastFrame
            if (dt < FRAME_MS) return
            lastFrame = now
            time += Math.min(dt, 100) * TIME_SPEED

            if (target) {
                pointer.x += (target.x - pointer.x) * POINTER_SMOOTHING * 2
                pointer.y += (target.y - pointer.y) * POINTER_SMOOTHING * 2
                pointer.strength += (1 - pointer.strength) * 0.15
            } else {
                pointer.strength *= 0.88
            }

            draw()
        }

        const schedule = () => {
            if (rafId || reducedMotion.matches || !isOnScreen || document.hidden) return
            lastFrame = 0
            rafId = requestAnimationFrame(tick)
        }

        const stop = () => {
            cancelAnimationFrame(rafId)
            rafId = 0
        }

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const rect = canvas.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            cell = width < 768 ? CELL_MOBILE : CELL_DESKTOP
            cols = Math.ceil(width / cell)
            rows = Math.ceil(height / cell)
            field = new Float32Array((cols + 1) * (rows + 1))

            draw()
            schedule()
        }

        /* ---------- Entrada ---------- */
        const toLocal = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            return x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { x, y } : null
        }

        const onPointerMove = (e: PointerEvent) => {
            if (reducedMotion.matches) return
            const local = toLocal(e)
            if (local && !target) {
                pointer.x = local.x
                pointer.y = local.y
            }
            target = local
        }

        const onPointerEnd = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") target = null
        }

        const onPointerLeaveWindow = () => {
            target = null
        }

        const onThemeChange = () => {
            readColor()
            draw()
        }

        const onReducedMotionChange = () => {
            stop()
            target = null
            pointer.strength = 0
            draw()
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
