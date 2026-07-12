const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const result = await pool.query(
            'SELECT * FROM fn_validasi_user($1)',
            [username]
        )

        const user = result.rows[0]
        if (!user) {
            return res.status(401).json({ message: 'Username tidak ditemukan' })
        }

        const passwordValid = await bcrypt.compare(password, user.out_password_hash)
        if (!passwordValid) {
            return res.status(401).json({ message: 'Password salah' })
        }

        const token = jwt.sign(
            { id: user.out_id_user, username: user.out_username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.json({
            message: 'Login Berhasil',
            token: token,
            user: {
                id: user.out_id_user,
                username: user.out_username,
                email: user.out_email,
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router