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

    // const currentUser = JSON.parse(localStorage.getItem('user'))

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
        <div className="min-h-screen bg-paper flex items-center justify-center">
            <p className="text-ink/40 text-sm">Memuat...</p>
        </div>
    )

    const inputClass = "w-full border border-rule rounded-sm px-3 py-2 text-sm bg-paper/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
    const labelClass = "block text-xs font-medium text-ink/60 uppercase tracking-wide mb-1.5"

    return (
        <div className="min-h-screen bg-paper">
            <Navbar active="kategori" />

            <div className="p-4 sm:p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                    <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-forest font-semibold mb-1">Kelola</p>
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Kategori</h2>
                    </div>
                    <button
                        onClick={() => {
                            setEditData(null)
                            setForm({ nama: '', tipe_category: 'pemasukan' })
                            setShowForm(true)
                        }}
                        className="bg-forest text-white px-4 py-2 rounded-sm hover:bg-forest-dark font-medium w-full sm:w-auto transition-colors"
                    >
                        + Tambah Kategori
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-sm border border-rule p-4 sm:p-6 mb-6">
                        <h3 className="font-display text-lg font-semibold text-ink mb-4">
                            {editData ? 'Edit Kategori' : 'Tambah Kategori'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Nama Kategori</label>
                                    <input
                                        type="text"
                                        value={form.nama}
                                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                        className={inputClass}
                                        placeholder="Masukkan nama kategori"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Tipe</label>
                                    <select
                                        value={form.tipe_category}
                                        onChange={(e) => setForm({ ...form, tipe_category: e.target.value })}
                                        className={inputClass}
                                        required
                                    >
                                        <option value="pemasukan">Pemasukan</option>
                                        <option value="pengeluaran">Pengeluaran</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-5">
                                <button
                                    type="submit"
                                    className="bg-forest text-white px-6 py-2 rounded-sm hover:bg-forest-dark font-medium transition-colors"
                                >
                                    {editData ? 'Simpan Perubahan' : 'Tambah'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-transparent border border-rule text-ink/60 px-6 py-2 rounded-sm hover:bg-paper font-medium transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabel */}
                <div className="bg-white rounded-sm border border-rule overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="border-b border-rule">
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Tipe</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Sumber</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-ink/40 uppercase tracking-wide">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kategori.map((k, index) => (
                                <tr key={k.id_category} className="border-b border-rule last:border-0">
                                    <td className="px-6 py-3.5 text-sm text-ink/50 font-mono">{index + 1}</td>
                                    <td className={`px-6 py-3.5 text-sm text-ink border-l-2 ${k.tipe_category === 'pemasukan' ? 'border-forest' : 'border-clay'
                                        }`}>
                                        {k.nama}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm">
                                        <span className={`text-xs font-medium uppercase tracking-wide ${k.tipe_category === 'pemasukan' ? 'text-forest' : 'text-clay'
                                            }`}>
                                            {k.tipe_category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm">
                                        {k.id_user === null ? (
                                            <span className="text-xs text-ink/35 italic">Bawaan</span>
                                        ) : (
                                            <span className="text-xs text-forest">Milik saya</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-right whitespace-nowrap">
                                        {k.id_user !== null ? (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(k)}
                                                    className="text-ink/60 hover:text-forest mr-3 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleHapus(k.id_category)}
                                                    className="text-ink/60 hover:text-clay transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-ink/25">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {kategori.length === 0 && (
                        <p className="text-center text-ink/40 text-sm py-10">Belum ada kategori</p>
                    )}
                </div>
            </div>
        </div>
    )
}