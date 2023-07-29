const express = require("express");
const router = express.Router();

const horarios = require("../controllers/horarios");

const Authenticate = require("../middleware/authenticator");

router.post("/horarios/creahorario", Authenticate, horarios.createHorario);

router.get(
  "/horarios/gethorariosbyidseccion/:id_seccion",
  Authenticate,
  horarios.getHorariosByIdSeccion
);

router.get(
  "/horarios/getHorariosByIdUsuario/:id_usuario",
  Authenticate,
  horarios.getHorariosByIdUsuario
);

router.put(
  "/horarios/deletemateriasidusuarioidmateria/:id_evento",
  Authenticate,
  horarios.deleteHorariosByIdUsuarioIdMateria
);

module.exports = router;
