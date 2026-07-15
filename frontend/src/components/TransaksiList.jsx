export default function TransaksiList({ transaksi, formatRupiah, onEdit, onHapus }) {
    if (transaksi.length === 0) {
        return <p className="text-center text-ink/40 text-sm py-10">Belum ada transaksi</p>
    }

    return (
        <>
            {/* Tampilan HP — kartu bertumpuk, tidak perlu digeser ke samping */}
            <div className="sm:hidden divide-y divide-rule">
                {transaksi.map((t) => (
                    <div key={t.id_transaction} className="p-4">
                        <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-ink truncate">{t.nama_kategori}</p>
                                <p className="text-xs text-ink/50 mt-0.5">
                                    {new Date(t.tanggal).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <p className={`font-mono tabular-nums text-sm font-semibold whitespace-nowrap flex-shrink-0 ${
                                t.tipe_transaction === 'pemasukan' ? 'text-forest' : 'text-clay'
                            }`}>
                                {t.tipe_transaction === 'pengeluaran' ? '-' : '+'}
                                {formatRupiah(t.jumlah)}
                            </p>
                        </div>
                        {t.deskripsi && (
                            <p className={`text-sm text-ink/70 mt-2 pl-2.5 border-l-2 ${
                                t.tipe_transaction === 'pemasukan' ? 'border-forest' : 'border-clay'
                            }`}>
                                {t.deskripsi}
                            </p>
                        )}
                        <div className="flex gap-4 mt-3 text-sm">
                            <button onClick={() => onEdit(t)} className="text-forest font-medium">Edit</button>
                            <button onClick={() => onHapus(t.id_transaction)} className="text-clay font-medium">Hapus</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tampilan tablet ke atas — tabel biasa, kolom ringkas jadi tidak perlu digeser */}
            <div className="hidden sm:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-rule">
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Tanggal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Kategori</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Deskripsi</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-ink/40 uppercase tracking-wide">Jumlah</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-ink/40 uppercase tracking-wide">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaksi.map((t) => (
                            <tr key={t.id_transaction} className="border-b border-rule last:border-0">
                                <td className="px-6 py-3.5 text-sm text-ink/70">
                                    {new Date(t.tanggal).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-6 py-3.5 text-sm text-ink/70">{t.nama_kategori}</td>
                                <td className={`px-6 py-3.5 text-sm text-ink border-l-2 ${
                                    t.tipe_transaction === 'pemasukan' ? 'border-forest' : 'border-clay'
                                }`}>
                                    {t.deskripsi}
                                </td>
                                <td className={`px-6 py-3.5 text-sm font-mono tabular-nums text-right font-medium ${
                                    t.tipe_transaction === 'pemasukan' ? 'text-forest' : 'text-clay'
                                }`}>
                                    {t.tipe_transaction === 'pengeluaran' ? '-' : '+'}
                                    {formatRupiah(t.jumlah)}
                                </td>
                                <td className="px-6 py-3.5 text-sm text-right whitespace-nowrap">
                                    <button onClick={() => onEdit(t)} className="text-ink/60 hover:text-forest mr-3 transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => onHapus(t.id_transaction)} className="text-ink/60 hover:text-clay transition-colors">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}