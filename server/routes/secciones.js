const express = require("express");
const router = express.Router();

const secciones = require("../controllers/secciones");

router.get("/secciones/getseccionesbyidusuario/:id_usuario", (req, res) => {
  secciones.getSeccionesByIdUsuario(req, res);
});

router.get("/secciones/getseccionbyId/:id_seccion", (req, res) => {
  secciones.getSeccionById(req, res);
});

module.exports = router;
