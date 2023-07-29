const express = require("express");
const router = express.Router();

const solicitudes = require("../controllers/solicitudes");

const Authenticate = require('./authenticator');

router.post("/solicitudes/createsolicitud", Authenticate, (req, res) => {
  solicitudes.createSolicitud(req, res);
});

router.get("/solicitudes/getsolicitudesbyidseccion/:id_seccion", Authenticate, (req, res) => {
  solicitudes.getSolicitudesByIdSeccion(req, res);
});

router.post("/solicitudes/getsolicitudesusuariosbyidseccion", Authenticate, (req, res) => {
  solicitudes.getSolicitudesUsuariosByIdSeccion(req, res);
});

router.get("/solicitudes/getsolicitudesreporte", Authenticate, (req, res) => {
  solicitudes.getAllSolicitudes(req, res);
});

router.get(
  "/solicitudes/getsolicitudesusuariosbyidusuarioidmateria/:id_usuario/:id_materia", Authenticate, (req, res) => {
    solicitudes.getSolicitudesUsuariosByIdUsuarioIdMateria(req, res);
  }
);

router.get(
  "/solicitudes/getsolicitudesusuariosbyidusuario/:id_usuario", Authenticate, (req, res) => {
    solicitudes.getSolicitudesUsuariosByIdUsuario(req, res);
  }
);

router.put("/solicitudes/editsolicitud", Authenticate, (req, res) => {
  solicitudes.editSolicitud(req, res);
});

router.put("/solicitudes/archivarsolicitud/:id_solicitud", Authenticate, (req, res) => {
  solicitudes.archivarSolicitud(req, res);
});

router.put("/solicitudes/deletesolicitud/:id_solicitud", Authenticate, (req, res) => {
  solicitudes.deleteSolicitud(req, res);
});

router.post("/solicitudes/actualizaestado", Authenticate, (req, res) => {
  solicitudes.actualizaEstadoSolicitud(req, res);
});

module.exports = router;
