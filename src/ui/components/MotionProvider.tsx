"use client"

import { MotionConfig } from "framer-motion"
import { ReactNode } from "react"

/** Faz todas as animações do framer-motion respeitarem o "reduzir movimento" do sistema. */
export const MotionProvider = ({ children }: { children: ReactNode }) => (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
)
