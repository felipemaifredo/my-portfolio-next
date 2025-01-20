import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["pt", "en",],
  // Used when no locale matches
  defaultLocale: "pt",
  pathnames: {
    "/": "/",
    "/works": {
      pt: "/trabalhos",
      en: "/works"
    },
    "/projects": {
      pt: "/projetos",
      en: "/projects"
    }
  }
})

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
