const express = require("express");
const router = express.Router();

const solicitudes = require("../controllers/solicitudes");

router.post("/solicitudes/createsolicitud", (req, res) => {
  solicitudes.createSolicitud(req, res);
});

router.get("/solicitudes/getsolicitudesbyidseccion/:id_seccion", (req, res) => {
  solicitudes.getSolicitudesByIdSeccion(req, res);
});

router.post("/solicitudes/getsolicitudesusuariosbyidseccion", (req, res) => {
  solicitudes.getSolicitudesUsuariosByIdSeccion(req, res);
});

router.get("/solicitudes/getsolicitudesreporte", (req, res) => {
  solicitudes.getAllSolicitudes(req, res);
});

router.get(
  "/solicitudes/getsolicitudesusuariosbyidusuarioidmateria/:id_usuario/:id_materia",
  (req, res) => {
    solicitudes.getSolicitudesUsuariosByIdUsuarioIdMateria(req, res);
  }
);

router.get(
  "/solicitudes/getsolicitudesusuariosbyidusuario/:id_usuario",
  (req, res) => {
    solicitudes.getSolicitudesUsuariosByIdUsuario(req, res);
  }
);

router.put("/solicitudes/editsolicitud", (req, res) => {
  solicitudes.editSolicitud(req, res);
});

router.put("/solicitudes/archivarsolicitud/:id_solicitud", (req, res) => {
  solicitudes.archivarSolicitud(req, res);
});

router.put("/solicitudes/deletesolicitud/:id_solicitud", (req, res) => {
  solicitudes.deleteSolicitud(req, res);
});

router.post("/solicitudes/actualizaestado", (req, res) => {
  solicitudes.actualizaEstadoSolicitud(req, res);
});

module.exports = router;
