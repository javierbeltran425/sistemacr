const express = require("express");
const router = express.Router();

const carreras = require("../controllers/carreras");

const Authenticate = require("../middleware/authenticator");

router.get("/carreras/getallcarreras", Authenticate, carreras.getAllCarreras);

router.get(
  "/carreras/getcarrerasbyidmateria/:id_materia",
  Authenticate,
  carreras.getCarrerasByIdMateria
);

router.post("/carreras/createcarrera", Authenticate, carreras.createCarrera);

router.delete(
  "/carreras/removecarrerabyid/:id_carrera",
  Authenticate,

  carreras.removeCarreraById
);

router.put("/carreras/editcarrera", Authenticate, carreras.editCarrera);

module.exports = router;
