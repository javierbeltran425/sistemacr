const express = require("express");
const router = express.Router();

const usuarios = require("../controllers/usuarios");

const Authenticate = require("../middleware/authenticator");

router.get("/usuarios/getallusuarios", Authenticate, usuarios.getAllUsuarios);

router.get(
  "/usuarios/getusuariobyid/:id_usuario",
  Authenticate,
  usuarios.getUsuarioById
);

router.get(
  "/usuarios/getrolbyid/:id_usuario",
  Authenticate,
  usuarios.getRolById
);

router.post("/usuarios/createusuario", Authenticate, usuarios.createUsuario);

router.post(
  "/usuarios/bulkcreateusuario",
  Authenticate,
  usuarios.bulkCreateUsuario
);

router.put("/usuarios/editusuario", Authenticate, usuarios.editUsuario);

router.put("/usuarios/changepassword", Authenticate, usuarios.changePassword);

router.put(
  "/usuarios/activateuser/:id_usuario",
  Authenticate,
  usuarios.activateUser
);

router.delete(
  "/usuarios/removeusuariobyid/:id_usuario",
  Authenticate,
  usuarios.removeUsuarioById
);

router.post("/usuarios/usuarioinfo", Authenticate, usuarios.getUsuarioInfo);

module.exports = router;
