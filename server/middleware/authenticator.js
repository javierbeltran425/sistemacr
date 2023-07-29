const jwt = require("jsonwebtoken");

const { cleanEnv, str } = require("envalid");
const secretKey = cleanEnv(process.env, {
  SECRET_KEY: str(),
}).SECRET_KEY;

function Authenticate(req, res, next) {
  const token = req.header("Authorization");

  if (!token)
    return res.status(401).json({ error: true, message: "Acceso denegado" });

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ error: true, message: "Invalid token" });
  }
}

module.exports = Authenticate;
