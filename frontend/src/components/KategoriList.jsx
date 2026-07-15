export default function KategoriList({ kategori, onEdit, onHapus }) {
    if (kategori.length === 0) {
        return <p className="text-center text-ink/40 text-sm py-10">Belum ada kategori</p>
    }

    return (
        <>
            {/* Tampilan HP — kartu bertumpuk, tidak perlu digeser ke samping */}
            <div className="sm:hidden divide-y divide-rule">
                {kategori.map((k) => (
                    <div key={k.id_category} className="p-4 flex items-start justify-between gap-3">
                        <div className={`pl-3 border-l-2 ${k.tipe_category === 'pemasukan' ? 'border-forest' : 'border-clay'}`}>
                            <p className="text-sm text-ink font-medium">{k.nama}</p>
                            <p className={`text-xs font-medium uppercase tracking-wide mt-0.5 ${
                                k.tipe_category === 'pemasukan' ? 'text-forest' : 'text-clay'
                            }`}>
                                {k.tipe_category}
                            </p>
                            <p className="text-xs text-ink/35 italic mt-1">
                                {k.id_user === null ? 'Bawaan' : 'Milik saya'}
                            </p>
                        </div>
                        {k.id_user !== null && (
                            <div className="flex gap-3 text-sm flex-shrink-0">
                                <button onClick={() => onEdit(k)} className="text-forest font-medium">Edit</button>
                                <button onClick={() => onHapus(k.id_category)} className="text-clay font-medium">Hapus</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Tampilan tablet ke atas — tabel biasa, kolom ringkas jadi tidak perlu digeser */}
            <div className="hidden sm:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-rule">
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Tipe</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Sumber</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-ink/40 uppercase tracking-wide">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kategori.map((k) => (
                            <tr key={k.id_category} className="border-b border-rule last:border-0">
                                <td className={`px-6 py-3.5 text-sm text-ink border-l-2 ${
                                    k.tipe_category === 'pemasukan' ? 'border-forest' : 'border-clay'
                                }`}>
                                    {k.nama}
                                </td>
                                <td className="px-6 py-3.5 text-sm">
                                    <span className={`text-xs font-medium uppercase tracking-wide ${
                                        k.tipe_category === 'pemasukan' ? 'text-forest' : 'text-clay'
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
                                            <button onClick={() => onEdit(k)} className="text-ink/60 hover:text-forest mr-3 transition-colors">
                                                Edit
                                            </button>
                                            <button onClick={() => onHapus(k.id_category)} className="text-ink/60 hover:text-clay transition-colors">
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
            </div>
        </>
    )
}