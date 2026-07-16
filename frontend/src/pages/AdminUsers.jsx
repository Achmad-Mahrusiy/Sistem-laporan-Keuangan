export default function AdminUsersList({ users, currentUserId, onUbahRole, onHapus }) {
    if (users.length === 0) {
        return <p className="text-center text-ink/40 text-sm py-10">Belum ada pengguna</p>
    }

    const renderStatus = (u) => {
        if (u.hari_tidak_aktif === null) {
            return <span className="text-xs text-clay">Belum pernah login</span>
        }
        if (u.is_aktif) {
            return <span className="text-xs text-forest">Aktif</span>
        }
        return <span className="text-xs text-clay">Tidak aktif {u.hari_tidak_aktif} hari</span>
    }

    const renderAksi = (u) => {
        if (u.id_user === currentUserId) {
            return <span className="text-xs text-ink/35 italic">Akun kamu</span>
        }
        return (
            <>
                {u.role === 'user' ? (
                    <button onClick={() => onUbahRole(u.id_user, 'admin')} className="text-ink/60 hover:text-forest mr-3 transition-colors">
                        Jadikan Admin
                    </button>
                ) : (
                    <button onClick={() => onUbahRole(u.id_user, 'user')} className="text-ink/60 hover:text-ink mr-3 transition-colors">
                        Jadikan User
                    </button>
                )}
                <button onClick={() => onHapus(u.id_user)} className="text-ink/60 hover:text-clay transition-colors">
                    Hapus
                </button>
            </>
        )
    }

    return (
        <>
            {/* Tampilan HP — kartu bertumpuk, tidak perlu digeser ke samping */}
            <div className="sm:hidden divide-y divide-rule">
                {users.map((u) => (
                    <div key={u.id_user} className="p-4">
                        <div className="flex justify-between items-start gap-3 mb-1.5">
                            <div>
                                <p className="text-sm text-ink font-medium">{u.username}</p>
                                <p className="text-xs text-ink/50">{u.email}</p>
                            </div>
                            <span className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded-sm flex-shrink-0 ${u.role === 'admin' ? 'bg-forest-light text-forest' : 'bg-rule/40 text-ink/50'
                                }`}>
                                {u.role}
                            </span>
                        </div>
                        <div className="mb-2">{renderStatus(u)}</div>
                        <div className="flex gap-1 text-sm">{renderAksi(u)}</div>
                    </div>
                ))}
            </div>

            {/* Tampilan tablet ke atas — tabel biasa */}
            <div className="hidden sm:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-rule">
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-ink/40 uppercase tracking-wide">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-ink/40 uppercase tracking-wide">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id_user} className="border-b border-rule last:border-0">
                                <td className="px-6 py-3.5 text-sm text-ink">{u.username}</td>
                                <td className="px-6 py-3.5 text-sm text-ink/60">{u.email}</td>
                                <td className="px-6 py-3.5 text-sm">
                                    <span className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded-sm ${u.role === 'admin' ? 'bg-forest-light text-forest' : 'bg-rule/40 text-ink/50'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-3.5 text-sm">{renderStatus(u)}</td>
                                <td className="px-6 py-3.5 text-sm text-right whitespace-nowrap">{renderAksi(u)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}