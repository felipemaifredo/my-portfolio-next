import "../../globals.css"
import type { Metadata } from "next"
import { ReactNode } from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { Bricolage_Grotesque, Geist } from "next/font/google"
import { cookies } from "next/headers"

import { routing } from "../../i18n/routing"

import { Nav } from "@/ui/components/Nav"
import { ThemeSwitcher } from "@/ui/components/ThemeSwitcher/ThemeSwitcher"
import { COLORS, THEMES } from "@/ui/theme"
import { Preloader } from "@/ui/components/Preloader"
import { MotionProvider } from "@/ui/components/MotionProvider"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" })
const body = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" })

type LayoutTypes = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    title: {
      default: t("title"),
      template: `%s · Felipe Maifredo`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      locale: locale === "pt" ? "pt_BR" : "en_US",
      siteName: "Felipe Maifredo",
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LayoutTypes) {
  const { locale } = await params
  const cookieStore = await cookies()

  // Tema: só aplica se o visitante escolheu; senão o CSS segue o prefers-color-scheme do sistema
  const themeCookie = cookieStore.get("theme")?.value
  const theme = THEMES.find((th) => th === themeCookie)

  // Cor: usa a escolhida; na primeira visita sorteia uma
  const colorCookie = cookieStore.get("color")?.value
  const color = COLORS.find((c) => c === colorCookie) ?? COLORS[Math.floor(Math.random() * COLORS.length)]

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <html lang={locale} className={`${display.variable} ${body.variable}`}>
        <body data-theme={theme} data-color={color}>
          <MotionProvider>
            <Preloader />
            <Nav />
            <main>{children}</main>
            <ThemeSwitcher />
          </MotionProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  )
}
