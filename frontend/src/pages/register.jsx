import { useState } from 'react'
import { register } from '../services/api'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak cocok')
            return
        }
        if (password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        setLoading(true)
        try {
            const res = await register({ username, email, password })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            window.location.href = '/dashboard'
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full border border-rule rounded-sm px-3 py-2.5 bg-paper/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-10 relative overflow-hidden">
            {/* Garis ledger dekoratif di background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.35]" aria-hidden="true">
                <div className="h-full w-full" style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #DAD5C6 39px, #DAD5C6 40px)'
                }} />
            </div>

            <div className="relative w-full max-w-md">
                <p className="text-center text-xs sm:text-sm tracking-[0.2em] uppercase text-forest font-semibold mb-3">
                    Buku Kas Digital
                </p>

                <div className="bg-white rounded-sm shadow-[0_1px_2px_rgba(27,37,33,0.06),0_8px_24px_rgba(27,37,33,0.08)] border border-rule px-6 sm:px-10 py-8 sm:py-10">
                    <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink text-center mb-1 leading-tight">
                        Buat Akun Baru
                    </h1>
                    <p className="text-center text-ink/50 text-sm mb-8">
                        Mulai catat keuanganmu sendiri
                    </p>

                    {error && (
                        <div className="bg-clay-light border-l-4 border-clay text-clay px-4 py-3 rounded-sm mb-5 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="mb-5">
                            <label className="block text-ink text-sm font-medium mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={inputClass}
                                placeholder="Pilih username"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-ink text-sm font-medium mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-ink text-sm font-medium mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClass}
                                placeholder="Minimal 6 karakter"
                                required
                            />
                        </div>

                        <div className="mb-7">
                            <label className="block text-ink text-sm font-medium mb-1.5">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={inputClass}
                                placeholder="Ulangi password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-forest text-white py-2.5 rounded-sm hover:bg-forest-dark font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Daftar'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-ink/50 mt-6 pt-6 border-t border-rule">
                        Sudah punya akun?{' '}
                        <a href="/login" className="text-forest font-medium hover:text-forest-dark">
                            Masuk di sini
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}