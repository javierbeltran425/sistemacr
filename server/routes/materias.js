const express = require("express");
const router = express.Router();

const materias = require("../controllers/materias");

const Authenticate = require('./authenticator');

router.get("/materias/getallmaterias", Authenticate, (req, res) => {
  materias.getAllMaterias(req, res);
});

router.get("/materias/getMateriaById/:id_materia", Authenticate, (req, res) => {
  materias.getMateriaById(req, res);
});

router.get("/materias/getmateriasbyidusuario/:id_usuario", Authenticate, (req, res) => {
  materias.getMateriasByIdUsuario(req, res);
});

router.post("/materias/createmateria", Authenticate, (req, res) => {
  materias.createMateria(req, res);
});

router.put("/materias/editmateria", Authenticate, (req, res) => {
  materias.editMateria(req, res);
});

router.delete("/materias/removemateriabyid/:id_materia", Authenticate, (req, res) => {
  materias.removeMateriaById(req, res);
});

module.exports = router;
