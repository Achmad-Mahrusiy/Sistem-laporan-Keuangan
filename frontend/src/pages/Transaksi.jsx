import { useState, useEffect } from 'react'
import { getTransaksi, tambahTransaksi, editTransaksi, hapusTransaksi } from '../services/api'
import Navbar from '../components/Navbar'
import TransaksiList from '../components/TransaksiList'
import useBackToDashboard from '../hooks/useBackToDashboard'

export default function Transaksi() {
    useBackToDashboard()

    const [transaksi, setTransaksi] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editData, setEditData] = useState(null)
    const [filterTipe, setFilterTipe] = useState('semua')
    const [filterBulan, setFilterBulan] = useState('')
    const [form, setForm] = useState({
        kategori: '',
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
            const res = await getTransaksi()
            setTransaksi(res.data)
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
                kategori: '',
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
            kategori: t.nama_kategori,
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

    // Terapkan filter tipe & bulan ke data transaksi.
    // Tidak perlu request baru ke backend — cukup saring array yang sudah ada.
    const transaksiTerfilter = transaksi.filter((t) => {
        const cocokTipe = filterTipe === 'semua' || t.tipe_transaction === filterTipe
        const cocokBulan = filterBulan === '' || t.tanggal.slice(0, 7) === filterBulan
        return cocokTipe && cocokBulan
    })

    const adaFilterAktif = filterTipe !== 'semua' || filterBulan !== ''

    const resetFilter = () => {
        setFilterTipe('semua')
        setFilterBulan('')
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
            <Navbar active="transaksi" />

            <div className="p-4 sm:p-6 max-w-6xl mx-auto animate-fade-in-up">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                    <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-forest font-semibold mb-1">Catatan</p>
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Transaksi</h2>
                    </div>
                    <button
                        onClick={() => {
                            setEditData(null)
                            setForm({
                                kategori: '',
                                jumlah: '',
                                tipe_transaction: 'pemasukan',
                                deskripsi: '',
                                tanggal: ''
                            })
                            setShowForm(true)
                        }}
                        className="bg-forest text-white px-4 py-2 rounded-sm hover:bg-forest-dark hover:-translate-y-0.5 active:translate-y-0 font-medium w-full sm:w-auto transition-all duration-200"
                    >
                        + Tambah Transaksi
                    </button>
                </div>

                {/* Filter tipe & bulan */}
                <div className="bg-white rounded-sm border border-rule p-3 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-end gap-3">
                    <div className="flex-1">
                        <label className={labelClass}>Tipe</label>
                        <select
                            value={filterTipe}
                            onChange={(e) => setFilterTipe(e.target.value)}
                            className={inputClass}
                        >
                            <option value="semua">Semua</option>
                            <option value="pemasukan">Pemasukan</option>
                            <option value="pengeluaran">Pengeluaran</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className={labelClass}>Bulan</label>
                        <input
                            type="month"
                            value={filterBulan}
                            onChange={(e) => setFilterBulan(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    {adaFilterAktif && (
                        <button
                            onClick={resetFilter}
                            className="text-sm text-ink/50 hover:text-clay underline underline-offset-2 transition-colors sm:pb-2.5 whitespace-nowrap"
                        >
                            Reset filter
                        </button>
                    )}
                </div>

                {/* Form tambah/edit */}
                {showForm && (
                    <div className="bg-white rounded-sm border border-rule p-4 sm:p-6 mb-6 animate-scale-in origin-top">
                        <h3 className="font-display text-lg font-semibold text-ink mb-4">
                            {editData ? 'Edit Transaksi' : 'Tambah Transaksi'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Kategori</label>
                                    <input
                                        type="text"
                                        value={form.kategori}
                                        onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                                        className={inputClass}
                                        placeholder="Contoh: Makan, Uang Saku"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Tipe</label>
                                    <select
                                        value={form.tipe_transaction}
                                        onChange={(e) => setForm({ ...form, tipe_transaction: e.target.value })}
                                        className={inputClass}
                                        required
                                    >
                                        <option value="pemasukan">Pemasukan</option>
                                        <option value="pengeluaran">Pengeluaran</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Jumlah</label>
                                    <input
                                        type="number"
                                        value={form.jumlah}
                                        onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                                        className={`${inputClass} font-mono`}
                                        placeholder="Masukkan jumlah"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Tanggal</label>
                                    <input
                                        type="date"
                                        value={form.tanggal}
                                        onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Catatan</label>
                                    <input
                                        type="text"
                                        value={form.deskripsi}
                                        onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                        className={inputClass}
                                        placeholder="Masukkan catatan"
                                    />
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

                {/* Tabel transaksi */}
                <div className="bg-white rounded-sm border border-rule">
                    <TransaksiList
                        transaksi={transaksiTerfilter}
                        formatRupiah={formatRupiah}
                        onEdit={handleEdit}
                        onHapus={handleHapus}
                    />
                </div>
            </div>
        </div>
    )
}