const express = require("express");
const router = express.Router();

const horarios = require("../controllers/horarios");

const Authenticate = require('./authenticator');

router.post("/horarios/creahorario", Authenticate, (req, res) => {
  horarios.createHorario(req, res);
});

router.get("/horarios/gethorariosbyidseccion/:id_seccion", Authenticate, (req, res) => {
  horarios.getHorariosByIdSeccion(req, res);
});

router.get("/horarios/getHorariosByIdUsuario/:id_usuario", Authenticate, (req, res) => {
  horarios.getHorariosByIdUsuario(req, res);
});

router.put(
  "/horarios/deletemateriasidusuarioidmateria/:id_evento", Authenticate, (req, res) => {
    horarios.deleteHorariosByIdUsuarioIdMateria(req, res);
  }
);

module.exports = router;
