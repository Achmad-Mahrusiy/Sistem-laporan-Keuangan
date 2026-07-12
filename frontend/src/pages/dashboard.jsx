import { useState, useEffect } from 'react'
import { getDashboard, getTransaksi, getSaldo } from '../services/api'
import Navbar from '../components/Navbar'

export default function Dashboard() {
    const [ringkasan, setRingkasan] = useState(null)
    const [transaksi, setTransaksi] = useState([])
    const [loading, setLoading] = useState(true)

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        ambilData()
    }, [])

    const ambilData = async () => {
        try {
            const [ringkasanRes, transaksiRes] = await Promise.all([
                getDashboard(),
                getTransaksi()
            ])
            setRingkasan(ringkasanRes.data)
            setTransaksi(transaksiRes.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(angka)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar active="dashboard" />

            <div className="p-6">
                {/* Kartu ringkasan */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-500 text-sm">Total Pemasukan</p>
                        <p className="text-2xl font-bold text-green-600">
                            {formatRupiah(ringkasan?.total_pemasukan || 0)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-500 text-sm">Total Pengeluaran</p>
                        <p className="text-2xl font-bold text-red-600">
                            {formatRupiah(ringkasan?.total_pengeluaran || 0)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-500 text-sm">Saldo</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatRupiah(ringkasan?.saldo || 0)}
                        </p>
                    </div>
                </div>

                {/* Tabel transaksi */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold">Riwayat Transaksi</h2>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transaksi.map((t) => (
                                <tr key={t.id_transaction}>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {new Date(t.tanggal).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{t.nama_kategori}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{t.deskripsi}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.tipe_transaction === 'pemasukan'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {t.tipe_transaction}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-medium ${t.tipe_transaction === 'pemasukan'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                        }`}>
                                        {t.tipe_transaction === 'pengeluaran' ? '-' : '+'}
                                        {formatRupiah(t.jumlah)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {transaksi.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Belum ada transaksi</p>
                    )}
                </div>
            </div>
        </div>
    )
}