import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)

// todos los componentes van a estar envueltos en este authContext, es decir todos
//van a tener acceso, ya que son hijos, a lo que devuelva este componente
//que dicho sea de paso es el primero que se carga en react, ya que es el primero, el padre
//en el return de app.jsx

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {

      //si no hay token, el hook user queda definido en null, y el hook del cargando loading, en false
      //y hace un return, haciendo que todo lo que esta abajo de esta funcion no se ejecute
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      //para llegar aca, se debe de tener un token
      try {
        const { data } = await api.get('/auth/perfil/')
        //metemos en el hook user, lo que responda la api, haciendo un get a esa url del perfil
        setUser(data)
      } 
      
      //para hacer un get a esa url del perfil, la api va a chequear que estemos logueados correctamente
      //asi que si entra en el catch, es porque nos reboto
      //en ese caso removemos del navegador todo token y usuario que pueda tener
      catch (error) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    cargar() //aca hacemos la carga inicial de esta funcion
  }, [token]) //y este useEffect se va a volver a ejecutar cada vez que cambie el hook token

  const guardarSesion = (userData, tokens) => {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokens.access)
    setUser(userData)
  }

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login/', { username, password })
    guardarSesion(data.user, data.tokens)
    return data
  }

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/registro/', { username, email, password })
    guardarSesion(data.user, data.tokens)
    return data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
