import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Transaksi from './pages/Transaksi'
import Kategori from './pages/Kategori'
import Laporan from './pages/Laporan'
import AdminUsers from './pages/AdminUsers'
import useAutoLogout from './hooks/useAutoLogout'


const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

function App() {
  useAutoLogout()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/transaksi" element={
          <PrivateRoute>
            <Transaksi />
          </PrivateRoute>
        } />
        <Route path="/kategori" element={
          <PrivateRoute>
            <Kategori />
          </PrivateRoute>
        } />
        <Route path="/laporan" element={
          <PrivateRoute>
            <Laporan />
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute>
            <AdminUsers />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;