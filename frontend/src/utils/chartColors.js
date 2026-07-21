// Palet warna dipakai bersama oleh CategoryPieChart dan TrendChart,
// supaya kategori yang sama terasa konsisten secara visual di seluruh aplikasi.
export const WARNA_PALET = [
    '#0F6B4C', // forest
    '#A6472B', // clay
    '#3B6EA5', // biru
    '#B58A2E', // kuning tanah
    '#6C4F9C', // ungu
    '#2E8E8E', // teal
    '#A5473B', // merah bata
    '#5C7A2E', // hijau lumut
]

export const WARNA_LAINNYA = '#9CA3AF' // abu-abu netral untuk kategori di luar top 7

// Ambil N kategori terbesar dari sebuah objek { namaKategori: totalNilai },
// kategori sisanya digabung jadi satu bucket "Lainnya".
// Dipakai supaya legenda grafik tidak penuh sesak kalau kategori user banyak sekali.
export function ringkasKategoriTeratas(totalPerKategori, batas = 7) {
    const entries = Object.entries(totalPerKategori).sort((a, b) => b[1] - a[1])
    const teratas = entries.slice(0, batas)
    const sisanya = entries.slice(batas)

    const hasil = teratas.map(([nama, nilai], i) => ({
        nama,
        nilai,
        warna: WARNA_PALET[i % WARNA_PALET.length],
    }))

    if (sisanya.length > 0) {
        const totalSisanya = sisanya.reduce((acc, [, nilai]) => acc + nilai, 0)
        if (totalSisanya > 0) {
            hasil.push({ nama: 'Lainnya', nilai: totalSisanya, warna: WARNA_LAINNYA })
        }
    }

    return hasil
}