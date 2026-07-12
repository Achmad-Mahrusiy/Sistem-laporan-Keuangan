import axios from 'axios'

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

console.log('API URL:', process.env.REACT_APP_API_URL)

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const login = (data) => API.post('/auth/login', data)
export const register = (data) => API.post('/auth/register', data)
export const getTransaksi = () => API.get('/transaksi')
export const tambahTransaksi = (data) => API.post('/transaksi', data)
export const editTransaksi = (id, data) => API.put(`/transaksi/${id}`, data)
export const hapusTransaksi = (id) => API.delete(`/transaksi/${id}`)
export const getKategori = () => API.get('/kategori')
export const tambahKategori = (data) => API.post('/kategori', data)
export const editKategori = (id, data) => API.put(`/kategori/${id}`, data)
export const hapusKategori = (id) => API.delete(`/kategori/${id}`)
export const getDashboard = () => API.get('/laporan/dashboard')
export const getLaporanBulanan = (bulan) => API.get(`/laporan/bulanan/${bulan}`)
export const getSaldo = () => API.get('/laporan/saldo')