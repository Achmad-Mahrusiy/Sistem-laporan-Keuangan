export default function TrendChart({ data }) {
    if (!data || data.length === 0) return null

    // Cari nilai tertinggi dari semua batang, supaya tinggi batang proporsional
    const nilaiTertinggi = Math.max(
        ...data.flatMap((d) => [d.pemasukan, d.pengeluaran]),
        1 // jaga-jaga supaya tidak dibagi dengan 0
    )

    const formatBulanSingkat = (bulanStr) => {
        const [tahun, bulan] = bulanStr.split('-')
        const tanggal = new Date(Number(tahun), Number(bulan) - 1, 1)
        return tanggal.toLocaleDateString('id-ID', { month: 'short' })
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Tren 6 Bulan Terakhir
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
                        Pemasukan
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-red-400 inline-block" />
                        Pengeluaran
                    </span>
                </div>
            </div>

            <div className="flex items-end justify-between gap-2 sm:gap-4 h-48">
                {data.map((d) => (
                    <div key={d.bulan} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div className="flex items-end gap-1 h-full w-full justify-center">
                            <div
                                className="w-3 sm:w-5 bg-green-500 rounded-t-sm transition-all"
                                style={{ height: `${(d.pemasukan / nilaiTertinggi) * 100}%` }}
                                title={`Pemasukan: ${d.pemasukan}`}
                            />
                            <div
                                className="w-3 sm:w-5 bg-red-400 rounded-t-sm transition-all"
                                style={{ height: `${(d.pengeluaran / nilaiTertinggi) * 100}%` }}
                                title={`Pengeluaran: ${d.pengeluaran}`}
                            />
                        </div>
                        <span className="text-xs text-gray-500 mt-2">
                            {formatBulanSingkat(d.bulan)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}