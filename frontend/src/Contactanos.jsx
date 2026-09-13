import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialForm = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  mensaje: '',
}

export default function Contactanos() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [enviado, setEnviado] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validar = () => {
    const nextErrors = {}

    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.'
    if (!form.apellido.trim()) nextErrors.apellido = 'El apellido es obligatorio.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Ingresá un email válido.'
    }
    if (!form.telefono.trim() || form.telefono.trim().length < 8) {
      nextErrors.telefono = 'Ingresá un teléfono válido.'
    }
    if (!form.mensaje.trim() || form.mensaje.trim().length < 10) {
      nextErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
    }

    return nextErrors
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validar()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setEnviado(false)
      return
    }

    setEnviado(true)
    setForm(initialForm)
  }

  return (
    <div className="pagina-tiempo-real">
      <header className="site-header">
        <div id="logo">
          <Link to="/">
            <img src="/Logoheader.jpg" alt="Logo Bicileal" />
          </Link>
        </div>

        <div className="secciones">
          <ul>
            <li><Link to="/">Productos</Link></li>
            <li><Link to="/nuestra-historia">Nuestra historia</Link></li>
            <li className="active"><Link to="/contactanos">Contáctenos</Link></li>
          </ul>
        </div>

        <div className="redes-principal">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><img src="/icons/instagram.svg" alt="Instagram" /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><img src="/icons/facebook.svg" alt="Facebook" /></a>
        </div>
      </header>

      <div className="page-shell contact-page">
        <div className="page-card">
          <h1>Contáctanos</h1>

          <h2 className="contactanosh2">Mensajeenos por las Redes Sociales</h2>
          <div className="redes-sociales">
            <button className="boton-redes" type="button"><i className="fa-brands fa-instagram icoinstagram" /> Instagram</button>
            <button className="boton-redes" type="button"><i className="fa-brands fa-facebook icofacebook" /> Facebook</button>
            <button className="boton-redes" type="button"><i className="fa-brands fa-whatsapp icowhatsapp" /> Whatsapp</button>
            <button className="boton-redes" type="button"><i className="fa-brands fa-telegram icotelegram" /> Telegram</button>
            <button className="boton-redes" type="button"><i className="fa-brands fa-tiktok icotiktok" /> Tiktok</button>
          </div>

          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <div className="nombreyapellido">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={onChange} />
              {errors.nombre && <small>{errors.nombre}</small>}
            </div>

            <div className="apellido">
              <label htmlFor="apellido">Apellido</label>
              <input id="apellido" name="apellido" type="text" value={form.apellido} onChange={onChange} />
              {errors.apellido && <small>{errors.apellido}</small>}
            </div>

            <div className="email">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange} />
              {errors.email && <small>{errors.email}</small>}
            </div>

            <div className="telefono">
              <label htmlFor="telefono">Número de teléfono</label>
              <input id="telefono" name="telefono" type="tel" value={form.telefono} onChange={onChange} />
              {errors.telefono && <small>{errors.telefono}</small>}
            </div>

            <div className="mensaje">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" name="mensaje" rows="5" value={form.mensaje} onChange={onChange} />
              {errors.mensaje && <small>{errors.mensaje}</small>}
            </div>

            <button type="submit" className="submit-btn">Enviar</button>
            <button type="reset" className="submit-btn secondary" onClick={() => setErrors({})}>Borrar</button>
            {enviado && <p className="success-msg">Tu mensaje fue enviado correctamente.</p>}
          </form>

          <h2 className="contactanosh2 mt-4">Ubicación</h2>
          <p>Suipacha 559, CABA, Buenos aires</p>
          <p>Lunes a Viernes de 10 a 18 hs.</p>
          <div className="mapa">
            <iframe
              title="Mapa de Bicileal"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6568.184639622229!2d-58.37955661515478!3d-34.60182696176064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1683867814842!5m2!1ses!2sar"
              width="600"
              height="450"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
