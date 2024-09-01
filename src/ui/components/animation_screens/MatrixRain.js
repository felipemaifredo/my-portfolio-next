"use client"
import React, { useRef, useEffect } from "react"

export const MatrixRain = () => {
    const renderMatrix = (ref) => {
        const canvas = ref.current
        const context = canvas.getContext("2d")

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const alphabet = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

        const fontSize = 16
        const columns = canvas.width / fontSize

        const rainDrops = []

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1
        }

        const render = () => {
            context.fillStyle = "rgba(0, 0, 0, 0.05)"
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.fillStyle = "#0F0" // pure green
            context.font = `${fontSize}px monospace`
            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length))
                context.fillText(text, i * fontSize, rainDrops[i] * fontSize)
                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                    rainDrops[i] = 0
                }
                rainDrops[i]++
            }
        }

        const intervalId = setInterval(render, 60)

        return () => {
            clearInterval(intervalId)
        }
    }

    const ref = useRef()
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const cleanup = renderMatrix(ref)
        return cleanup
    }, [])

    return <canvas id="canvas1" ref={ref} />
}
