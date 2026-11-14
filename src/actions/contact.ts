"use server"

import { headers } from "next/headers"

export type ContactField = "name" | "whatsOrEmail" | "subject"

export type ContactState = {
    status: "idle" | "success" | "error"
    /** Código do erro geral; o texto é traduzido no cliente */
    error?: "empty" | "generic"
    /** Campos obrigatórios que chegaram vazios */
    invalid?: ContactField[]
    /** Valores enviados — devolvidos em caso de erro para o formulário não perder o que foi digitado */
    fields: Record<ContactField, string>
}

const FIELDS: ContactField[] = ["name", "whatsOrEmail", "subject"]
const MAX_LENGTH = 5000

// Configure FORMSUBMIT_ENDPOINT com o alias aleatório do formsubmit para não depender do e-mail
const ENDPOINT = process.env.FORMSUBMIT_ENDPOINT ?? "https://formsubmit.co/ajax/felipemaifredo@gmail.com"

const emptyFields = (): ContactState["fields"] => ({ name: "", whatsOrEmail: "", subject: "" })

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
    const fields = emptyFields()
    for (const field of FIELDS) {
        const value = formData.get(field)
        fields[field] = typeof value === "string" ? value.trim().slice(0, MAX_LENGTH) : ""
    }

    // Honeypot: campo invisível que só robôs preenchem. Finge sucesso e descarta.
    if (formData.get("website")) {
        return { status: "success", fields: emptyFields() }
    }

    const invalid = FIELDS.filter((field) => !fields[field])
    if (invalid.length) {
        return { status: "error", error: "empty", invalid, fields }
    }

    // O formsubmit valida a origem do envio; repassa a do visitante
    const requestHeaders = await headers()
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? ""
    const proto = requestHeaders.get("x-forwarded-proto") ?? "https"
    const origin = requestHeaders.get("origin") ?? (host ? `${proto}://${host}` : "")

    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                ...(origin && { "Origin": origin, "Referer": `${origin}/` }),
            },
            body: JSON.stringify({
                _captcha: "false",
                _subject: "Novo Contato no Site!",
                Nome: fields.name,
                EmailWhatsapp: fields.whatsOrEmail,
                Assunto: fields.subject,
            }),
            cache: "no-store",
        })

        // O endpoint /ajax responde 200 com { success: "false", message } em alguns erros
        const result = await response.json().catch(() => null)
        if (!response.ok || String(result?.success) !== "true") {
            throw new Error(`formsubmit respondeu ${response.status}: ${result?.message ?? "sem detalhes"}`)
        }

        return { status: "success", fields: emptyFields() }
    } catch (error) {
        console.error("[contact] falha ao enviar:", error)
        return { status: "error", error: "generic", fields }
    }
}
