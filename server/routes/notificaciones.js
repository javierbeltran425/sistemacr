const express = require("express");
const router = express.Router();

const notificaciones = require("../controllers/notificaciones");

const Authenticate = require('./authenticator');

router.post("/notificaciones/envia/", Authenticate, (req, res) => {
  notificaciones.mailer(req, res);
});

router.post("/notificaciones/whatsapp/", Authenticate, (req, res) => {
  notificaciones.whatsappMail(req, res);
});

module.exports = router;
