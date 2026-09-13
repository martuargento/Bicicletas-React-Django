import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from './api'
import { useAuth } from './AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' })
  const [imagen, setImagen] = useState(null)
  const [loading, setLoading] = useState(false)

  const cargarProductos = async () => {
    try {
      const { data } = await api.get('/productos/')
      setProductos(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('nombre', String(form.nombre).trim())
      formData.append('descripcion', form.descripcion || '')
      formData.append('precio', Number(form.precio))
      formData.append('stock', Number(form.stock))

      if (imagen) {
        formData.append('imagen', imagen)
      }

      await api.post('/productos/crear/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setForm({ nombre: '', descripcion: '', precio: '', stock: '' })
      setImagen(null)
      await cargarProductos()
    } catch (error) {
      const detalle = error.response?.data?.details || error.response?.data?.error || 'No se pudo guardar el producto.'
      console.error(detalle)
      alert(detalle)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/productos/${id}/eliminar/`)
      await cargarProductos()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
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

      <div className="dashboard-shell">
        <div className="dashboard-topbar">
          <div>
            <strong>Mi dashboard</strong>
          </div>
          <div className="dashboard-user-row">
            <span>Bienvenido, {user?.username}</span>
            <button type="button" className="dashboard-logout" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>

        <section className="dashboard-panel">
          <h2>Agregar producto</h2>
          <form onSubmit={handleSubmit} className="dashboard-form">
            <input name="nombre" value={form.nombre} placeholder="Nombre" onChange={handleChange} required />
            <input name="descripcion" value={form.descripcion} placeholder="Descripción" onChange={handleChange} />
            <input name="precio" type="number" step="0.01" value={form.precio} placeholder="Precio" onChange={handleChange} required />
            <input name="stock" type="number" value={form.stock} placeholder="Stock" onChange={handleChange} required />
            <label className="file-upload">
              <span>Seleccionar archivo</span>
              <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
            </label>
            <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          </form>
        </section>

        <section className="dashboard-products">
          <h2>Productos</h2>
          <div className="dashboard-grid">
            {productos.map((producto) => (
              <article key={producto.id} className="dashboard-card">
                <h3>{producto.nombre}</h3>
                <p className="muted">{producto.descripcion || 'Sin descripción'}</p>
                <p><strong>Precio:</strong> ${Number(producto.precio).toFixed(2)}</p>
                <p><strong>Stock:</strong> {producto.stock}</p>
                <div className="dashboard-actions">
                  <button type="button" className="dashboard-edit" onClick={() => navigate(`/editar/${producto.id}`)}>Editar</button>
                  <button type="button" className="dashboard-delete" onClick={() => handleDelete(producto.id)}>Eliminar</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
