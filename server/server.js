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
const horarios = require('./modules/horarios')

// AUTHENTICATION

app.post('/auth/signup', (req, res) => {
    auth.signup(req, res)
})

app.post('/auth/login', (req, res) => {
    auth.login(req, res)
})

// USUARIOS

app.get('/usuarios/getallusuarios', (req, res) => {
    usuarios.getAllUsuarios(req, res)
})

app.get('/usuarios/getrolbyid/:id_usuario', (req, res) => {
    usuarios.getRolById(req, res)
})

app.post('/usuarios/createusuario', (req, res) => {
    usuarios.createUsuario(req, res)
})

app.put('/usuarios/editusuario',(req, res) => {
    usuarios.editUsuario(req, res)
})

app.delete('/usuarios/removeusuariobyid/:id_usuario',(req, res) => {
    usuarios.removeUsuarioById(req, res)
})

// SOLICITUDES

app.post('/solicitudes/createsolicitud', (req, res) => {
    solicitudes.createSolicitud(req, res)
})

app.get('/solicitudes/getsolicitudesbyidusuario/:id_usuario', (req, res) => {
    solicitudes.getSolicitudesByIdUsuario(req, res)
})

// CARRERAS

app.get('/carreras/getallcarreras', (req, res) => {
    carreras.getAllCarreras(req, res)
})

app.get('/carreras/getcarrerasbyidmateria/:id_materia', (req, res) => {
    carreras.getCarrerasByIdMateria(req, res)
})

app.post('/carreras/createcarrera', (req, res) => {
    carreras.createCarrera(req, res)
})

app.delete('/carreras/removecarrerabyid/:id_carrera',(req, res) => {
    carreras.removeCarreraById(req, res)
})

app.put('/carreras/editcarrera',(req, res) => {
    carreras.editCarrera(req, res)
})

// MATERIAS

app.get('/materias/getallmaterias', (req, res) => {
    materias.getAllMaterias(req, res)
})

app.get('/materias/getmateriasbyidusuario/:id_usuario', (req, res) => {
    materias.getMateriasByIdUsuario(req, res)
})

app.post('/materias/createmateria', (req, res) => {
    materias.createMateria(req, res)
})

app.put('/materias/editmateria',(req, res) => {
    materias.editMateria(req, res)
})

app.delete('/materias/removemateriabyid/:id_materia',(req, res) => {
    materias.removeMateriaById(req, res)
})

// HORARIOS

app.post('/horarios/creahorario', (req, res) => {
    horarios.createHorario(req, res)
})

app.get('/horarios/getmateriasidusuarioidmateria/:id_usuario/:id_materia', (req, res) => {
    horarios.getHorariosByIdUsuarioIdMateria(req, res)
})

app.listen(port, () => console.log(`Server running on PORT ${port}`))