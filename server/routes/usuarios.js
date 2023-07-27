const express = require("express");
const router = express.Router();

const usuarios = require("../controllers/usuarios");

router.get("/usuarios/getallusuarios", (req, res) => {
  usuarios.getAllUsuarios(req, res);
});

router.get("/usuarios/getusuariobyid/:id_usuario", (req, res) => {
  usuarios.getUsuarioById(req, res);
});

router.get("/usuarios/getrolbyid/:id_usuario", (req, res) => {
  usuarios.getRolById(req, res);
});

router.post("/usuarios/createusuario", (req, res) => {
  usuarios.createUsuario(req, res);
});

router.post("/usuarios/bulkcreateusuario", (req, res) => {
  usuarios.bulkCreateUsuario(req, res);
});

router.put("/usuarios/editusuario", (req, res) => {
  usuarios.editUsuario(req, res);
});

router.put("/usuarios/changepassword", (req, res) => {
  usuarios.changePassword(req, res);
});

router.put("/usuarios/activateuser/:id_usuario", (req, res) => {
  usuarios.activateUser(req, res);
});

router.delete("/usuarios/removeusuariobyid/:id_usuario", (req, res) => {
  usuarios.removeUsuarioById(req, res);
});

router.post("/usuarios/usuarioinfo", (req, res) => {
  usuarios.getUsuarioInfo(req, res);
});

module.exports = router;
