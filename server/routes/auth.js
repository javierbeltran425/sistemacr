const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");

router.post("/auth/signup", (req, res) => {
  auth.signup(req, res);
});

router.post("/auth/login", (req, res) => {
  auth.login(req, res);
});

module.exports = router;
