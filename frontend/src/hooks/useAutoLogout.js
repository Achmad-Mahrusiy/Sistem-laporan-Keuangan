import { useEffect, useRef } from 'react'

// Durasi idle sebelum auto-logout (dalam milidetik)
const BATAS_WAKTU_IDLE = 5 * 60 * 1000 // 5 menit

// Event yang dianggap sebagai "aktivitas" dari user
const EVENT_AKTIVITAS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']

export default function useAutoLogout() {
    const timerRef = useRef(null)

    useEffect(() => {
        const logoutKarenaIdle = () => {
            // Hanya logout kalau memang sedang login
            const token = localStorage.getItem('token')
            if (!token) return

            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login?expired=1'
        }

        const resetTimer = () => {
            // Setiap ada aktivitas, batalkan timer lama, mulai timer baru
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(logoutKarenaIdle, BATAS_WAKTU_IDLE)
        }

        // Pasang listener untuk semua jenis aktivitas
        EVENT_AKTIVITAS.forEach((event) => {
            window.addEventListener(event, resetTimer)
        })

        // Mulai timer pertama kali
        resetTimer()

        // Cleanup — lepas semua listener saat komponen unmount
        return () => {
            EVENT_AKTIVITAS.forEach((event) => {
                window.removeEventListener(event, resetTimer)
            })
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])
}