import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Login from './Login'
import RutaProtegida from './RutaProtegida'
import Tienda from './Tienda'
import Dashboard from './Dashboard'
import EditarProducto from './EditarProducto'
import NuestraHistoria from './NuestraHistoria'
import Contactanos from './Contactanos'
import Carrito from './Carrito'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/nuestra-historia" element={<NuestraHistoria />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          }
        />

        <Route
          path="/editar/:id"
          element={
            <RutaProtegida>
              <EditarProducto />
            </RutaProtegida>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
