const express = require("express");
const router = express.Router();

const secciones = require("../controllers/secciones");

const Authenticate = require('./authenticator');

router.get("/secciones/getseccionesbyidusuario/:id_usuario", Authenticate, (req, res) => {
  secciones.getSeccionesByIdUsuario(req, res);
});

router.get("/secciones/getseccionbyId/:id_seccion", Authenticate, (req, res) => {
  secciones.getSeccionById(req, res);
});

module.exports = router;
