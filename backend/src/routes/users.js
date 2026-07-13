const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const authMiddleware = require('../middleware/auth')
const adminOnly = require('../middleware/adminOnly')

router.use(authMiddleware)
router.use(adminOnly)

// GET — semua user
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id_user, username, email, role, created_at FROM users ORDER BY id_user'
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// PUT — edit role
router.put('/:id/role', async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body
        await pool.query('CALL sp_edit_role_user($1, $2)', [id, role])
        res.json({ message: 'Role berhasil diubah' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// DELETE — hapus user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('CALL sp_hapus_user($1)', [id])
        res.json({ message: 'User berhasil dihapus' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router