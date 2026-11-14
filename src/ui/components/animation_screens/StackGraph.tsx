"use client"

import { useEffect, useRef } from "react"

/* ---------- Arquitetura desenhada ---------- */
type NodeId = "browser" | "mobile" | "cdn" | "api" | "auth" | "cache" | "db" | "queue" | "worker" | "storage"

const LABELS: Record<NodeId, string> = {
    browser: "Browser",
    mobile: "Mobile",
    cdn: "CDN",
    api: "API",
    auth: "Auth",
    cache: "Cache",
    db: "Database",
    queue: "Queue",
    worker: "Worker",
    storage: "Storage",
}

const EDGES: [NodeId, NodeId][] = [
    ["browser", "cdn"],
    ["cdn", "api"],
    ["mobile", "api"],
    ["api", "auth"],
    ["api", "cache"],
    ["api", "db"],
    ["api", "queue"],
    ["queue", "worker"],
    ["worker", "storage"],
    ["worker", "db"],
]

/** Caminhos de uma requisição; a resposta volta pelo mesmo caminho */
const FLOWS: NodeId[][] = [
    ["browser", "cdn", "api", "cache"],
    ["browser", "cdn", "api", "db"],
    ["browser", "cdn", "api", "auth"],
    ["mobile", "api", "auth"],
    ["mobile", "api", "db"],
    ["api", "queue", "worker", "storage"],
    ["queue", "worker", "db"],
]

/*
 * Posições em fração da tela. O centro fica livre para o cartão do hero;
 * as linhas que passam por trás dele aparecem bem apagadas.
 */
const LAYOUT_WIDE: Record<NodeId, [number, number]> = {
    // Laterais a partir de 12% para não encostar na Nav; Worker fora da seta de rolagem
    browser: [0.12, 0.26],
    mobile: [0.12, 0.76],
    cdn: [0.27, 0.12],
    api: [0.5, 0.09],
    auth: [0.74, 0.12],
    cache: [0.9, 0.28],
    db: [0.9, 0.72],
    queue: [0.3, 0.89],
    worker: [0.6, 0.9],
    storage: [0.82, 0.88],
}

const LAYOUT_TALL: Record<NodeId, [number, number]> = {
    browser: [0.16, 0.06],
    cdn: [0.5, 0.05],
    api: [0.84, 0.07],
    mobile: [0.14, 0.15],
    auth: [0.86, 0.16],
    cache: [0.12, 0.7],
    db: [0.88, 0.7],
    queue: [0.2, 0.79],
    worker: [0.52, 0.77],
    storage: [0.84, 0.8],
}

/* ---------- Ajustes ---------- */
const PACKET_SPEED = 0.32 // px por ms
const STEP_MIN_MS = 420
const STEP_MAX_MS = 1100
const SPAWN_INTERVAL: [number, number] = [650, 1200]
const MAX_FLOWS = 7
const TRAIL = 7
const PULSE_MS = 700
const FONT = "600 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

type Edge = { a: NodeId; b: NodeId; cx: number; cy: number; len: number }
type Step = { edge: Edge; reverse: boolean; duration: number; to: NodeId }
type Flow = { steps: Step[]; index: number; elapsed: number; response: number }
type NodeBox = { x: number; y: number; w: number; h: number; pulse: number }

/**
 * Diagrama de arquitetura fullstack com "pacotes" de requisição e resposta
 * percorrendo as conexões.
 * - passar o mouse num nó acende as conexões dele; clicar dispara uma requisição dali
 * - pausa fora da tela e com a aba em segundo plano
 * - com "reduzir movimento" mostra o diagrama parado
 */
