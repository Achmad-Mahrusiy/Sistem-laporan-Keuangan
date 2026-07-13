import { useState, useEffect, useCallback } from 'react'
import { getLaporanBulanan, getTransaksi } from '../services/api'
import Navbar from '../components/Navbar'
import TrendChart from '../components/TrendChart'

export default function Laporan() {
    const [bulan, setBulan] = useState(
        new Date().toISOString().slice(0, 7) // default bulan ini
    )
    const [laporan, setLaporan] = useState(null)
    const [transaksi, setTransaksi] = useState([])
    const [trend, setTrend] = useState([])
    const [loading, setLoading] = useState(false)

    // Hasilkan 6 bulan berurutan, berakhir di bulan yang sedang dipilih
    const generateRentangBulan = (bulanAkhir, jumlah = 6) => {
        const hasil = []
        const [tahun, bulanAngka] = bulanAkhir.split('-').map(Number)
        for (let i = jumlah - 1; i >= 0; i--) {
            const tanggal = new Date(tahun, bulanAngka - 1 - i, 1)
            const ym = `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(2, '0')}`
            hasil.push(ym)
        }
        return hasil
    }

    const ambilData = useCallback(async () => {
        setLoading(true)
        try {
            const rentangBulan = generateRentangBulan(bulan, 6)

            const [laporanRes, transaksiRes, ...trendRes] = await Promise.all([
                getLaporanBulanan(bulan),
                getTransaksi(),
                ...rentangBulan.map((b) => getLaporanBulanan(b))
            ])

            setLaporan(laporanRes.data)

            const filtered = transaksiRes.data.filter(t =>
                t.tanggal.slice(0, 7) === bulan
            )
            setTransaksi(filtered)

            const dataTrend = rentangBulan.map((b, i) => ({
                bulan: b,
                pemasukan: Number(trendRes[i].data.total_pemasukan) || 0,
                pengeluaran: Number(trendRes[i].data.total_pengeluaran) || 0,
            }))
            setTrend(dataTrend)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [bulan])

    useEffect(() => {
        ambilData()
    }, [ambilData])

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(angka || 0)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar active="laporan" />

            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Laporan Keuangan</h2>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Pilih Bulan:</label>
                        <input
                            type="month"
                            value={bulan}
                            onChange={(e) => setBulan(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <>
                        {/* Grafik tren 6 bulan */}
                        <TrendChart data={trend} />

                        {/* Kartu ringkasan bulanan */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-500 text-sm">Total Pemasukan</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatRupiah(laporan?.total_pemasukan)}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-500 text-sm">Total Pengeluaran</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatRupiah(laporan?.total_pengeluaran)}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-500 text-sm">Selisih Bulan Ini</p>
                                <p className={`text-2xl font-bold ${(laporan?.total_pemasukan - laporan?.total_pengeluaran) >= 0
                                    ? 'text-blue-600'
                                    : 'text-red-600'
                                    }`}>
                                    {formatRupiah(
                                        (laporan?.total_pemasukan || 0) -
                                        (laporan?.total_pengeluaran || 0)
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Tabel transaksi bulan ini */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-4 sm:px-6 py-4 border-b">
                                <h3 className="text-base sm:text-lg font-semibold">
                                    Detail Transaksi — {new Date(bulan + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px]">
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
                            </div>
                            {transaksi.length === 0 && (
                                <p className="text-center text-gray-500 py-8">
                                    Tidak ada transaksi di bulan ini
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}