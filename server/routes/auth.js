const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");

router.post("/auth/recovery", auth.generateRecoveryToken);

router.post("/auth/validateRecoveryToken", auth.validateRecoveryToken);

router.post("/auth/login", auth.login);

router.get("/auth/refresh", auth.handleRefreshToken);

router.get("/auth/logout", auth.handleLogout);

module.exports = router;
