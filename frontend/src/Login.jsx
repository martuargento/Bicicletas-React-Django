import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (isRegister) {
        await register(form.username, form.email, form.password)
      } else {
        await login(form.username, form.password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Hubo un error al iniciar sesión.')
    }
  }

  return (
    <div className="container">
      <div className="auth-card">
        <h1>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
        <p className="muted">Acceso con JWT + Django REST Framework</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            required
          />

          {isRegister && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p style={{ color: 'crimson' }}>{error}</p>}

          <button type="submit">{isRegister ? 'Registrarme' : 'Entrar'}</button>
          <button type="button" className="secondary" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Ya tengo cuenta' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
