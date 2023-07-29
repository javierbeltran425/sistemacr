const express = require("express");
const router = express.Router();

const carreras = require("../controllers/carreras");

const Authenticate = require('./authenticator');

router.get("/carreras/getallcarreras", Authenticate, (req, res) => {
  carreras.getAllCarreras(req, res);
});

router.get("/carreras/getcarrerasbyidmateria/:id_materia", Authenticate, (req, res) => {
  carreras.getCarrerasByIdMateria(req, res);
});

router.post("/carreras/createcarrera", Authenticate, (req, res) => {
  carreras.createCarrera(req, res);
});

router.delete("/carreras/removecarrerabyid/:id_carrera", Authenticate, (req, res) => {
  carreras.removeCarreraById(req, res);
});

router.put("/carreras/editcarrera", Authenticate, (req, res) => {
  carreras.editCarrera(req, res);
});

module.exports = router;
