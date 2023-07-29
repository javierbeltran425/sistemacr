const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");

router.post("/auth/signup", auth.signup);

router.post("/auth/login", auth.login);

module.exports = router;
