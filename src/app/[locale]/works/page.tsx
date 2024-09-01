import {unstable_setRequestLocale} from 'next-intl/server'

export default function page({params: {locale}}: any) {
  unstable_setRequestLocale(locale)

  return (
    <div>
      works
    </div>
  )
}
