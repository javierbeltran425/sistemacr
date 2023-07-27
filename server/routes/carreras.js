const express = require("express");
const router = express.Router();

const carreras = require("../controllers/carreras");

router.get("/carreras/getallcarreras", (req, res) => {
  carreras.getAllCarreras(req, res);
});

router.get("/carreras/getcarrerasbyidmateria/:id_materia", (req, res) => {
  carreras.getCarrerasByIdMateria(req, res);
});

router.post("/carreras/createcarrera", (req, res) => {
  carreras.createCarrera(req, res);
});

router.delete("/carreras/removecarrerabyid/:id_carrera", (req, res) => {
  carreras.removeCarreraById(req, res);
});

router.put("/carreras/editcarrera", (req, res) => {
  carreras.editCarrera(req, res);
});

module.exports = router;
