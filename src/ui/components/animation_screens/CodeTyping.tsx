"use client"

import { useEffect, useRef } from "react"
import { CODE_SNIPPETS } from "./codeSnippets"

/* ---------- Destaque de sintaxe (simples, por linha) ---------- */
type TokenKind = "kw" | "str" | "num" | "com" | "fn" | "type" | "tag" | "plain"
type Token = { text: string; kind: TokenKind }
type Line = { indent: number; text: string; tokens: Token[]; length: number }

const TOKEN_RE = new RegExp(
    [
        "(?<com>\\/\\/.*$)",
        "(?<str>\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)",
        "(?<num>\\b\\d+(?:\\.\\d+)?\\b)",
        "(?<kw>\\b(?:import|from|export|const|let|async|await|function|return|if|else|for|of|new|type|true|false|null|undefined|try|catch|throw|as|typeof|default)\\b)",
        "(?<tag><\\/?[A-Za-z][\\w.]*|\\/>)",
        "(?<fn>\\b[A-Za-z_$][\\w$]*(?=\\())",
        "(?<type>\\b[A-Z][\\w$]*\\b)",
    ].join("|"),
    "g"
)

const tokenize = (code: string): Line[] =>
    code.split("\n").map((raw) => {
        const indent = raw.length - raw.trimStart().length
        const text = raw.slice(indent)
        const tokens: Token[] = []
        let last = 0
        for (const match of text.matchAll(TOKEN_RE)) {
            const index = match.index ?? 0
            if (index > last) tokens.push({ text: text.slice(last, index), kind: "plain" })
            const kind = (Object.entries(match.groups ?? {}).find(([, v]) => v !== undefined)?.[0] ?? "plain") as TokenKind
            tokens.push({ text: match[0], kind })
            last = index + match[0].length
        }
        if (last < text.length) tokens.push({ text: text.slice(last), kind: "plain" })
        return { indent, text, tokens, length: text.length }
    })

const SNIPPETS = CODE_SNIPPETS.map((s) => ({ file: s.file, lines: tokenize(s.code) }))

/* ---------- Ajustes ---------- */
const CHAR_MS: [number, number] = [22, 55] // intervalo entre teclas
const LINE_PAUSE_MS: [number, number] = [140, 340] // pausa ao trocar de linha
const PUNCT_PAUSE_MS = 70 // pausa curta depois de { ; ,
const HOLD_MS = 2600 // tempo parado com o arquivo completo
const FADE_OUT_MS = 500
const FADE_IN_MS = 350
const SECOND_PANE_DELAY_MS = 1400
const BLINK_MS = 530
const LAYER_ALPHA = 0.6 // força geral do fundo

type Phase = "typing" | "hold" | "fadeOut" | "fadeIn"

type Pane = {
    x: number
    y: number
    w: number
    h: number
    snippet: number
    line: number
    col: number
    nextKeyAt: number
    lastKeyAt: number
    phase: Phase
    phaseStart: number
    scroll: number
    scrollTarget: number
}

const between = ([min, max]: [number, number]) => min + Math.random() * (max - min)

/**
 * Editor de código ao fundo, digitando trechos reais do portfólio.
 * - um painel no celular, dois lado a lado em telas largas
 * - cores derivadas do tema (--c-primary sobre --c-black-to-white)
 * - pausa fora da tela; com "reduzir movimento" mostra os arquivos completos, parados
 */
