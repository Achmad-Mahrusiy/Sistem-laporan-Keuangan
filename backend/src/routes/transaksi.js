const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM v_transaksi where id_user = $1 order by tanggal desc',
            [req.user.id]
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { id_category, jumlah, tipe_transaction, deskripsi, tanggal } = req.body

        await pool.query(
            'call sp_tambah_transaksi($1, $2, $3, $4, $5, $6)',
            [req.user.id, id_category, jumlah, tipe_transaction, deskripsi, tanggal]
        )
        res.json({ message: 'Trannsaksi berhasil' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { jumlah, tipe_transaction, deskripsi, tanggal } = req.body
        await pool.query(
            'call sp_edit_transaksi($1, $2, $3, $4, $5)',
            [id, jumlah, tipe_transaction, deskripsi, tanggal]
        )
        res.json({ message: 'Transaksi Ter-Update' })
    } catch (err) {
        res.status(500).json({ message: err.message })
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