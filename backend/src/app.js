const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./config/database')

const app = express()

// middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://keuangan.up.railway.app',
    credentials: true
}))
app.use(express.json())

// routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/transaksi', require('./routes/transaksi'))
app.use('/api/kategori', require('./routes/kategori'))
app.use('/api/laporan', require('./routes/laporan'))

// Test
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' })
})

// run server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})

module.exports = app