export const StackGraph = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")

        let width = 0
        let height = 0
        let primary = "#4ade80"
        let fg = "#f1f5f9"
        let bg = "#121212"

        const nodes = {} as Record<NodeId, NodeBox>
        let edges: Edge[] = []
        let flows: Flow[] = []
        let hovered: NodeId | null = null
        let lastHoverSpawn = 0

        let rafId = 0
        let lastTime = 0
        let nextSpawn = 0
        let isOnScreen = true

        const readColors = () => {
            const styles = getComputedStyle(document.body)
            primary = styles.getPropertyValue("--c-primary").trim() || primary
            fg = styles.getPropertyValue("--c-black-to-white").trim() || fg
            bg = styles.getPropertyValue("--c-white-to-black").trim() || bg
        }

        /* ---------- Geometria ---------- */
        const layout = () => {
            const layoutMap = width < 768 || height > width ? LAYOUT_TALL : LAYOUT_WIDE
            ctx.font = FONT
            ;(Object.keys(LABELS) as NodeId[]).forEach((id) => {
                const [fx, fy] = layoutMap[id]
                const w = Math.ceil(ctx.measureText(LABELS[id]).width) + 22
                nodes[id] = { x: fx * width, y: fy * height, w, h: 26, pulse: nodes[id]?.pulse ?? 0 }
            })

            edges = EDGES.map(([a, b], i) => {
                const A = nodes[a]
                const B = nodes[b]
                const mx = (A.x + B.x) / 2
                const my = (A.y + B.y) / 2
                const dx = B.x - A.x
                const dy = B.y - A.y
                const len = Math.hypot(dx, dy)
                // Curvatura leve, alternando o lado para não ficar tudo paralelo
                const bend = len * 0.12 * (i % 2 === 0 ? 1 : -1)
                return { a, b, cx: mx - (dy / len) * bend, cy: my + (dx / len) * bend, len: len * 1.04 }
            })
        }

        const pointOn = (edge: Edge, t: number, reverse: boolean) => {
            const u = reverse ? 1 - t : t
            const A = nodes[edge.a]
            const B = nodes[edge.b]
            const inv = 1 - u
            return {
                x: inv * inv * A.x + 2 * inv * u * edge.cx + u * u * B.x,
                y: inv * inv * A.y + 2 * inv * u * edge.cy + u * u * B.y,
            }
        }

        const findEdge = (from: NodeId, to: NodeId) => {
            for (const edge of edges) {
                if (edge.a === from && edge.b === to) return { edge, reverse: false }
                if (edge.a === to && edge.b === from) return { edge, reverse: true }
            }
            return null
        }

        /* ---------- Fluxos ---------- */
        const spawnFlow = (path: NodeId[]) => {
            const steps: Step[] = []
            const full = [...path, ...path.slice(0, -1).reverse()] // ida e volta
            const responseFrom = path.length - 1
            for (let i = 0; i < full.length - 1; i++) {
                const found = findEdge(full[i], full[i + 1])
                if (!found) return
                const duration = Math.min(STEP_MAX_MS, Math.max(STEP_MIN_MS, found.edge.len / PACKET_SPEED))
                steps.push({ ...found, duration, to: full[i + 1] })
            }
            flows.push({ steps, index: 0, elapsed: 0, response: responseFrom })
            if (flows.length > MAX_FLOWS) flows.shift()
        }

        const spawnFrom = (id: NodeId) => {
            const options = FLOWS.filter((f) => f.includes(id))
            if (!options.length) return
            const flow = options[Math.floor(Math.random() * options.length)]
            spawnFlow(flow.slice(flow.indexOf(id)).length > 1 ? flow.slice(flow.indexOf(id)) : flow)
        }

        const randomBetween = ([min, max]: [number, number]) => min + Math.random() * (max - min)

        const update = (dt: number, now: number) => {
            if (now > nextSpawn) {
                spawnFlow(FLOWS[Math.floor(Math.random() * FLOWS.length)])
                nextSpawn = now + randomBetween(SPAWN_INTERVAL)
            }

            for (const flow of flows) {
                flow.elapsed += dt
                while (flow.index < flow.steps.length && flow.elapsed >= flow.steps[flow.index].duration) {
                    flow.elapsed -= flow.steps[flow.index].duration
                    nodes[flow.steps[flow.index].to].pulse = 1
                    flow.index++
                }
            }
            flows = flows.filter((f) => f.index < f.steps.length)

            for (const id in nodes) {
                const node = nodes[id as NodeId]
                node.pulse = Math.max(0, node.pulse - dt / PULSE_MS)
            }
        }

        /* ---------- Desenho ---------- */
        const isLit = (edge: Edge) => hovered !== null && (edge.a === hovered || edge.b === hovered)

        const isNeighbor = (id: NodeId) =>
            hovered !== null && (id === hovered || edges.some((e) => isLit(e) && (e.a === id || e.b === id)))

        const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
            ctx.beginPath()
            ctx.moveTo(x + r, y)
            ctx.arcTo(x + w, y, x + w, y + h, r)
            ctx.arcTo(x + w, y + h, x, y + h, r)
            ctx.arcTo(x, y + h, x, y, r)
            ctx.arcTo(x, y, x + w, y, r)
            ctx.closePath()
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height)

            // Conexões
            ctx.lineWidth = 1.25
            ctx.strokeStyle = primary
            for (const edge of edges) {
                const A = nodes[edge.a]
                const B = nodes[edge.b]
                ctx.globalAlpha = isLit(edge) ? 0.6 : hovered ? 0.12 : 0.22
                ctx.beginPath()
                ctx.moveTo(A.x, A.y)
                ctx.quadraticCurveTo(edge.cx, edge.cy, B.x, B.y)
                ctx.stroke()
            }

            // Pacotes com rastro; a resposta é um anel vazado
            for (const flow of flows) {
                const step = flow.steps[flow.index]
                const t = Math.min(1, flow.elapsed / step.duration)
                const isResponse = flow.index >= flow.response
                const lit = isLit(step.edge)

                for (let k = TRAIL; k >= 0; k--) {
                    const tk = t - (k * 0.035)
                    if (tk < 0) continue
                    const p = pointOn(step.edge, tk, step.reverse)
                    const fade = 1 - k / (TRAIL + 1)
                    ctx.globalAlpha = (k === 0 ? 1 : fade * 0.35) * (hovered && !lit ? 0.45 : 1)

                    ctx.beginPath()
                    if (k === 0 && isResponse) {
                        ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2)
                        ctx.lineWidth = 1.5
                        ctx.strokeStyle = primary
                        ctx.stroke()
                    } else {
                        ctx.arc(p.x, p.y, k === 0 ? 3.2 : 2.2 * fade, 0, Math.PI * 2)
                        ctx.fillStyle = primary
                        ctx.fill()
                    }
                }
            }

            // Nós
            ctx.font = FONT
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            for (const id of Object.keys(nodes) as NodeId[]) {
                const node = nodes[id]
                const x = node.x - node.w / 2
                const y = node.y - node.h / 2
                const active = isNeighbor(id)
                const dim = hovered !== null && !active

                // Anel que se expande quando um pacote chega
                if (node.pulse > 0) {
                    const grow = (1 - node.pulse) * 10
                    ctx.globalAlpha = node.pulse * 0.5
                    ctx.lineWidth = 1.5
                    ctx.strokeStyle = primary
                    roundRect(x - grow, y - grow, node.w + grow * 2, node.h + grow * 2, 9 + grow)
                    ctx.stroke()
                }

                ctx.globalAlpha = 0.92
                ctx.fillStyle = bg
                roundRect(x, y, node.w, node.h, 9)
                ctx.fill()

                ctx.globalAlpha = dim ? 0.25 : active || node.pulse > 0.4 ? 0.95 : 0.5
                ctx.lineWidth = id === hovered ? 1.75 : 1
                ctx.strokeStyle = primary
                ctx.stroke()

                ctx.globalAlpha = dim ? 0.35 : active ? 1 : 0.75
                ctx.fillStyle = id === hovered ? primary : fg
                ctx.fillText(LABELS[id], node.x, node.y + 0.5)
            }

            ctx.globalAlpha = 1
        }

        /* ---------- Loop ---------- */
        const tick = (now: number) => {
            rafId = 0
            const dt = Math.min(64, now - (lastTime || now)) // evita salto ao voltar de uma pausa
            lastTime = now
            update(dt, now)
            draw()
            schedule()
        }

        const schedule = () => {
            if (rafId || reducedMotion.matches || !isOnScreen || document.hidden) return
            rafId = requestAnimationFrame(tick)
        }

        const stop = () => {
            cancelAnimationFrame(rafId)
            rafId = 0
            lastTime = 0
        }

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const rect = canvas.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            layout()
            flows = [] // as curvas mudaram; recomeça os fluxos
            draw()
            schedule()
        }

        /* ---------- Entrada ---------- */
        const hitTest = (e: PointerEvent): NodeId | null => {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            for (const id of Object.keys(nodes) as NodeId[]) {
                const n = nodes[id]
                if (Math.abs(x - n.x) <= n.w / 2 + 6 && Math.abs(y - n.y) <= n.h / 2 + 6) return id
            }
            return null
        }

        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            const hit = hitTest(e)
            if (hit === hovered) return
            hovered = hit
            canvas.style.cursor = hit ? "pointer" : ""
            const now = performance.now()
            if (hit && now - lastHoverSpawn > 600 && !reducedMotion.matches) {
                spawnFrom(hit)
                lastHoverSpawn = now
            }
            if (!rafId) draw()
        }

        const onPointerDown = (e: PointerEvent) => {
            const hit = hitTest(e)
            if (!hit) return
            if (e.pointerType !== "mouse") {
                // No toque, o toque faz o papel do "hover" e some sozinho
                hovered = hit
                window.setTimeout(() => {
                    if (hovered === hit) hovered = null
                    if (!rafId) draw()
                }, 1400)
            }
            if (!reducedMotion.matches) spawnFrom(hit)
            if (!rafId) draw()
        }

        const onPointerLeave = () => {
            hovered = null
            canvas.style.cursor = ""
            if (!rafId) draw()
        }

        const onThemeChange = () => {
            readColors()
            draw()
        }

        const onReducedMotionChange = () => {
            stop()
            flows = []
            draw()
            schedule()
        }

        readColors()
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

        // O conteúdo do hero deixa o mouse passar (pointer-events: none) até o canvas
        canvas.addEventListener("pointermove", onPointerMove)
        canvas.addEventListener("pointerdown", onPointerDown)
        canvas.addEventListener("pointerleave", onPointerLeave)
        document.addEventListener("visibilitychange", onVisibility)
        reducedMotion.addEventListener("change", onReducedMotionChange)
        colorScheme.addEventListener("change", onThemeChange)

        return () => {
            stop()
            resizeObserver.disconnect()
            visibilityObserver.disconnect()
            themeObserver.disconnect()
            canvas.removeEventListener("pointermove", onPointerMove)
            canvas.removeEventListener("pointerdown", onPointerDown)
            canvas.removeEventListener("pointerleave", onPointerLeave)
            document.removeEventListener("visibilitychange", onVisibility)
            reducedMotion.removeEventListener("change", onReducedMotionChange)
            colorScheme.removeEventListener("change", onThemeChange)
        }
    }, [])

    return <canvas ref={canvasRef} aria-hidden style={{ display: "block", width: "100%", height: "100%" }} />
}
