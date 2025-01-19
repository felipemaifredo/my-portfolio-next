"use client"
//imports
import "./Styles/Contact.style.css"
import React, { useState } from "react"
import { VscGithub } from "react-icons/vsc"
import { AiOutlineLinkedin } from "react-icons/ai"
import { GoPaperAirplane } from "react-icons/go"
import { Observer } from "../components/Observer/observer"

//Configs
const linkToFetch = "https://formsubmit.co/felipemaifredo@gmail.com"

export const Contact = () => {
  const [textBTN, setTextBTN] = useState("Enviar")
  const [formData, setFormData] = useState({
    name: "",
    whatsOrEmail: "",
    subject: "",
  })

  function sendEmail(e: any) {
    e.preventDefault()
    if ( !formData.name || !formData.whatsOrEmail || !formData.subject ) {
      setTextBTN("Preecha todos os campos acima")
      setTimeout( () => {
        setTextBTN("Enviar")
      }, 5000)
    } else {
      setTextBTN("Enviado...")
      fetch(linkToFetch, {
        method: "post",
        headers: { "Accept": "aplication/json", "Content-Type": "application/json" },
        body: JSON.stringify({ 
          _captcha: "false",
          _subject: "Novo Contato no Site!",
          Nome: formData.name,
          EmailWhatsapp: formData.whatsOrEmail,
          Assunto: formData.subject
        })
      }).then(() => {
        setTextBTN("Mensagem Enviada!")
        setTimeout(() => {
          clearForm()
          setTextBTN("Enviar")
        }, 5000)
      })
    }   
  }

  function clearForm() {
    setFormData({
      name: "",
      whatsOrEmail: "",
      subject: ""
    })
  }

  return (
    <section id="contact">
      <div className="text-box-contact">
        <Observer threshold={[0, 0.5, 1]}> 
          <p className="subtitle  init-hidden texts-contact">Vamos <br></br>trabalhar<br></br>juntos!</p>
        </Observer>
        <Observer threshold={[0, 0.5, 1]}>  
          <div className="social-links-box  init-hidden">
            <a href="https://github.com/felipemaifredo" target="_blanck" rel="nofollow"> <VscGithub /> </a>
            <a href="https://www.linkedin.com/in/felipe-maifredo-aa8228198/" target="_blanck" rel="nofollow"> <AiOutlineLinkedin /> </a>
          </div>
        </Observer>
      </div>
      <form id="form-contact" onSubmit={ sendEmail } >
        <Observer threshold={[0, 0.5, 1]}> 
          <h2 className="init-hidden texts-contact">Entre em contato</h2>
        </Observer>
        <Observer threshold={[0, 0.5, 1]}> 
          <label className="init-hidden">
            <p className="texts-contact">Nome</p>  
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </label>
        </Observer>
        <Observer threshold={[0, 0.5, 1]}> 
          <label className="init-hidden">
            <p className="texts-contact">Whatsapp ou Email</p>  
            <input type="text" value={formData.whatsOrEmail} onChange={(e) => setFormData({ ...formData, whatsOrEmail: e.target.value })} />
          </label>
        </Observer>
        <Observer threshold={[0, 0.5, 1]}> 
          <label className="init-hidden">
            <p className="texts-contact">Assunto</p>  
            <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
          </label>
        </Observer>
        <div className="btn-box-form-contact">
          <Observer threshold={[0, 0.5, 1]}> 
            <button type="submit" id="btn-form-contact" className="init-hidden">
              <span className="texts-contact">{textBTN}</span> 
              {textBTN === "Enviar" && ( <GoPaperAirplane /> )}
            </button>
          </Observer>
        </div>
      </form>
    </section>
  )
}
