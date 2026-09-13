import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from './api'

export default function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' })
  const [imagen, setImagen] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/productos/')
        const producto = data.find((item) => String(item.id) === String(id))
        if (producto) {
          setForm({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
          })
        }
      } catch (error) {
        console.error('Error cargando producto:', error)
      }
    }
    cargar()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('nombre', String(form.nombre).trim())
      formData.append('descripcion', form.descripcion || '')
      formData.append('precio', Number(form.precio))
      formData.append('stock', Number(form.stock))

      if (imagen) {
        formData.append('imagen', imagen)
      }

      await api.patch(`/productos/${id}/actualizar/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      navigate('/dashboard')
    } catch (error) {
      const detalle = error.response?.data?.details || error.response?.data?.error || 'No se pudo actualizar el producto.'
      console.error('Error actualizando producto:', detalle)
      alert(detalle)
    }
  }

  return (
    <div className="pagina-tiempo-real dashboard-page">
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
            <li><Link to="/contactanos">Contáctenos</Link></li>
          </ul>
        </div>

        <div className="redes-principal">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><img src="/icons/instagram.svg" alt="Instagram" /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><img src="/icons/facebook.svg" alt="Facebook" /></a>
        </div>
      </header>

      <div className="dashboard-shell edit-shell">
        <div className="dashboard-panel">
          <h2>Editar producto</h2>
          <form onSubmit={handleSubmit} className="dashboard-form dashboard-form-edit">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
            <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
            <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} placeholder="Precio" required />
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required />
            <label className="file-upload">
              <span>Seleccionar imagen nueva</span>
              <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
            </label>
            <div className="dashboard-actions edit-buttons">
              <button type="submit">Guardar cambios</button>
              <button type="button" className="dashboard-delete" onClick={() => navigate('/dashboard')}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
