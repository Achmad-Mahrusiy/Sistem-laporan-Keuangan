import { useState, useEffect } from 'react'
import { getKategori, tambahKategori, editKategori, hapusKategori } from '../services/api'
import Navbar from '../components/Navbar'

export default function Kategori() {
    const [kategori, setKategori] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editData, setEditData] = useState(null)
    const [form, setForm] = useState({
        nama: '',
        tipe_category: 'pemasukan'
    })

    useEffect(() => {
        ambilData()
    }, [])

    const ambilData = async () => {
        try {
            const res = await getKategori()
            setKategori(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editData) {
                await editKategori(editData.id_category, form)
            } else {
                await tambahKategori(form)
            }
            setShowForm(false)
            setEditData(null)
            setForm({ nama: '', tipe_category: 'pemasukan' })
            ambilData()
        } catch (err) {
            alert(err.response?.data?.message || 'Terjadi kesalahan')
        }
    }

    const handleEdit = (k) => {
        setEditData(k)
        setForm({
            nama: k.nama,
            tipe_category: k.tipe_category
        })
        setShowForm(true)
    }

    const handleHapus = async (id) => {
        if (!window.confirm('Yakin mau hapus kategori ini?')) return
        try {
            await hapusKategori(id)
            ambilData()
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus')
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar active="kategori" />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Manajemen Kategori</h2>
                    <button
                        onClick={() => {
                            setEditData(null)
                            setForm({ nama: '', tipe_category: 'pemasukan' })
                            setShowForm(true)
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                    >
                        + Tambah Kategori
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editData ? 'Edit Kategori' : 'Tambah Kategori'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                    <input
                                        type="text"
                                        value={form.nama}
                                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Masukkan nama kategori"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                    <select
                                        value={form.tipe_category}
                                        onChange={(e) => setForm({ ...form, tipe_category: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="pemasukan">Pemasukan</option>
                                        <option value="pengeluaran">Pengeluaran</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    {editData ? 'Simpan Perubahan' : 'Tambah'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabel */}
                <div className="bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kategori.map((k, index) => (
                                <tr key={k.id_category}>
                                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{k.nama}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${k.tipe_category === 'pemasukan'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {k.tipe_category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => handleEdit(k)}
                                            className="text-blue-600 hover:underline mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleHapus(k.id_category)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {kategori.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Belum ada kategori</p>
                    )}
                </div>
            </div>
        </div>
    )
}