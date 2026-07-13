import { useState, useEffect } from 'react'
import { getUsers, editRoleUser, hapusUser } from '../services/api'
import Navbar from '../components/Navbar'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const currentUser = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        ambilData()
    }, [])

    const ambilData = async () => {
        try {
            const res = await getUsers()
            setUsers(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUbahRole = async (id, roleBaru) => {
        try {
            await editRoleUser(id, { role: roleBaru })
            ambilData()
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal mengubah role')
        }
    }

    const handleHapus = async (id) => {
        if (!window.confirm('Yakin mau hapus user ini? Data tidak bisa dikembalikan.')) return
        try {
            await hapusUser(id)
            ambilData()
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus user')
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-paper flex items-center justify-center">
            <p className="text-ink/40 text-sm">Memuat...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-paper">
            <Navbar active="users" />

            <div className="p-4 sm:p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <p className="text-xs tracking-[0.2em] uppercase text-forest font-semibold mb-1">Admin</p>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Kelola Pengguna</h2>
                </div>

                {/* Tabel */}
                <div className="bg-white rounded-sm border border-rule overflow-x-auto">
                    <table className="w-full min-w-[560px]">
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
                                        <span className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded-sm ${
                                            u.role === 'admin'
                                                ? 'bg-forest-light text-forest'
                                                : 'bg-rule/40 text-ink/50'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm">
                                        {u.hari_tidak_aktif === null ? (
                                            <span className="text-xs text-clay">Belum pernah login</span>
                                        ) : u.is_aktif ? (
                                            <span className="text-xs text-forest">Aktif</span>
                                        ) : (
                                            <span className="text-xs text-clay">
                                                Tidak aktif {u.hari_tidak_aktif} hari
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-right whitespace-nowrap">
                                        {u.id_user !== currentUser?.id ? (
                                            <>
                                                {u.role === 'user' ? (
                                                    <button
                                                        onClick={() => handleUbahRole(u.id_user, 'admin')}
                                                        className="text-ink/60 hover:text-forest mr-3 transition-colors"
                                                    >
                                                        Jadikan Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUbahRole(u.id_user, 'user')}
                                                        className="text-ink/60 hover:text-ink mr-3 transition-colors"
                                                    >
                                                        Jadikan User
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleHapus(u.id_user)}
                                                    className="text-ink/60 hover:text-clay transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-ink/35 italic">Akun kamu</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <p className="text-center text-ink/40 text-sm py-10">Belum ada pengguna</p>
                    )}
                </div>
            </div>
        </div>
    )
}