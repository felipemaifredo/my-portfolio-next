/**
 * Trechos digitados pelo CodeTyping no hero.
 * Use só espaços (sem tab), linhas curtas (até ~60 caracteres) e sem comentários de várias linhas.
 * Nada de dados sensíveis aqui: isso aparece na tela.
 */
export type CodeSnippet = { file: string; code: string }

export const CODE_SNIPPETS: CodeSnippet[] = [
    {
        file: "actions/contact.ts",
        code: `"use server"

export async function sendContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const fields = readFields(formData)

  // Honeypot: só robôs preenchem
  if (formData.get("website")) {
    return { status: "success", fields: empty() }
  }

  const invalid = FIELDS.filter((f) => !fields[f])
  if (invalid.length) {
    return { status: "error", error: "empty", invalid }
  }

  try {
    await deliver(fields)
    return { status: "success", fields: empty() }
  } catch (error) {
    console.error("[contact]", error)
    return { status: "error", error: "generic", fields }
  }
}`,
    },
    {
        file: "components/Nav.tsx",
        code: `export const Nav = () => {
  const [active, setActive] = useState("hero_section")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label={t("navLabel")}>
      {links.map((link) => (
        <NavLink key={link.id} active={active === link.id} />
      ))}
    </nav>
  )
}`,
    },
    {
        file: "server/routes/orders.ts",
        code: `import { Elysia, t } from "elysia"
import { db } from "../lib/firebase"

export const orders = new Elysia({ prefix: "/orders" })
  .get("/:id", async ({ params, error }) => {
    const doc = await db.collection("orders").doc(params.id).get()
    if (!doc.exists) return error(404, "Order not found")
    return { id: doc.id, ...doc.data() }
  })
  .post("/", async ({ body }) => {
    const ref = await db.collection("orders").add({
      ...body,
      status: "pending",
      createdAt: Date.now(),
    })
    return { id: ref.id }
  }, {
    body: t.Object({
      customerId: t.String(),
      items: t.Array(t.Object({ sku: t.String(), qty: t.Number() })),
    }),
  })`,
    },
    {
        file: "components/ShowcaseGrid.tsx",
        code: `export const ShowcaseGrid = ({ title, items }: Props) => {
  const [filter, setFilter] = useState("All")

  const tags = ["All", ...new Set(items.flatMap((i) => i.tags))]
  const visible = filter === "All"
    ? items
    : items.filter((i) => i.tags.includes(filter))

  return (
    <section>
      <h1>{title}</h1>
      <div role="group" aria-label="Filter">
        {tags.map((tag) => (
          <button
            key={tag}
            aria-pressed={filter === tag}
            onClick={() => setFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <Grid items={visible} />
    </section>
  )
}`,
    },
    {
        file: "lib/useDebounce.ts",
        code: `import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

// Busca só depois que a pessoa para de digitar
const query = useDebounce(search, 400)
const { data } = useSWR(query ? \`/api/search?q=\${query}\` : null)`,
    },
]
