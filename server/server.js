require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const port = process.env.NODE_LOCAL_PORT || 8000;
const basePath = process.env.BASE_PATH || "/";

const app = express();
app.use(basePath, express.static(path.join(__dirname, "public")));
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

app.listen(port, () => console.log(`Server running on PORT ${port}`));
