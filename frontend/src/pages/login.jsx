import { useState, useEffect } from 'react'
import { login } from '../services/api'
import PasswordInput from '../components/PasswordInput'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [info, setInfo] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('expired') === '1') {
            setInfo('Sesi kamu berakhir karena tidak ada aktivitas. Silakan login kembali.')
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await login({ username, password })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            window.location.href = '/dashboard'
        } catch (err) {
            setError(err.response?.data?.message || ' Login gagal')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center px-4 relative overflow-hidden">
            {/* Garis ledger dekoratif di background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.35]" aria-hidden="true">
                <div className="h-full w-full" style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #DAD5C6 39px, #DAD5C6 40px)'
                }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Label eyebrow */}
                <p className="text-center text-xs sm:text-sm tracking-[0.2em] uppercase text-forest font-semibold mb-3">
                    Buku Kas Digital
                </p>

                <div className="bg-white rounded-sm shadow-[0_1px_2px_rgba(27,37,33,0.06),0_8px_24px_rgba(27,37,33,0.08)] border border-rule px-6 sm:px-10 py-8 sm:py-10">
                    <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink text-center mb-1 leading-tight">
                        Sistem Laporan<br />Keuangan
                    </h1>
                    <p className="text-center text-ink/50 text-sm mb-8">
                        Masuk untuk mencatat pemasukan &amp; pengeluaran
                    </p>

                    {info && (
                        <div className="bg-forest-light border-l-4 border-forest text-forest-dark px-4 py-3 rounded-sm mb-5 text-sm">
                            {info}
                        </div>
                    )}

                    {error && (
                        <div className="bg-clay-light border-l-4 border-clay text-clay px-4 py-3 rounded-sm mb-5 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-5">
                            <label className="block text-ink text-sm font-medium mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border border-rule rounded-sm px-3 py-2.5 bg-paper/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
                                placeholder="Masukkan username"
                                required
                            />
                        </div>

                        <div className="mb-7">
                            <label className="block text-ink text-sm font-medium mb-1.5">
                                Password
                            </label>
                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-rule rounded-sm px-3 py-2.5 bg-paper/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
                                placeholder="Masukkan password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-forest text-white py-2.5 rounded-sm hover:bg-forest-dark font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-ink/50 mt-6 pt-6 border-t border-rule">
                        Belum punya akun?{' '}
                        <a href="/register" className="text-forest font-medium hover:text-forest-dark">
                            Daftar di sini
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}