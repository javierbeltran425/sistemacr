const express = require("express");
const router = express.Router();

const materias = require("../controllers/materias");

const Authenticate = require("../middleware/authenticator");

router.get("/materias/getallmaterias", Authenticate, materias.getAllMaterias);

router.get(
  "/materias/getMateriaById/:id_materia",
  Authenticate,
  materias.getMateriaById
);

router.get(
  "/materias/getmateriasbyidusuario/:id_usuario",
  Authenticate,
  materias.getMateriasByIdUsuario
);

router.post("/materias/createmateria", Authenticate, materias.createMateria);

router.put("/materias/editmateria", Authenticate, materias.editMateria);

router.delete(
  "/materias/removemateriabyid/:id_materia",
  Authenticate,
  materias.removeMateriaById
);

module.exports = router;
