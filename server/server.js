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
const carreras = require('./modules/carreras')
const materias = require('./modules/materias')

// AUTHENTICATION

app.post('/auth/signup', (req, res) => {
    auth.signup(req, res)
})

app.post('/auth/login', (req, res) => {
    auth.login(req, res)
})

// USUARIOS

app.get('/usuarios/getusuarios', (req, res) => {
    usuarios.getUsuarios(req, res)
})

app.get('/usuarios/getmaterias/:email', (req, res) => {
    usuarios.getMaterias(req, res)
})

app.get('/usuarios/getrol/:email', (req, res) => {
    usuarios.getRol(req, res)
})

app.post('/usuarios/createusuario', (req, res) => {
    usuarios.createUsuario(req, res)
})

app.put('/usuarios/editusuario/:id',(req, res) => {
    usuarios.editUsuario(req, res)
})

app.delete('/usuarios/removeusuario/:email',(req, res) => {
    usuarios.removeUsuario(req, res)
})

// SOLICITUDES

app.post('/solicitudes/createsolicitud', (req, res) => {
    solicitudes.createSolicitud(req, res)
})

app.get('/solicitudes/getsolicitudes/:email', (req, res) => {
    solicitudes.getSolicitudes(req, res)
})

// CARRERAS

app.get('/carreras/getcarreras', (req, res) => {
    carreras.getCarreras(req, res)
})

app.post('/carreras/createcarrera', (req, res) => {
    carreras.createCarrera(req, res)
})

app.delete('/carreras/removecarrera/:id',(req, res) => {
    carreras.removeCarrera(req, res)
})

app.put('/carreras/editcarrera/:ID',(req, res) => {
    carreras.editCarrera(req, res)
})

// MATERIAS

app.get('/materias/getmaterias', (req, res) => {
    materias.getMaterias(req, res)
})

app.get('/materias/getcarreras/:id', (req, res) => {
    materias.getCarreras(req, res)
})

app.post('/materias/createmateria', (req, res) => {
    materias.createMateria(req, res)
})

app.delete('/materias/removemateria/:id',(req, res) => {
    materias.removeMateria(req, res)
})

app.put('/materias/editmateria/:ID',(req, res) => {
    materias.editMateria(req, res)
})


app.listen(port, () => console.log(`Server running on PORT ${port}`))