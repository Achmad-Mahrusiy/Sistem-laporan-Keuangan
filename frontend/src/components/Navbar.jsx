import { useState } from 'react'

export default function Navbar({ active }) {
    const user = JSON.parse(localStorage.getItem('user'))
    const [open, setOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    const isAdmin = user?.role === 'admin'

    const links = [
        { href: '/dashboard', label: 'Dashboard', key: 'dashboard' },
        { href: '/transaksi', label: 'Transaksi', key: 'transaksi' },
        { href: '/laporan', label: 'Laporan', key: 'laporan' },
        ...(isAdmin ? [{ href: '/users', label: 'Kelola User', key: 'users' }] : []),
    ]

    return (
        <>
            {/* Top bar — selalu tampil */}
            <nav className="bg-ink text-white px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    {/* Tombol hamburger — cuma muncul di bawah breakpoint lg */}
                    <button
                        onClick={() => setOpen(true)}
                        className="lg:hidden p-1.5 -ml-1.5 rounded hover:bg-white/10 transition-colors"
                        aria-label="Buka menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <a href="/dashboard" className="font-display text-lg sm:text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
                        Buku Kas
                    </a>
                </div>

                {/* Menu horizontal — cuma muncul di layar lg ke atas (laptop/desktop) */}
                <div className="hidden lg:flex items-center gap-6">
                    {links.map((l) => (
                        <a
                            key={l.key}
                            href={l.href}
                            className={`text-sm pb-1 border-b-2 transition-colors ${active === l.key
                                    ? 'border-forest text-white font-medium'
                                    : 'border-transparent text-white/60 hover:text-white'
                                }`}
                        >
                            {l.label}
                        </a>
                    ))}
                    <span className="text-sm text-white/50 ml-2">Halo, {user?.username}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-forest text-white px-4 py-1.5 rounded-sm hover:bg-forest-dark font-medium text-sm transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Lapisan gelap di belakang drawer — hanya relevan di bawah lg, karena trigger-nya juga disembunyikan di lg+ */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    aria-hidden="true"
                />
            )}

            {/* Drawer — panel geser dari kiri, khusus layar di bawah lg */}
            <div
                className={`fixed inset-y-0 left-0 w-72 max-w-[80%] bg-ink text-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h2 className="font-display text-lg font-semibold">Buku Kas</h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        aria-label="Tutup menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col p-3 overflow-y-auto">
                    {links.map((l) => (
                        <a
                            key={l.key}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`px-3 py-2.5 rounded-sm text-sm transition-colors ${active === l.key
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-white/70 hover:bg-white/5'
                                }`}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>

                <div className="mt-auto px-3 pb-5 pt-3 border-t border-white/10">
                    <p className="px-3 text-sm text-white/50 mb-3">Halo, {user?.username}</p>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-forest text-white px-4 py-2 rounded-sm hover:bg-forest-dark font-medium text-sm transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}