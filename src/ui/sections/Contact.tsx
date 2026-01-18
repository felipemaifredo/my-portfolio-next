"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VscGithub } from "react-icons/vsc"
import { AiOutlineLinkedin } from "react-icons/ai"
import { GoPaperAirplane } from "react-icons/go"
import { LuBadgeCheck } from "react-icons/lu"
import { useTranslations } from "next-intl"
import styles from "./styles/contact.module.css"

const linkToFetch = "https://formsubmit.co/felipemaifredo@gmail.com"

const defaultForm = {
  name: "",
  whatsOrEmail: "",
  subject: "",
}

export const Contact = () => {
  const t = useTranslations("Contact")
  const [formData, setFormData] = useState(defaultForm)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name || !formData.whatsOrEmail || !formData.subject) {
      setMessage(t("errorEmpty"))
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
      return
    }

    setStatus("sending")

    try {
      const response = await fetch(linkToFetch, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _captcha: "false",
          _subject: "Novo Contato no Site!",
          Nome: formData.name,
          EmailWhatsapp: formData.whatsOrEmail,
          Assunto: formData.subject
        })
      })

      if (response.ok) {
        setStatus("success")
        setFormData(defaultForm)
        setTimeout(() => setStatus("idle"), 8000)
      } else {
        throw new Error("Falha ao enviar")
      }
    } catch (error) {
      setStatus("error")
      setMessage(t("errorGeneric"))
      setTimeout(() => setStatus("idle"), 5000)
    }
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
            <a href="https://github.com/felipemaifredo" target="_blank" rel="noopener noreferrer">
              <VscGithub />
            </a>
            <a href="https://www.linkedin.com/in/felipe-maifredo-aa8228198/" target="_blank" rel="noopener noreferrer">
              <AiOutlineLinkedin />
            </a>
          </motion.div>
        </motion.div>

        <motion.form
          id="form-contact"
          className={styles.form_container}
          onSubmit={sendEmail}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>{t("title")}</h2>

          <div className={styles.input_group}>
            <p>{t("nameLabel")}</p>
            <input
              className={styles.input_field}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t("namePlaceholder")}
            />
          </div>

          <div className={styles.input_group}>
            <p>{t("contactLabel")}</p>
            <input
              className={styles.input_field}
              type="text"
              value={formData.whatsOrEmail}
              onChange={(e) => setFormData({ ...formData, whatsOrEmail: e.target.value })}
              placeholder={t("contactPlaceholder")}
            />
          </div>

          <div className={styles.input_group}>
            <p>{t("subjectLabel")}</p>
            <input
              className={styles.input_field}
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder={t("subjectPlaceholder")}
            />
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={styles.submit_btn}
                style={{ backgroundColor: "#599636" }}
              >
                <LuBadgeCheck /> {t("success")}
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                type="submit"
                className={styles.submit_btn}
                disabled={status === "sending"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === "sending" ? t("sending") : t("send")}
                {status === "idle" && <GoPaperAirplane />}
              </motion.button>
            )}
          </AnimatePresence>

          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: "#ff4444", fontWeight: "600", textAlign: "center" }}
            >
              {message}
            </motion.p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
