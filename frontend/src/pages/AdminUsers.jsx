import { useState, useEffect } from 'react'
import { getUsers, editRoleUser, hapusUser } from '../services/api'
import Navbar from '../components/Navbar'
import AdminUsersList from '../components/AdminUsersList'

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
        if (!window.confirm('Yakin mau hapus user ini? Semua transaksi dan kategori miliknya juga akan terhapus, dan tidak bisa dikembalikan.')) return
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

            <div className="p-4 sm:p-6 max-w-6xl mx-auto animate-fade-in-up">
                {/* Header */}
                <div className="mb-6">
                    <p className="text-xs tracking-[0.2em] uppercase text-forest font-semibold mb-1">Admin</p>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Kelola Pengguna</h2>
                </div>

                {/* Tabel */}
                <div className="bg-white rounded-sm border border-rule">
                    <AdminUsersList
                        users={users}
                        currentUserId={currentUser?.id}
                        onUbahRole={handleUbahRole}
                        onHapus={handleHapus}
                    />
                </div>
            </div>
        </div>
    )
}