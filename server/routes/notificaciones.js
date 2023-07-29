const express = require("express");
const router = express.Router();

const notificaciones = require("../controllers/notificaciones");

const Authenticate = require("../middleware/authenticator");

router.post("/notificaciones/envia/", notificaciones.mailer);

router.post(
  "/notificaciones/whatsapp/",
  Authenticate,
  notificaciones.whatsappMail
);

module.exports = router;
