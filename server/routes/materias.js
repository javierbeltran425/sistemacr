const express = require("express");
const router = express.Router();

const materias = require("../controllers/materias");

router.get("/materias/getallmaterias", (req, res) => {
  materias.getAllMaterias(req, res);
});

router.get("/materias/getMateriaById/:id_materia", (req, res) => {
  materias.getMateriaById(req, res);
});

router.get("/materias/getmateriasbyidusuario/:id_usuario", (req, res) => {
  materias.getMateriasByIdUsuario(req, res);
});

router.post("/materias/createmateria", (req, res) => {
  materias.createMateria(req, res);
});

router.put("/materias/editmateria", (req, res) => {
  materias.editMateria(req, res);
});

router.delete("/materias/removemateriabyid/:id_materia", (req, res) => {
  materias.removeMateriaById(req, res);
});

module.exports = router;
