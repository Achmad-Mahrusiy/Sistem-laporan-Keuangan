import { useState, useEffect, useCallback } from 'react'
import { getLaporanBulanan, getTransaksi } from '../services/api'
import Navbar from '../components/Navbar'
import TrendChart from '../components/TrendChart'
import CategoryPieChart from '../components/CategoryPieChart'
import TransaksiList from '../components/TransaksiList'

export default function Laporan() {
    const user = JSON.parse(localStorage.getItem('user'))
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

            const [laporanRes, transaksiRes] = await Promise.all([
                getLaporanBulanan(bulan),
                getTransaksi()
            ])

            setLaporan(laporanRes.data)

            const semuaTransaksi = transaksiRes.data

            const filtered = semuaTransaksi.filter(t =>
                t.tanggal.slice(0, 7) === bulan
            )
            setTransaksi(filtered)

            // Bangun data tren 6 bulan LANGSUNG dari data transaksi yang sudah kita punya —
            // tidak perlu 6x request tambahan ke backend seperti sebelumnya.
            // Sekalian hitung breakdown per kategori, supaya grafiknya bisa di-stack.
            const dataTrend = rentangBulan.map((b) => {
                const transaksiBulanIni = semuaTransaksi.filter(t => t.tanggal.slice(0, 7) === b)

                const kelompokkanPerKategori = (tipe) => {
                    const hasil = {}
                    transaksiBulanIni
                        .filter(t => t.tipe_transaction === tipe)
                        .forEach(t => {
                            const nama = t.nama_kategori || 'Lainnya'
                            hasil[nama] = (hasil[nama] || 0) + Number(t.jumlah)
                        })
                    return hasil
                }

                const kategoriPemasukan = kelompokkanPerKategori('pemasukan')
                const kategoriPengeluaran = kelompokkanPerKategori('pengeluaran')

                return {
                    bulan: b,
                    pemasukan: Object.values(kategoriPemasukan).reduce((a, v) => a + v, 0),
                    pengeluaran: Object.values(kategoriPengeluaran).reduce((a, v) => a + v, 0),
                    kategoriPemasukan,
                    kategoriPengeluaran,
                }
            })
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

    const handleExportPDF = () => {
        window.print()
    }

    const selisih = (laporan?.total_pemasukan || 0) - (laporan?.total_pengeluaran || 0)

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="print:hidden">
                <Navbar active="laporan" />
            </div>

            <div className="p-4 sm:p-6 animate-fade-in-up">
                {/* Header — hanya tampil di layar, laporan cetak punya kop sendiri */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 print:hidden">
                    <h2 className="text-xl font-bold text-gray-800">Laporan Keuangan</h2>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Pilih Bulan:</label>
                        <input
                            type="month"
                            value={bulan}
                            onChange={(e) => setBulan(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                        />
                        <button
                            onClick={handleExportPDF}
                            className="bg-ink text-white px-4 py-2 rounded text-sm font-medium hover:bg-ink/80 transition-colors whitespace-nowrap"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <>
                        {/* Tampilan layar — dashboard interaktif, tidak ikut tercetak */}
                        <div className="print:hidden">
                            {/* Grafik lingkaran kategori (kiri) + tren 6 bulan (kanan) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-0">
                                <CategoryPieChart transaksi={transaksi} tipe="pengeluaran" />
                                <TrendChart data={trend} />
                            </div>

                            {/* Kartu ringkasan bulanan */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                                <div className="bg-white rounded-lg shadow p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                    <p className="text-gray-500 text-sm">Total Pemasukan</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatRupiah(laporan?.total_pemasukan)}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg shadow p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                    <p className="text-gray-500 text-sm">Total Pengeluaran</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatRupiah(laporan?.total_pengeluaran)}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg shadow p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                    <p className="text-gray-500 text-sm">Selisih Bulan Ini</p>
                                    <p className={`text-2xl font-bold ${selisih >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                        {formatRupiah(selisih)}
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
                                <TransaksiList transaksi={transaksi} formatRupiah={formatRupiah} />
                            </div>
                        </div>

                        {/* Tampilan cetak — layout laporan resmi gaya slip bulanan, cuma muncul saat Export PDF */}
                        <div className="hidden print:block text-black">
                            <div className="flex justify-between items-end border-b-2 border-black pb-3 mb-5">
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight">BUKU KAS</h1>
                                    <p className="text-xs text-gray-600">Laporan Keuangan Bulanan</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {new Date(bulan + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wide">Nama</p>
                                    <p className="font-medium">{user?.username}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wide">Periode</p>
                                    <p className="font-medium">
                                        {new Date(bulan + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Ringkasan mirip slip gaji: pemasukan, pengeluaran, saldo bersih */}
                            <table className="w-full text-sm border border-black mb-6">
                                <tbody>
                                    <tr className="border-b border-black">
                                        <td className="py-2 px-3">Total Pemasukan</td>
                                        <td className="py-2 px-3 text-right">{formatRupiah(laporan?.total_pemasukan)}</td>
                                    </tr>
                                    <tr className="border-b border-black">
                                        <td className="py-2 px-3">Total Pengeluaran</td>
                                        <td className="py-2 px-3 text-right">{formatRupiah(laporan?.total_pengeluaran)}</td>
                                    </tr>
                                    <tr className="bg-gray-100 font-bold">
                                        <td className="py-2 px-3">Saldo Bersih</td>
                                        <td className="py-2 px-3 text-right">{formatRupiah(selisih)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p className="text-sm font-semibold mb-2">Rincian Transaksi</p>
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-black">
                                        <th className="text-left py-1.5 px-2">Tanggal</th>
                                        <th className="text-left py-1.5 px-2">Kategori</th>
                                        <th className="text-left py-1.5 px-2">Catatan</th>
                                        <th className="text-left py-1.5 px-2">Tipe</th>
                                        <th className="text-right py-1.5 px-2">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaksi.map((t) => (
                                        <tr key={t.id_transaction} className="border-b border-gray-300">
                                            <td className="py-1.5 px-2">
                                                {new Date(t.tanggal).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="py-1.5 px-2">{t.nama_kategori}</td>
                                            <td className="py-1.5 px-2">{t.deskripsi || '-'}</td>
                                            <td className="py-1.5 px-2 capitalize">{t.tipe_transaction}</td>
                                            <td className="py-1.5 px-2 text-right">{formatRupiah(t.jumlah)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {transaksi.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-6">
                                    Tidak ada transaksi di bulan ini
                                </p>
                            )}

                            <p className="text-xs text-gray-400 mt-8 pt-3 border-t">
                                Dicetak dari Buku Kas pada {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}