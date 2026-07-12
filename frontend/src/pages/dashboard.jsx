import { useState, useEffect } from 'react'
import { getDashboard, getTransaksi } from '../services/api'
import Navbar from '../components/Navbar'

export default function Dashboard() {
    const [ringkasan, setRingkasan] = useState(null)
    const [transaksi, setTransaksi] = useState([])
    const [loading, setLoading] = useState(true)

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

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(angka)
    }

    if (loading) return (
        <div className="min-h-screen bg-paper flex items-center justify-center">
            <p className="text-ink/40 text-sm">Memuat...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-paper">
            <Navbar active="dashboard" />

            <div className="p-4 sm:p-6 max-w-6xl mx-auto">
                <p className="text-xs tracking-[0.2em] uppercase text-forest font-semibold mb-1">Ringkasan</p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-6">Dashboard</h2>

                {/* Kartu ringkasan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-sm border border-rule px-6 py-5">
                        <p className="text-ink/50 text-xs uppercase tracking-wide mb-2">Total Pemasukan</p>
                        <p className="font-mono tabular-nums text-2xl font-semibold text-forest">
                            {formatRupiah(ringkasan?.total_pemasukan || 0)}
                        </p>
                        <div className="h-0.5 w-8 bg-forest mt-3" />
                    </div>
                    <div className="bg-white rounded-sm border border-rule px-6 py-5">
                        <p className="text-ink/50 text-xs uppercase tracking-wide mb-2">Total Pengeluaran</p>
                        <p className="font-mono tabular-nums text-2xl font-semibold text-clay">
                            {formatRupiah(ringkasan?.total_pengeluaran || 0)}
                        </p>
                        <div className="h-0.5 w-8 bg-clay mt-3" />
                    </div>
                    <div className="bg-ink rounded-sm px-6 py-5">
                        <p className="text-white/50 text-xs uppercase tracking-wide mb-2">Saldo</p>
                        <p className="font-mono tabular-nums text-2xl font-semibold text-white">
                            {formatRupiah(ringkasan?.saldo || 0)}
                        </p>
                        <div className="h-0.5 w-8 bg-white/40 mt-3" />
                    </div>
                </div>

                {/* Tabel transaksi */}
                <div className="bg-white rounded-sm border border-rule">
                    <div className="px-4 sm:px-6 py-4 border-b border-rule">
                        <h3 className="font-display text-lg font-semibold text-ink">Riwayat Transaksi</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-b border-rule">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Deskripsi</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-ink/40 uppercase tracking-wide">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaksi.map((t) => (
                                    <tr key={t.id_transaction} className="border-b border-rule last:border-0">
                                        <td className="px-6 py-3.5 text-sm text-ink/70">
                                            {new Date(t.tanggal).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-ink/70">{t.nama_kategori}</td>
                                        <td className={`px-6 py-3.5 text-sm text-ink border-l-2 ${t.tipe_transaction === 'pemasukan' ? 'border-forest' : 'border-clay'
                                            }`}>
                                            {t.deskripsi}
                                        </td>
                                        <td className={`px-6 py-3.5 text-sm font-mono tabular-nums text-right font-medium ${t.tipe_transaction === 'pemasukan' ? 'text-forest' : 'text-clay'
                                            }`}>
                                            {t.tipe_transaction === 'pengeluaran' ? '-' : '+'}
                                            {formatRupiah(t.jumlah)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {transaksi.length === 0 && (
                        <p className="text-center text-ink/40 text-sm py-10">Belum ada transaksi</p>
                    )}
                </div>
            </div>
        </div>
    )
}