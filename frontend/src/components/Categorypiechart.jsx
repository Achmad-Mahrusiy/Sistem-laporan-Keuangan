const WARNA_PALET = [
    '#0F6B4C', // forest
    '#A6472B', // clay
    '#3B6EA5', // biru
    '#B58A2E', // kuning tanah
    '#6C4F9C', // ungu
    '#2E8E8E', // teal
    '#A5473B', // merah bata
    '#5C7A2E', // hijau lumut
]

export default function CategoryPieChart({ transaksi, tipe = 'pengeluaran' }) {
    // Kelompokkan transaksi berdasarkan nama kategori, jumlahkan nilainya
    const dataPerKategori = {}
    transaksi
        .filter((t) => t.tipe_transaction === tipe)
        .forEach((t) => {
            const nama = t.nama_kategori || 'Lainnya'
            dataPerKategori[nama] = (dataPerKategori[nama] || 0) + Number(t.jumlah)
        })

    const data = Object.entries(dataPerKategori)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)

    const total = data.reduce((acc, d) => acc + d.value, 0)

    const formatRupiah = (angka) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(angka)

    // Ukuran lingkaran dan perhitungan busur (arc) tiap kategori
    const radius = 60
    const strokeWidth = 24
    const circumference = 2 * Math.PI * radius

    // Hitung dulu panjang busur & titik awal tiap kategori SEBELUM render,
    // supaya logika perhitungan terpisah dari tampilan
    let offsetKumulatif = 0
    const dataDenganBusur = data.map((d) => {
        const panjangBusur = (d.value / total) * circumference
        const busur = { ...d, panjangBusur, offset: offsetKumulatif }
        offsetKumulatif += panjangBusur
        return busur
    })

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                {tipe === 'pengeluaran' ? 'Pengeluaran per Kategori' : 'Pemasukan per Kategori'}
            </h3>

            {total === 0 ? (
                <p className="text-sm text-gray-400 py-10 text-center">
                    Belum ada data {tipe} bulan ini
                </p>
            ) : (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Lingkaran donat — diputar -90deg supaya mulai dari jam 12 */}
                    <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0 -rotate-90">
                        <circle cx="80" cy="80" r={radius} fill="none" stroke="#F0F0EC" strokeWidth={strokeWidth} />
                        {dataDenganBusur.map((d, i) => (
                            <circle
                                key={d.label}
                                cx="80"
                                cy="80"
                                r={radius}
                                fill="none"
                                stroke={WARNA_PALET[i % WARNA_PALET.length]}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${d.panjangBusur} ${circumference}`}
                                strokeDashoffset={-d.offset}
                            />
                        ))}
                    </svg>

                    {/* Legenda daftar kategori */}
                    <div className="flex-1 w-full space-y-2">
                        {dataDenganBusur.map((d, i) => (
                            <div key={d.label} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-sm inline-block flex-shrink-0"
                                        style={{ backgroundColor: WARNA_PALET[i % WARNA_PALET.length] }}
                                    />
                                    <span className="text-gray-700">{d.label}</span>
                                </div>
                                <div className="text-right whitespace-nowrap">
                                    <span className="text-gray-800 font-medium">{formatRupiah(d.value)}</span>
                                    <span className="text-gray-400 ml-2 text-xs">
                                        {((d.value / total) * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}