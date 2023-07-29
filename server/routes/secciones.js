const express = require("express");
const router = express.Router();

const secciones = require("../controllers/secciones");

const Authenticate = require("../middleware/authenticator");

router.get(
  "/secciones/getseccionesbyidusuario/:id_usuario",
  Authenticate,
  secciones.getSeccionesByIdUsuario
);

router.get(
  "/secciones/getseccionbyId/:id_seccion",
  Authenticate,
  secciones.getSeccionById
);

module.exports = router;
