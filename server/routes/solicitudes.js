const express = require("express");
const router = express.Router();

const solicitudes = require("../controllers/solicitudes");

const Authenticate = require("../middleware/authenticator");

router.post(
  "/solicitudes/createsolicitud",
  Authenticate,
  solicitudes.createSolicitud
);

router.get(
  "/solicitudes/getsolicitudesbyidseccion/:id_seccion",
  Authenticate,
  solicitudes.getSolicitudesByIdSeccion
);

router.post(
  "/solicitudes/getsolicitudesusuariosbyidseccion",
  Authenticate,
  solicitudes.getSolicitudesUsuariosByIdSeccion
);

router.get(
  "/solicitudes/getsolicitudesreporte",
  Authenticate,
  solicitudes.getAllSolicitudes
);

router.put(
  "/solicitudes/editsolicitud",
  Authenticate,
  solicitudes.editSolicitud
);

router.put(
  "/solicitudes/archivarsolicitud/:id_solicitud",
  Authenticate,
  solicitudes.archivarSolicitud
);

router.put(
  "/solicitudes/deletesolicitud/:id_solicitud",
  Authenticate,
  solicitudes.deleteSolicitud
);

router.post(
  "/solicitudes/actualizaestado",
  Authenticate,
  solicitudes.actualizaEstadoSolicitud
);

module.exports = router;