export const CodeTyping = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")

        let width = 0
        let height = 0
        let fontSize = 13
        let lineHeight = 21
        let charWidth = 7.8
        let primary = "#4ade80"
        let fg = "#f1f5f9"
        let panes: Pane[] = []

        let rafId = 0
        let isOnScreen = true

        const readColors = () => {
            const styles = getComputedStyle(document.body)
            primary = styles.getPropertyValue("--c-primary").trim() || primary
            fg = styles.getPropertyValue("--c-black-to-white").trim() || fg
        }

        const styleFor = (kind: TokenKind): [string, number] => {
            switch (kind) {
                case "kw": return [primary, 1]
                case "tag": return [primary, 0.95]
                case "type": return [primary, 0.8]
                case "num": return [primary, 0.8]
                case "str": return [primary, 0.65]
                case "fn": return [fg, 0.95]
                case "com": return [fg, 0.38]
                default: return [fg, 0.62]
            }
        }

        /* ---------- Layout ---------- */
        const buildPanes = (now: number) => {
            const isNarrow = width < 900
            fontSize = isNarrow ? 11.5 : 13
            lineHeight = Math.round(fontSize * 1.62)
            ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
            charWidth = ctx.measureText("M").width

            const top = isNarrow ? 20 : 44
            // No celular a barra de navegação ocupa o rodapé
            const bottom = isNarrow ? height - 120 : height - 40
            const left = isNarrow ? 16 : Math.max(110, width * 0.07)
            const right = isNarrow ? width - 16 : width - 40
            const gap = 48

            const old = panes
            const rects = isNarrow
                ? [{ x: left, w: right - left }]
                : [
                    { x: left, w: (right - left - gap) / 2 },
                    { x: left + (right - left + gap) / 2, w: (right - left - gap) / 2 },
                ]

            panes = rects.map((r, i) => {
                const keep = old[i]
                return {
                    x: r.x,
                    y: top,
                    w: r.w,
                    h: bottom - top,
                    snippet: keep?.snippet ?? i % SNIPPETS.length,
                    line: keep?.line ?? 0,
                    col: keep?.col ?? 0,
                    nextKeyAt: keep?.nextKeyAt ?? now + i * SECOND_PANE_DELAY_MS,
                    lastKeyAt: keep?.lastKeyAt ?? 0,
                    phase: keep?.phase ?? "typing",
                    phaseStart: keep?.phaseStart ?? now,
                    scroll: keep?.scroll ?? 0,
                    scrollTarget: keep?.scrollTarget ?? 0,
                }
            })

            if (reducedMotion.matches) panes.forEach(finishSnippet)
        }

        const visibleLines = (pane: Pane) => Math.max(4, Math.floor((pane.h - 40) / lineHeight))

        const finishSnippet = (pane: Pane) => {
            const lines = SNIPPETS[pane.snippet].lines
            pane.line = lines.length - 1
            pane.col = lines[pane.line].length
            pane.scroll = pane.scrollTarget = 0
        }

        /* ---------- Digitação ---------- */
        const advance = (pane: Pane, now: number) => {
            const lines = SNIPPETS[pane.snippet].lines

            if (pane.phase === "fadeIn" && now - pane.phaseStart > FADE_IN_MS) {
                pane.phase = "typing"
            }

            if (pane.phase === "typing") {
                while (now >= pane.nextKeyAt) {
                    const line = lines[pane.line]
                    if (pane.col < line.length) {
                        const typed = line.text[pane.col]
                        pane.col++
                        pane.lastKeyAt = pane.nextKeyAt
                        pane.nextKeyAt += between(CHAR_MS) + ("{;,(".includes(typed) ? PUNCT_PAUSE_MS : 0)
                    } else if (pane.line < lines.length - 1) {
                        pane.line++
                        pane.col = 0
                        pane.lastKeyAt = pane.nextKeyAt
                        // Linha em branco passa rápido
                        pane.nextKeyAt += lines[pane.line].length === 0 ? 60 : between(LINE_PAUSE_MS)
                    } else {
                        pane.phase = "hold"
                        pane.phaseStart = now
                        break
                    }
                }

                // Rola para manter o cursor a ~3 linhas do fim
                const overflow = pane.line - (visibleLines(pane) - 3)
                pane.scrollTarget = Math.max(0, overflow) * lineHeight
            }

            if (pane.phase === "hold" && now - pane.phaseStart > HOLD_MS) {
                pane.phase = "fadeOut"
                pane.phaseStart = now
            }

            if (pane.phase === "fadeOut" && now - pane.phaseStart > FADE_OUT_MS) {
                // Próximo arquivo, pulando o que o outro painel está mostrando
                const taken = new Set(panes.filter((p) => p !== pane).map((p) => p.snippet))
                let next = pane.snippet
                do next = (next + 1) % SNIPPETS.length
                while (taken.has(next) && SNIPPETS.length > panes.length)
                pane.snippet = next
                pane.line = 0
                pane.col = 0
                pane.scroll = pane.scrollTarget = 0
                pane.phase = "fadeIn"
                pane.phaseStart = now
                pane.nextKeyAt = now + FADE_IN_MS + 200
            }

            pane.scroll += (pane.scrollTarget - pane.scroll) * 0.12
        }

        /* ---------- Desenho ---------- */
        const paneAlpha = (pane: Pane, now: number) => {
            if (pane.phase === "fadeOut") return 1 - Math.min(1, (now - pane.phaseStart) / FADE_OUT_MS)
            if (pane.phase === "fadeIn") return Math.min(1, (now - pane.phaseStart) / FADE_IN_MS)
            return 1
        }

        const drawPane = (pane: Pane, now: number) => {
            const snippet = SNIPPETS[pane.snippet]
            const alpha = paneAlpha(pane, now) * LAYER_ALPHA
            if (alpha <= 0.001) return

            const font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
            ctx.font = font
            ctx.textBaseline = "middle"

            // Aba com o nome do arquivo
            const tabH = 28
            const tabW = Math.min(pane.w, ctx.measureText(snippet.file).width + 28)
            ctx.globalAlpha = alpha * 0.7
            ctx.fillStyle = fg
            ctx.textAlign = "left"
            ctx.fillText(snippet.file, pane.x + 14, pane.y + tabH / 2)
            ctx.globalAlpha = alpha
            ctx.fillStyle = primary
            ctx.fillRect(pane.x, pane.y + tabH - 2, tabW, 2)
            ctx.globalAlpha = alpha * 0.15
            ctx.fillStyle = fg
            ctx.fillRect(pane.x, pane.y + tabH - 1, pane.w, 1)

            // Área de código, recortada no painel
            const bodyTop = pane.y + tabH + 12
            const bodyH = pane.h - tabH - 12
            ctx.save()
            ctx.beginPath()
            ctx.rect(pane.x, bodyTop, pane.w, bodyH)
            ctx.clip()

            const gutter = charWidth * 4
            const codeX = pane.x + gutter + charWidth * 1.5
            const first = Math.max(0, Math.floor(pane.scroll / lineHeight) - 1)
            const last = Math.min(pane.line, first + Math.ceil(bodyH / lineHeight) + 2)

            for (let i = first; i <= last; i++) {
                const line = snippet.lines[i]
                const y = bodyTop + i * lineHeight - pane.scroll + lineHeight / 2

                // Esmaece no topo e no rodapé do painel
                const edge = Math.min(1, (y - bodyTop) / (lineHeight * 2), (bodyTop + bodyH - y) / (lineHeight * 2))
                const lineAlpha = alpha * Math.max(0, edge)
                if (lineAlpha <= 0.01) continue

                ctx.textAlign = "right"
                ctx.globalAlpha = lineAlpha * (i === pane.line ? 0.55 : 0.25)
                ctx.fillStyle = fg
                ctx.fillText(String(i + 1), pane.x + gutter, y)

                ctx.textAlign = "left"
                const limit = i < pane.line ? line.length : pane.col
                let written = 0
                let x = codeX + line.indent * charWidth
                for (const token of line.tokens) {
                    if (written >= limit) break
                    const text = token.text.slice(0, limit - written)
                    const [color, a] = styleFor(token.kind)
                    ctx.globalAlpha = lineAlpha * a
                    ctx.fillStyle = color
                    ctx.fillText(text, x, y)
                    x += text.length * charWidth
                    written += text.length
                }

                // Cursor: fixo enquanto digita, piscando quando para
                if (i === pane.line && !reducedMotion.matches && pane.phase !== "fadeOut") {
                    const typingNow = now - pane.lastKeyAt < BLINK_MS
                    const visible = typingNow || Math.floor(now / BLINK_MS) % 2 === 0
                    if (visible) {
                        ctx.globalAlpha = alpha
                        ctx.fillStyle = primary
                        ctx.fillRect(x + 1, y - fontSize * 0.65, 2, fontSize * 1.3)
                    }
                }
            }

            ctx.restore()
        }

        const draw = (now: number) => {
            ctx.clearRect(0, 0, width, height)
            for (const pane of panes) drawPane(pane, now)
            ctx.globalAlpha = 1
        }

        /* ---------- Loop ---------- */
        const tick = (now: number) => {
            rafId = 0
            for (const pane of panes) advance(pane, now)
            draw(now)
            schedule()
        }

        const schedule = () => {
            if (rafId || reducedMotion.matches || !isOnScreen || document.hidden) return
            rafId = requestAnimationFrame(tick)
        }

        const stop = () => {
            cancelAnimationFrame(rafId)
            rafId = 0
        }

        // Ao voltar de uma pausa, não "digita" tudo que teria acontecido nesse meio-tempo
        const resumeClock = (now: number) => {
            for (const pane of panes) {
                const shift = now - Math.max(pane.lastKeyAt, pane.phaseStart)
                if (shift > 1000) {
                    pane.nextKeyAt += shift
                    pane.lastKeyAt += shift
                    pane.phaseStart += shift
                }
            }
        }

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const rect = canvas.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            const now = performance.now()
            buildPanes(now)
            draw(now)
            schedule()
        }

        const onThemeChange = () => {
            readColors()
            draw(performance.now())
        }

        const onReducedMotionChange = () => {
            stop()
            const now = performance.now()
            if (reducedMotion.matches) panes.forEach(finishSnippet)
            else resumeClock(now)
            draw(now)
            schedule()
        }

        readColors()
        resize()

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)

        const visibilityObserver = new IntersectionObserver(([entry]) => {
            isOnScreen = entry.isIntersecting
            if (isOnScreen) {
                resumeClock(performance.now())
                schedule()
            } else {
                stop()
            }
        })
        visibilityObserver.observe(canvas)

        const themeObserver = new MutationObserver(onThemeChange)
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-theme", "data-color"] })

        const onVisibility = () => {
            if (document.hidden) return stop()
            resumeClock(performance.now())
            schedule()
        }

        document.addEventListener("visibilitychange", onVisibility)
        reducedMotion.addEventListener("change", onReducedMotionChange)
        colorScheme.addEventListener("change", onThemeChange)

        return () => {
            stop()
            resizeObserver.disconnect()
            visibilityObserver.disconnect()
            themeObserver.disconnect()
            document.removeEventListener("visibilitychange", onVisibility)
            reducedMotion.removeEventListener("change", onReducedMotionChange)
            colorScheme.removeEventListener("change", onThemeChange)
        }
    }, [])

    return <canvas ref={canvasRef} aria-hidden style={{ display: "block", width: "100%", height: "100%" }} />
}
