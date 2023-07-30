require("dotenv").config();
const { cleanEnv, port, str } = require("envalid");
const env = cleanEnv(process.env, {
  PORT: port(),
  BASE_PATH: str(),
});
const nodePort = env.PORT;
const basePath = env.BASE_PATH;

const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES

const auth_routes = require("./routes/auth");
const usuarios_routes = require("./routes/usuarios");
const solicitudes_routes = require("./routes/solicitudes");
const carreras_routes = require("./routes/carreras");
const materias_routes = require("./routes/materias");
const horarios_routes = require("./routes/horarios");
const secciones_routes = require("./routes/secciones");
const notificaciones_routes = require("./routes/notificaciones");

// AUTHENTICATION

app.use(basePath, auth_routes);

// USUARIOS

app.use(basePath, usuarios_routes);

// SOLICITUDES

app.use(basePath, solicitudes_routes);

// CARRERAS

app.use(basePath, carreras_routes);

// MATERIAS

app.use(basePath, materias_routes);

// HORARIOS

app.use(basePath, horarios_routes);

// SECCIONES

app.use(basePath, secciones_routes);

// NOTIFICACIONES

app.use(basePath, notificaciones_routes);

app.use(errorHandler);

app.listen(nodePort, () => console.log(`Server running on PORT ${nodePort}`));
