require('dotenv').config()
const port = process.env.PORT || 3000

const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors())
app.use(express.json())

// MODULES

const auth = require('./modules/auth')
const usuarios = require('./modules/usuarios')
const solicitudes = require('./modules/solicitudes')

// AUTHENTICATION

app.post('/auth/signup', (req, res) => {
    auth.signup(req, res)
})

app.post('/auth/login', (req, res) => {
    auth.login(req, res)
})

// USUARIOS

app.get('/usuarios/getrol/:email', (req, res) => {
    usuarios.getRol(req, res)
})

// SOLICITUDES

app.post('/solicitudes/createsolicitud', (req, res) => {
    solicitudes.createSolicitud(req, res)
})

app.get('/solicitudes/getsolicitudes/:email', (req, res) => {
    solicitudes.getSolicitudes(req, res)
})

app.listen(port, () => console.log(`Server running on PORT ${port}`))