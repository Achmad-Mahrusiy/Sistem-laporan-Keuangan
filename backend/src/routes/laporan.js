const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.get('/dashboard', async (req, res) => {
    try {
        const result = await pool.query(
            'select * from v_ringkasan where id_user = $1',
            [req.user.id]
        )
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/bulanan/:bulan', async (req, res) => {
    try {
        const { bulan } = req.params
        const result = await pool.query(
            'select * from fn_total_per_bulan($1, $2)',
            [req.user.id, bulan]
        )
        res.json(result.rows[0])
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})

router.get('/saldo', async (req, res) => {
    try {
        const result = await pool.query(
            'select fn_hitung_saldo($1) as saldo',
            [req.user.id]
        )
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/transaksi', async (req, res) => {
    try {
        const result = await pool.query(
            'select * from v_transaksi where id_user = $1 order by tanggal desc',
            [req.user.id]
        ) 
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router