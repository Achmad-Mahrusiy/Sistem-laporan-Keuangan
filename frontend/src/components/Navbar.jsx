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
        { href: '/kategori', label: 'Kategori', key: 'kategori' },
        { href: '/laporan', label: 'Laporan', key: 'laporan' },
        ...(isAdmin ? [{ href: '/users', label: 'Kelola User', key: 'users' }] : []),
    ]

    return (
        <nav className="bg-ink text-white px-4 sm:px-6">
            <div className="flex justify-between items-center py-3.5">
                <h1 className="font-display text-lg sm:text-xl font-semibold tracking-tight">
                    Buku Kas
                </h1>

                {/* Tombol hamburger, cuma muncul di layar kecil */}
                <button
                    onClick={() => setOpen(!open)}
                    className="sm:hidden p-2 rounded hover:bg-white/10"
                    aria-label="Buka menu"
                >
                    {open ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Menu untuk layar besar */}
                <div className="hidden sm:flex items-center gap-6">
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
            </div>

            {/* Menu dropdown untuk layar kecil */}
            {open && (
                <div className="sm:hidden flex flex-col gap-1 pb-4 border-t border-white/10 pt-3">
                    {links.map((l) => (
                        <a
                            key={l.key}
                            href={l.href}
                            className={`px-2 py-2 rounded-sm text-sm ${active === l.key ? 'bg-white/10 text-white font-medium' : 'text-white/70'
                                }`}
                        >
                            {l.label}
                        </a>
                    ))}
                    <span className="px-2 py-1 text-sm text-white/50">Halo, {user?.username}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-forest text-white px-4 py-2 rounded-sm hover:bg-forest-dark font-medium text-left text-sm mt-1"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    )
}