import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from './api'

const IMAGEN_FALLBACK = 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80'

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('bicicleal-cart') || '[]')
  } catch {
    return []
  }
}

const formatNumber = (value) => Number(value || 0)

export default function Tienda() {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState(getCart())
  const [cotizacion, setCotizacion] = useState(1100)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const { data } = await api.get('/productos/')
        setProductos(
          data.map((producto) => ({
            ...producto,
            imagen: producto.imagen ? `http://localhost:8000${producto.imagen}` : IMAGEN_FALLBACK,
          }))
        )
      } catch (error) {
        console.error('Error al cargar productos:', error)
      }
    }

    cargarProductos()
  }, [])

  useEffect(() => {
    localStorage.setItem('bicicleal-cart', JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        const res = await fetch('https://api.bluelytics.com.ar/v2/latest')
        const data = await res.json()
        if (data?.oficial?.value_sell) {
          setCotizacion(data.oficial.value_sell)
        }
      } catch {
        setCotizacion(1100)
      }
    }

    fetchCotizacion()
  }, [])

  const totalItems = useMemo(
    () => carrito.reduce((sum, item) => sum + Number(item.cantidad || 0), 0),
    [carrito]
  )

  const totalAr = useMemo(
    () => carrito.reduce((sum, item) => sum + Number(item.precio || 0) * Number(item.cantidad || 0), 0),
    [carrito]
  )

  const totalUsd = useMemo(
    () => Math.round(totalAr / (cotizacion || 1)),
    [totalAr, cotizacion]
  )

  const addToCart = (producto) => {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id)
      if (existente) {
        return actual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }

      return [
        ...actual,
        {
          id: producto.id,
          titulo: producto.nombre,
          precio: Number(producto.precio || 0),
          precioUsd: Math.round(Number(producto.precio || 0) / (cotizacion || 1)),
          cantidad: 1,
        },
      ]
    })
    setMenuOpen(true)
  }

  const removerDelCarrito = (id) => {
    setCarrito((actual) => actual.filter((item) => item.id !== id))
  }

  const vaciarCarrito = () => setCarrito([])

  const formatearPrecio = (valor) => `$${formatNumber(valor).toLocaleString('es-AR')}`

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
            <li className="active"><Link to="/">Productos</Link></li>
            <li><Link to="/nuestra-historia">Nuestra historia</Link></li>
            <li><Link to="/contactanos">Contáctenos</Link></li>
          </ul>
        </div>

        <div className="redes-principal">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><img src="/icons/instagram.svg" alt="Instagram" /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><img src="/icons/facebook.svg" alt="Facebook" /></a>
        </div>

        <div className="contenedor-carrito">
          <div className="contenedor-carrito-icono" onClick={() => setMenuOpen((valor) => !valor)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icono-carrito">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <div className="contador-productos">
              <span id="contador-productos">{totalItems}</span>
            </div>
          </div>

          <div className={`contenedor-productos-carrito ${menuOpen ? '' : 'ocultar'}`}>
            <div className="fila-de-un-producto">
              {carrito.length === 0 ? (
                <p className="carrito-vacio">El carrito esta vacio</p>
              ) : (
                carrito.map((item) => (
                  <div className="producto-seleccionado" key={item.id}>
                    <div className="info-producto-seleccionado">
                      <span className="cantidad-producto-seleccionado">{item.cantidad}</span>
                      <p className="titulo-producto-seleccionado">{item.titulo}</p>
                      <div className="contenedor-productos-sel">
                        <span className="precio-producto-seleccionado">{formatearPrecio(item.precio * item.cantidad)}</span>
                        <span className="precio-producto-seleccionado-usd">USD {Math.round((item.precio * item.cantidad) / (cotizacion || 1))}</span>
                      </div>
                    </div>
                    <svg onClick={() => removerDelCarrito(item.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icono-cerrar">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <>
                <div className="carrito-total">
                  <h3>Total:</h3>
                  <span className="total-pagar">{formatearPrecio(totalAr)}</span>
                  <span className="total-pagar-usd">USD {totalUsd}</span>
                </div>
                <div className="comprar">
                  <button className="boton-comprar" onClick={vaciarCarrito}>Comprar</button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="contenedor-productos-ofrecidos container-main">
        {productos.length === 0 ? (
          <div className="empty-state">No hay productos cargados todavía.</div>
        ) : (
          productos.map((producto) => {
            const precioUsd = Math.round(Number(producto.precio || 0) / (cotizacion || 1))

            return (
              <div className="item" key={producto.id}>
                <figure>
                  <img src={producto.imagen} alt={producto.nombre} className="imagen" />
                  <div className="superposicion" />
                </figure>

                <div className="info-producto-ofrecido">
                  <h2>{producto.nombre}</h2>
                  <div className="contenedor-precio">
                    <p className="precio">{formatearPrecio(producto.precio)}</p>
                    <p className="precio_usd">USD {precioUsd}</p>
                  </div>
                  <button className="btn-agregar-carrito" onClick={() => addToCart(producto)}>
                    Añadir al carrito
                  </button>
                </div>
              </div>
            )
          })
        )}
      </main>

      <footer>
        <hr />
        <small> ©2026 Mayorista Bicileal </small>
      </footer>
    </div>
  )
}
