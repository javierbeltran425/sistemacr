const knex = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { httpCodes } = require("../constants/httpCodes");
const apiError = require("../common/apiError");
const { tryCatch } = require("../utils/tryCatch");
const nodemailer = require("nodemailer");

const { cleanEnv, str, json } = require("envalid");
const env = cleanEnv(process.env, {
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  NODEM_USER: str(),
  NODEM_PASSWORD: str(),
});
const accessSecret = env.ACCESS_TOKEN_SECRET;
const refreshSecret = env.REFRESH_TOKEN_SECRET;

const generateRecoveryToken = tryCatch(async function (req, res) {
  const { email } = req.body;

  try {
    const accessToken = jwt.sign(
      {
        Usuario: {
          email: email,
        },
      },
      accessSecret,
      { expiresIn: "5m" }
    );

    await knex("usuarios")
      .where({ email: email })
      .update({ recovery_token: accessToken });

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: `${env.NODEM_USER}`, // generated ethereal user
        pass: `${env.NODEM_PASSWORD}`, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${env.NODEM_USER}`,
      to: `${email}`,
      subject: "RECUPERACIÓN DE CONTRASEÑA",
      html: `
          <div>
            <h3>Se ha realizado una solicitud para cambiar tu contraseña.</h3>

            <p>Para proceder con el cambio de contraseña ingresa a esta url:</p>

            <a href="http://localhost:3000/#/recovery/?tat=${accessToken}" >http://localhost:3000/#/recovery/</a>

            <h5>Si usted no ha solicitado cambio de contraseña haga caso omiso a este correo.</h5>
          </div>
        `, // html body
    });

    res.status(200).json({ error: false, message: info })
  } catch (error) {
    res.status(400).json({ error: true, message: error.message })
  }


})

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

module.exports = { generateRecoveryToken, login, handleRefreshToken, handleLogout };
