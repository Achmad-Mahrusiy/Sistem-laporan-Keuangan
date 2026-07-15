import { useEffect } from 'react'

// Menangkap tombol Back browser/HP di halaman tertentu, supaya user
// diarahkan ke Dashboard alih-alih keluar dari aplikasi atau ke halaman
// yang tidak terduga.
export default function useBackToDashboard() {
    useEffect(() => {
        // Sisipkan satu entry history "penyangga" di posisi sekarang.
        // Saat user tekan Back, browser akan mundur ke entry ini dulu
        // (memicu popstate) — bukan langsung keluar dari aplikasi.
        window.history.pushState(null, '', window.location.href)

        const handlePopState = () => {
            window.location.href = '/dashboard'
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])
}