const express = require("express");
const router = express.Router();

const notificaciones = require("../controllers/notificaciones");

router.post("/notificaciones/envia/", (req, res) => {
  notificaciones.mailer(req, res);
});

router.post("/notificaciones/whatsapp/", (req, res) => {
  notificaciones.whatsappMail(req, res);
});

module.exports = router;
