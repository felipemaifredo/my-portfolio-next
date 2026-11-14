"use client"

import { useActionState, useEffect, useId, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VscGithub } from "react-icons/vsc"
import { AiOutlineLinkedin } from "react-icons/ai"
import { GoPaperAirplane } from "react-icons/go"
import { LuBadgeCheck } from "react-icons/lu"
import { useTranslations } from "next-intl"
import { sendContact, type ContactField, type ContactState } from "@/actions/contact"
import styles from "./styles/contact.module.css"

const initialState: ContactState = {
  status: "idle",
  fields: { name: "", whatsOrEmail: "", subject: "" },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

export const Contact = () => {
  const t = useTranslations("Contact")
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(sendContact, initialState)

  // Campos editados depois do último envio: some o erro deles e a mensagem de sucesso
  const [edited, setEdited] = useState<Set<ContactField>>(new Set())

  useEffect(() => {
    setEdited(new Set())
    // Leva o foco ao primeiro campo inválido devolvido pelo servidor
    const firstInvalid = state.invalid?.[0]
    if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
  }, [state])

  const markEdited = (field: ContactField) => {
    if (!edited.has(field)) setEdited((prev) => new Set(prev).add(field))
  }

  const isInvalid = (field: ContactField) => !!state.invalid?.includes(field) && !edited.has(field)
  const showSuccess = state.status === "success" && edited.size === 0
  const showError = state.status === "error" && !isPending && edited.size === 0

  const fieldProps = (field: ContactField) => ({
    id: `${uid}-${field}`,
    name: field,
    // Em caso de erro o servidor devolve o que foi digitado; o React restaura após o reset do formulário
    defaultValue: state.fields[field],
    onChange: () => markEdited(field),
    "aria-invalid": isInvalid(field) || undefined,
    "aria-describedby": isInvalid(field) ? `${uid}-${field}-error` : undefined,
    className: `${styles.input_field} ${isInvalid(field) ? styles.input_invalid : ""}`,
  })

  const fieldError = (field: ContactField) =>
    isInvalid(field) && (
      <span id={`${uid}-${field}-error`} className={styles.field_error}>
        {t("errorField")}
      </span>
    )

  return (
    <section id="contact" className={styles.contact_section}>
      <div className={styles.contact_wrapper}>
        <motion.div
          className={styles.text_box}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p className={styles.subtitle} variants={itemVariants}>
            {t.rich("subtitle", {
              brk: () => <br />
            })}
          </motion.p>
          <motion.div className={styles.social_links} variants={itemVariants}>
            <a href="https://github.com/felipemaifredo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <VscGithub aria-hidden />
            </a>
            <a href="https://www.linkedin.com/in/felipe-maifredo-aa8228198/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <AiOutlineLinkedin aria-hidden />
            </a>
          </motion.div>
        </motion.div>

        <motion.form
          ref={formRef}
          id="form-contact"
          className={styles.form_container}
          action={formAction}
          noValidate
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>{t("title")}</h2>

          {/* Honeypot anti-spam: invisível para pessoas, fora da ordem do Tab */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className={styles.honeypot} />

          <div className={styles.input_group}>
            <label htmlFor={`${uid}-name`}>{t("nameLabel")}</label>
            <input
              {...fieldProps("name")}
              type="text"
              autoComplete="name"
              required
              placeholder={t("namePlaceholder")}
            />
            {fieldError("name")}
          </div>

          <div className={styles.input_group}>
            <label htmlFor={`${uid}-whatsOrEmail`}>{t("contactLabel")}</label>
            <input
              {...fieldProps("whatsOrEmail")}
              type="text"
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              required
              placeholder={t("contactPlaceholder")}
            />
            {fieldError("whatsOrEmail")}
          </div>

          <div className={styles.input_group}>
            <label htmlFor={`${uid}-subject`}>{t("subjectLabel")}</label>
            <textarea
              {...fieldProps("subject")}
              rows={4}
              required
              placeholder={t("subjectPlaceholder")}
            />
            {fieldError("subject")}
          </div>

          <div aria-live="polite" className={styles.submit_area}>
            <AnimatePresence mode="wait" initial={false}>
              {showSuccess ? (
                <motion.p
                  key="success"
                  role="status"
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`${styles.submit_btn} ${styles.submit_success}`}
                >
                  <LuBadgeCheck aria-hidden /> {t("success")}
                </motion.p>
              ) : (
                <motion.button
                  key="btn"
                  type="submit"
                  className={styles.submit_btn}
                  disabled={isPending}
                  aria-busy={isPending}
                  whileTap={{ scale: 0.98 }}
                >
                  {isPending ? t("sending") : t("send")}
                  {!isPending && <GoPaperAirplane aria-hidden />}
                </motion.button>
              )}
            </AnimatePresence>

            {showError && (
              <motion.p
                role="alert"
                className={styles.form_error}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {state.error === "empty" ? t("errorEmpty") : t("errorGeneric")}
              </motion.p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  )
}
