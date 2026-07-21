import { ringkasKategoriTeratas } from '../utils/chartColors'

export default function TrendChart({ data }) {
    if (!data || data.length === 0) return null

    // Gabungkan SEMUA kategori (pemasukan + pengeluaran) dari 6 bulan jadi satu total,
    // supaya kita bisa tentukan kategori mana yang paling besar secara keseluruhan
    // dan kasih warna yang KONSISTEN untuk kategori yang sama di semua bulan.
    const totalGabungan = {}
    data.forEach((bulan) => {
        Object.entries(bulan.kategoriPemasukan || {}).forEach(([nama, nilai]) => {
            totalGabungan[nama] = (totalGabungan[nama] || 0) + nilai
        })
        Object.entries(bulan.kategoriPengeluaran || {}).forEach(([nama, nilai]) => {
            totalGabungan[nama] = (totalGabungan[nama] || 0) + nilai
        })
    })

    // Peta warna: nama kategori -> warna, dipakai sama persis di semua bulan & kedua tipe
    const petaWarna = {}
    ringkasKategoriTeratas(totalGabungan).forEach((k) => {
        petaWarna[k.nama] = k.warna
    })

    // Susun ulang breakdown tiap bulan jadi array segmen siap-render,
    // sudah diurutkan dari nilai terbesar supaya batangnya rapi
    const susunSegmen = (kategoriObj, totalBulan) => {
        return Object.entries(kategoriObj || {})
            .map(([nama, nilai]) => ({
                nama,
                nilai,
                persen: totalBulan > 0 ? (nilai / totalBulan) * 100 : 0,
                warna: petaWarna[nama] || '#9CA3AF',
            }))
            .sort((a, b) => b.nilai - a.nilai)
    }

    const dataSiap = data.map((bulan) => ({
        ...bulan,
        segmenPemasukan: susunSegmen(bulan.kategoriPemasukan, bulan.pemasukan),
        segmenPengeluaran: susunSegmen(bulan.kategoriPengeluaran, bulan.pengeluaran),
    }))

    const nilaiTertinggi = Math.max(
        ...data.map((d) => Math.max(d.pemasukan, d.pengeluaran)),
        1
    )

    const formatBulanSingkat = (bulanStr) => {
        const [tahun, bulan] = bulanStr.split('-')
        const tanggal = new Date(Number(tahun), Number(bulan) - 1, 1)
        return tanggal.toLocaleDateString('id-ID', { month: 'short' })
    }

    const formatRupiah = (angka) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(angka)

    // Legenda: kategori unik yang benar-benar muncul, urut dari nilai terbesar
    const legenda = Object.entries(totalGabungan)
        .sort((a, b) => b[1] - a[1])
        .map(([nama]) => nama)
    const kategoriDitampilkan = ringkasKategoriTeratas(totalGabungan).map((k) => k.nama)

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Tren 6 Bulan Terakhir
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                    Setiap batang dipecah per kategori — arahkan kursor untuk lihat detail
                </p>
            </div>

            <div className="flex items-end justify-between gap-2 sm:gap-4 h-52 mb-4">
                {dataSiap.map((d) => (
                    <div key={d.bulan} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div className="flex items-end gap-1 h-full w-full justify-center">
                            {/* Batang Pemasukan — di-stack per kategori */}
                            <div
                                className="w-3 sm:w-5 flex flex-col-reverse rounded-t-sm overflow-hidden"
                                style={{ height: `${(d.pemasukan / nilaiTertinggi) * 100}%` }}
                            >
                                {d.segmenPemasukan.map((s) => (
                                    <div
                                        key={s.nama}
                                        style={{
                                            height: `${s.persen}%`,
                                            backgroundColor: s.warna,
                                        }}
                                        title={`${s.nama}: ${formatRupiah(s.nilai)} (${s.persen.toFixed(0)}%)`}
                                    />
                                ))}
                            </div>
                            {/* Batang Pengeluaran — di-stack per kategori */}
                            <div
                                className="w-3 sm:w-5 flex flex-col-reverse rounded-t-sm overflow-hidden"
                                style={{ height: `${(d.pengeluaran / nilaiTertinggi) * 100}%` }}
                            >
                                {d.segmenPengeluaran.map((s) => (
                                    <div
                                        key={s.nama}
                                        style={{
                                            height: `${s.persen}%`,
                                            backgroundColor: s.warna,
                                        }}
                                        title={`${s.nama}: ${formatRupiah(s.nilai)} (${s.persen.toFixed(0)}%)`}
                                    />
                                ))}
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">
                            {formatBulanSingkat(d.bulan)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Legenda kategori — pakai warna yang sama seperti batangnya */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-gray-100">
                {kategoriDitampilkan.map((nama) => (
                    <span key={nama} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span
                            className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0"
                            style={{ backgroundColor: petaWarna[nama] }}
                        />
                        {nama}
                    </span>
                ))}
                {legenda.length > kategoriDitampilkan.length && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-sm inline-block bg-gray-400" />
                        Lainnya
                    </span>
                )}
            </div>
        </div>
    )
}