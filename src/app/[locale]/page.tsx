import {unstable_setRequestLocale} from 'next-intl/server'
import { Home } from "@/ui/pages/Home"

export default function page({params: {locale}}: any) {
  unstable_setRequestLocale(locale)

  return <Home />
}
