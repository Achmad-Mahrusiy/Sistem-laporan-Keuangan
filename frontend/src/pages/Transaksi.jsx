import { useState, useEffect } from 'react'
import { getTransaksi, tambahTransaksi, editTransaksi, hapusTransaksi, getKategori } from '../services/api'
import Navbar from '../components/Navbar'

export default function Transaksi() {
    const [transaksi, setTransaksi] = useState([])
    const [kategori, setKategori] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editData, setEditData] = useState(null)
    const [form, setForm] = useState({
        id_category: '',
        jumlah: '',
        tipe_transaction: 'pemasukan',
        deskripsi: '',
        tanggal: ''
    })

    useEffect(() => {
        ambilData()
    }, [])

    const ambilData = async () => {
        try {
            const [transaksiRes, kategoriRes] = await Promise.all([
                getTransaksi(),
                getKategori()
            ])
            setTransaksi(transaksiRes.data)
            setKategori(kategoriRes.data)
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
                await editTransaksi(editData.id_transaction, form)
            } else {
                await tambahTransaksi(form)
            }
            setShowForm(false)
            setEditData(null)
            setForm({
                id_category: '',
                jumlah: '',
                tipe_transaction: 'pemasukan',
                deskripsi: '',
                tanggal: ''
            })
            ambilData()
        } catch (err) {
            alert(err.response?.data?.message || 'Terjadi kesalahan')
        }
    }

    const handleEdit = (t) => {
        setEditData(t)
        setForm({
            id_category: t.id_category,
            jumlah: t.jumlah,
            tipe_transaction: t.tipe_transaction,
            deskripsi: t.deskripsi,
            tanggal: t.tanggal.split('T')[0]
        })
        setShowForm(true)
    }

    const handleHapus = async (id) => {
        if (!window.confirm('Yakin mau hapus transaksi ini?')) return
        try {
            await hapusTransaksi(id)
            ambilData()
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus')
        }
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
            <Navbar active="transaksi" />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Manajemen Transaksi</h2>
                    <button
                        onClick={() => {
                            setEditData(null)
                            setForm({
                                id_category: '',
                                jumlah: '',
                                tipe_transaction: 'pemasukan',
                                deskripsi: '',
                                tanggal: ''
                            })
                            setShowForm(true)
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                    >
                        + Tambah Transaksi
                    </button>
                </div>

                {/* Form tambah/edit */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editData ? 'Edit Transaksi' : 'Tambah Transaksi'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        value={form.id_category}
                                        onChange={(e) => setForm({ ...form, id_category: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        {kategori.map((k) => (
                                            <option key={k.id_category} value={k.id_category}>
                                                {k.nama} ({k.tipe_category})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                    <select
                                        value={form.tipe_transaction}
                                        onChange={(e) => setForm({ ...form, tipe_transaction: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="pemasukan">Pemasukan</option>
                                        <option value="pengeluaran">Pengeluaran</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                                    <input
                                        type="number"
                                        value={form.jumlah}
                                        onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Masukkan jumlah"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                    <input
                                        type="date"
                                        value={form.tanggal}
                                        onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                    <input
                                        type="text"
                                        value={form.deskripsi}
                                        onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Masukkan deskripsi"
                                    />
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

                {/* Tabel transaksi */}
                <div className="bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
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
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => handleEdit(t)}
                                            className="text-blue-600 hover:underline mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleHapus(t.id_transaction)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Hapus
                                        </button>
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