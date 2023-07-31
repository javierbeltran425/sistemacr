const knex = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { httpCodes } = require("../constants/httpCodes");
const apiError = require("../common/apiError");
const { tryCatch } = require("../utils/tryCatch");

const { cleanEnv, str } = require("envalid");
const env = cleanEnv(process.env, {
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
});
const accessSecret = env.ACCESS_TOKEN_SECRET;
const refreshSecret = env.REFRESH_TOKEN_SECRET;

const login = tryCatch(async function (req, res) {
  const { email, password } = req.body;

  const usuario = await knex
    .select("id_usuario", "email", "rol", "hashed_password", "nombre", "activo")
    .from("usuarios")
    .where({ email: email })
    .catch(() => {
      console.log(error);
    });

  if (Object.keys(usuario).length === 0)
    throw new apiError(httpCodes.NOT_FOUND, "El usuario ingresado no existe.");

  const id_usuario = usuario[0].id_usuario;
  const nombre = usuario[0].nombre;
  const rol = usuario[0].rol;
  const activo = usuario[0].activo;

  const success = await bcrypt.compare(password, usuario[0].hashed_password);

  if (!success)
    throw new apiError(
      httpCodes.UNAUTHORIZED,
      "La contraseña ingresada es incorrecta."
    );

  const accessToken = jwt.sign(
    {
      Usuario: {
        id_usuario: id_usuario,
        rol: rol,
      },
    },
    accessSecret,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign({ id_usuario: id_usuario }, refreshSecret, {
    expiresIn: "15d",
  });

  await knex("usuarios").where({ id_usuario: id_usuario }).update({
    refresh_token: refreshToken,
  });

  res
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      id_usuario,
      email: usuario[0].email,
      nombre,
      rol,
      activo,
      accessToken,
    });
});

const handleRefreshToken = tryCatch(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) throw new apiError(httpCodes.UNAUTHORIZED, "No content");

  const refreshToken = cookies.jwt;

  const usuario = await knex("usuarios").where({
    refresh_token: refreshToken,
  });
  if (Object.keys(usuario).length === 0)
    throw new apiError(httpCodes.FORBIDDEN, "Forbidden");

  const id_usuario = usuario[0].id_usuario;
  const nombre = usuario[0].nombre;
  const rol = usuario[0].rol;
  const activo = usuario[0].activo;

  // evaluate jwt
  jwt.verify(refreshToken, refreshSecret, (err, decoded) => {
    if (err || id_usuario !== decoded.id_usuario)
      throw new apiError(httpCodes.FORBIDDEN, "Access denied");

    const accessToken = jwt.sign(
      {
        Usuario: {
          id_usuario: id_usuario,
          rol: rol,
        },
      },
      accessSecret,
      { expiresIn: "1h" }
    );

    res.json({
      id_usuario,
      email: usuario[0].email,
      nombre,
      rol,
      activo,
      accessToken,
    });
  });
});

const handleLogout = tryCatch(async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;

  if (!cookies?.jwt) throw new apiError(httpCodes.NO_CONTENT, "No content");

  const refreshToken = cookies.jwt;

  const usuario = await knex("usuarios").where({
    refresh_token: refreshToken,
  });
  if (Object.keys(usuario).length === 0) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  } else {
    await knex("usuarios").where({ id_usuario: usuario[0].id_usuario }).update({
      refresh_token: "",
    });
  }

  res
    .clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
    .sendStatus(204);
});

module.exports = { login, handleRefreshToken, handleLogout };
