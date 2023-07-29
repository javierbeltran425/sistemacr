const express = require("express");
const router = express.Router();

const usuarios = require("../controllers/usuarios");

const Authenticate = require('./authenticator');

router.get("/usuarios/getallusuarios", Authenticate, (req, res) => {
  usuarios.getAllUsuarios(req, res);
});

router.get("/usuarios/getusuariobyid/:id_usuario", Authenticate, (req, res) => {
  usuarios.getUsuarioById(req, res);
});

router.get("/usuarios/getrolbyid/:id_usuario", Authenticate, (req, res) => {
  usuarios.getRolById(req, res);
});

router.post("/usuarios/createusuario", Authenticate, (req, res) => {
  usuarios.createUsuario(req, res);
});

router.post("/usuarios/bulkcreateusuario", Authenticate, (req, res) => {
  usuarios.bulkCreateUsuario(req, res);
});

router.put("/usuarios/editusuario", Authenticate, (req, res) => {
  usuarios.editUsuario(req, res);
});

router.put("/usuarios/changepassword", Authenticate, (req, res) => {
  usuarios.changePassword(req, res);
});

router.put("/usuarios/activateuser/:id_usuario", Authenticate, (req, res) => {
  usuarios.activateUser(req, res);
});

router.delete("/usuarios/removeusuariobyid/:id_usuario", Authenticate, (req, res) => {
  usuarios.removeUsuarioById(req, res);
});

router.post("/usuarios/usuarioinfo", Authenticate, (req, res) => {
  usuarios.getUsuarioInfo(req, res);
});

module.exports = router;
