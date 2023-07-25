require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const port = process.env.NODE_LOCAL_PORT || 8000;
const basePath = process.env.BASE_PATH || "http://localhost:8000";

const corsOptions = {
  origin: basePath || "http://localhost:8000",
};

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));
app.use(express.json());

// MODULES

const auth = require("./modules/auth");
const usuarios = require("./modules/usuarios");
const solicitudes = require("./modules/solicitudes");
const carreras = require("./modules/carreras");
const materias = require("./modules/materias");
const horarios = require("./modules/horarios");
const secciones = require("./modules/secciones");
const notificaciones = require("./modules/notificaciones");

// AUTHENTICATION

app.post("/auth/signup", (req, res) => {
  auth.signup(req, res);
});

app.post("/auth/login", (req, res) => {
  auth.login(req, res);
});

// USUARIOS

app.get("/usuarios/getallusuarios", (req, res) => {
  usuarios.getAllUsuarios(req, res);
});

app.get("/usuarios/getusuariobyid/:id_usuario", (req, res) => {
  usuarios.getUsuarioById(req, res);
});

app.get("/usuarios/getrolbyid/:id_usuario", (req, res) => {
  usuarios.getRolById(req, res);
});

app.post("/usuarios/createusuario", (req, res) => {
  usuarios.createUsuario(req, res);
});

app.post("/usuarios/bulkcreateusuario", (req, res) => {
  usuarios.bulkCreateUsuario(req, res);
});

app.put("/usuarios/editusuario", (req, res) => {
  usuarios.editUsuario(req, res);
});

app.put("/usuarios/changepassword", (req, res) => {
  usuarios.changePassword(req, res);
});

app.put("/usuarios/activateuser/:id_usuario", (req, res) => {
  usuarios.activateUser(req, res);
});

app.delete("/usuarios/removeusuariobyid/:id_usuario", (req, res) => {
  usuarios.removeUsuarioById(req, res);
});

app.post("/usuarios/usuarioinfo", (req, res) => {
  usuarios.getUsuarioInfo(req, res);
});

// SOLICITUDES

app.post("/solicitudes/createsolicitud", (req, res) => {
  solicitudes.createSolicitud(req, res);
});

app.get("/solicitudes/getsolicitudesbyidseccion/:id_seccion", (req, res) => {
  solicitudes.getSolicitudesByIdSeccion(req, res);
});

app.post("/solicitudes/getsolicitudesusuariosbyidseccion", (req, res) => {
  solicitudes.getSolicitudesUsuariosByIdSeccion(req, res);
});

app.get("/solicitudes/getsolicitudesreporte", (req, res) => {
  solicitudes.getAllSolicitudes(req, res);
});

app.get(
  "/solicitudes/getsolicitudesusuariosbyidusuarioidmateria/:id_usuario/:id_materia",
  (req, res) => {
    solicitudes.getSolicitudesUsuariosByIdUsuarioIdMateria(req, res);
  }
);

app.get(
  "/solicitudes/getsolicitudesusuariosbyidusuario/:id_usuario",
  (req, res) => {
    solicitudes.getSolicitudesUsuariosByIdUsuario(req, res);
  }
);

app.put("/solicitudes/editsolicitud", (req, res) => {
  solicitudes.editSolicitud(req, res);
});

app.put("/solicitudes/archivarsolicitud/:id_solicitud", (req, res) => {
  solicitudes.archivarSolicitud(req, res);
});

app.put("/solicitudes/deletesolicitud/:id_solicitud", (req, res) => {
  solicitudes.deleteSolicitud(req, res);
});

app.post("/solicitudes/actualizaestado", (req, res) => {
  solicitudes.actualizaEstadoSolicitud(req, res);
});

// CARRERAS

app.get("/carreras/getallcarreras", (req, res) => {
  carreras.getAllCarreras(req, res);
});

app.get("/carreras/getcarrerasbyidmateria/:id_materia", (req, res) => {
  carreras.getCarrerasByIdMateria(req, res);
});

app.post("/carreras/createcarrera", (req, res) => {
  carreras.createCarrera(req, res);
});

app.delete("/carreras/removecarrerabyid/:id_carrera", (req, res) => {
  carreras.removeCarreraById(req, res);
});

app.put("/carreras/editcarrera", (req, res) => {
  carreras.editCarrera(req, res);
});

// MATERIAS

app.get("/materias/getallmaterias", (req, res) => {
  materias.getAllMaterias(req, res);
});

app.get("/materias/getMateriaById/:id_materia", (req, res) => {
  materias.getMateriaById(req, res);
});

app.get("/materias/getmateriasbyidusuario/:id_usuario", (req, res) => {
  materias.getMateriasByIdUsuario(req, res);
});

app.post("/materias/createmateria", (req, res) => {
  materias.createMateria(req, res);
});

app.put("/materias/editmateria", (req, res) => {
  materias.editMateria(req, res);
});

app.delete("/materias/removemateriabyid/:id_materia", (req, res) => {
  materias.removeMateriaById(req, res);
});

// HORARIOS

app.post("/horarios/creahorario", (req, res) => {
  horarios.createHorario(req, res);
});

app.get("/horarios/gethorariosbyidseccion/:id_seccion", (req, res) => {
  horarios.getHorariosByIdSeccion(req, res);
});

app.get("/horarios/getHorariosByIdUsuario/:id_usuario", (req, res) => {
  horarios.getHorariosByIdUsuario(req, res);
});

app.put("/horarios/deletemateriasidusuarioidmateria/:id_evento", (req, res) => {
  horarios.deleteHorariosByIdUsuarioIdMateria(req, res);
});

// SECCIONES

app.get("/secciones/getseccionesbyidusuario/:id_usuario", (req, res) => {
  secciones.getSeccionesByIdUsuario(req, res);
});

app.get("/secciones/getseccionbyId/:id_seccion", (req, res) => {
  secciones.getSeccionById(req, res);
});

// NOTIFICACIONES

app.post("/notificaciones/envia/", (req, res) => {
  notificaciones.mailer(req, res);
});

app.post("/notificaciones/whatsapp/", (req, res) => {
  notificaciones.whatsappMail(req, res);
});

app.listen(port, () => console.log(`Server running on PORT ${port}`));
