export default function Navbar({ active }) {
    const user = JSON.parse(localStorage.getItem('user'))

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Sistem Laporan Keuangan</h1>
            <div className="flex items-center gap-4">
                <a href="/dashboard" className={`hover:underline ${active === 'dashboard' ? 'font-bold' : ''}`}>
                    Dashboard
                </a>
                <a href="/transaksi" className={`hover:underline ${active === 'transaksi' ? 'font-bold' : ''}`}>
                    Transaksi
                </a>
                <a href="/kategori" className={`hover:underline ${active === 'kategori' ? 'font-bold' : ''}`}>
                    Kategori
                </a>
                <a href="/laporan" className={`hover:underline ${active === 'laporan' ? 'font-bold' : ''}`}>
                    Laporan
                </a>
                <span>Halo, {user?.username}</span>
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 font-medium"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}