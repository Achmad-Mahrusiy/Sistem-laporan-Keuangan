const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

// Cari kategori yang namanya sama (tanpa peduli huruf besar/kecil) & tipenya sama.
// Kalau belum ada, buat baru sebagai milik user ini.
// Ini yang bikin "kategori" di form Transaksi terasa seperti isian bebas,
// padahal di belakang layar tetap tersimpan rapi di tabel categories.
const cariAtauBuatKategori = async (nama, tipe, idUser) => {
    const cari = await pool.query(
        `SELECT id_category FROM categories
         WHERE LOWER(nama) = LOWER($1)
         AND tipe_category = $2
         AND (id_user = $3 OR id_user IS NULL)
         LIMIT 1`,
        [nama, tipe, idUser]
    )

    if (cari.rows.length > 0) {
        return cari.rows[0].id_category
    }

    const buat = await pool.query(
        'INSERT INTO categories (nama, tipe_category, id_user) VALUES ($1, $2, $3) RETURNING id_category',
        [nama, tipe, idUser]
    )
    return buat.rows[0].id_category
}

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM v_transaksi WHERE id_user = $1 ORDER BY created_at DESC',
            [req.user.id]
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { kategori, jumlah, tipe_transaction, deskripsi, tanggal } = req.body

        const id_category = await cariAtauBuatKategori(kategori, tipe_transaction, req.user.id)

        await pool.query(
            'call sp_tambah_transaksi($1, $2, $3, $4, $5, $6)',
            [req.user.id, id_category, jumlah, tipe_transaction, deskripsi, tanggal]
        )
        res.json({ message: 'Transaksi berhasil ditambahkan' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { kategori, jumlah, tipe_transaction, deskripsi, tanggal } = req.body

        const id_category = await cariAtauBuatKategori(kategori, tipe_transaction, req.user.id)

        await pool.query(
            'call sp_edit_transaksi($1, $2, $3, $4, $5, $6)',
            [id, id_category, jumlah, tipe_transaction, deskripsi, tanggal]
        )
        res.json({ message: 'Transaksi Ter-Update' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await pool.query(
            'call sp_hapus_transaksi($1)',
            [id]
        )
        res.json({ message: 'Transaksi Terhapus' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router