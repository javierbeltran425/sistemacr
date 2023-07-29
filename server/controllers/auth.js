const knex = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { httpCodes } = require("../constants/httpCodes");
const apiError = require("../common/apiError");
const { tryCatch } = require("../utils/tryCatch");

const signup = tryCatch(async function (req, res) {
  const { email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUsuario = await knex("usuarios")
    .returning("id_usuario")
    .insert({ email: email, hashed_password: hashedPassword })
    .catch(() => {
      throw new apiError(
        httpCodes.BAD_REQUEST,
        "Ya existe un usuario con el correo electrónico ingresado."
      );
    });

  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "1hr",
  });

  res.json({ id_usuario: newUsuario[0].id_usuario, email, token });
});

const login = tryCatch(async function (req, res) {
  const { email, password } = req.body;

  const usuario = await knex
    .select("id_usuario", "email", "hashed_password", "nombre", "activo")
    .from("usuarios")
    .where({ email: email });

  if (Object.keys(usuario).length === 0)
    throw new apiError(httpCodes.NOT_FOUND, "El usuario ingresado no existe.");

  const success = await bcrypt.compare(password, usuario[0].hashed_password);

  if (success) {
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1hr",
    });

    res.json({
      id_usuario: usuario[0].id_usuario,
      email: usuario[0].email,
      nombre: usuario[0].nombre,
      activo: usuario[0].activo,
      token,
    });
  } else {
    throw new apiError(
      httpCodes.BAD_REQUEST,
      "La contraseña ingresada es incorrecta."
    );
  }
});

module.exports = { signup, login };
