const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories WHERE id_user IS NULL OR id_user = $1 ORDER BY created_at DESC',
            [req.user.id]
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { nama, tipe_category } = req.body

        await pool.query(
            'call sp_tambah_kategori($1, $2, $3)',
            [nama, tipe_category, req.user.id]
        )
        res.json({ message: 'Kategori berhasil bertambah' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nama, tipe_category } = req.body
        await pool.query(
            'call sp_edit_kategori($1, $2, $3, $4)',
            [id, nama, tipe_category, req.user.id]
        )
        res.json({ message: 'Kategori Ter-Update' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await pool.query(
            'call sp_hapus_kategori($1, $2)',
            [id, req.user.id]
        )
        res.json({ message: 'Kategori Terhapus' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


module.exports = router