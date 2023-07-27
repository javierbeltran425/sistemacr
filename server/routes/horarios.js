const express = require("express");
const router = express.Router();

const horarios = require("../controllers/horarios");

router.post("/horarios/creahorario", (req, res) => {
  horarios.createHorario(req, res);
});

router.get("/horarios/gethorariosbyidseccion/:id_seccion", (req, res) => {
  horarios.getHorariosByIdSeccion(req, res);
});

router.get("/horarios/getHorariosByIdUsuario/:id_usuario", (req, res) => {
  horarios.getHorariosByIdUsuario(req, res);
});

router.put(
  "/horarios/deletemateriasidusuarioidmateria/:id_evento",
  (req, res) => {
    horarios.deleteHorariosByIdUsuarioIdMateria(req, res);
  }
);

module.exports = router;
