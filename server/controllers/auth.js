const knex = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async function (req, res) {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUsuario = await knex("usuarios")
      .returning("id_usuario")
      .insert({ email: email, hashed_password: hashedPassword });
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ id_usuario: newUsuario[0].id_usuario, email, token });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const login = async function (req, res) {
  const { email, password } = req.body;
  try {
    const usuario = await knex
      .select("id_usuario", "email", "hashed_password", "nombre", "activo")
      .from("usuarios")
      .where({ email: email });
    console.log("🚀 ~ file: auth.js:29 ~ login ~ usuario:", usuario)

    if (Object.keys(usuario).length === 0)
      return res.json({ error: "El usuario ingresado no existe!" });

    const success = await bcrypt.compare(password, usuario[0].hashed_password);
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    if (success) {
      res.json({
        id_usuario: usuario[0].id_usuario,
        email: usuario[0].email,
        nombre: usuario[0].nombre,
        activo: usuario[0].activo,
        token,
      });
    } else {
      res.json({ error: "La contraseña es incorrecta!" });
    }
  } catch (error) {
    res.status(400).send({ error: "El servicio no está disponible" });
    console.log(error);
  }
};

module.exports = { signup, login };
