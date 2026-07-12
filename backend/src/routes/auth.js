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


router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password wajib diisi' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password minimal 6 karakter' })
        }

        const existing = await pool.query(
            'SELECT id_user FROM users WHERE username = $1',
            [username]
        )
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Username sudah dipakai' })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id_user, username, email',
            [username, email || null, passwordHash]
        )
        const user = result.rows[0]

        const token = jwt.sign(
            { id: user.id_user, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(201).json({
            message: 'Registrasi berhasil',
            token: token,
            user: {
                id: user.id_user,
                username: user.username,
                email: user.email,
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router