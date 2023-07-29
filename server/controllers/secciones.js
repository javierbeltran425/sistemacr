const knex = require("../db");
const { tryCatch } = require("../utils/tryCatch");

const getSeccionesByIdUsuario = tryCatch(async function (req, res) {
  const { id_usuario } = req.params;

  const secciones = await knex
    .select(
      "usuariosxmaterias.id_materia",
      "usuariosxmaterias.id_seccion",
      "secciones.numero",
      "secciones.id_profesor",
      "materias.nombre",
      "materias.uv"
    )
    .from("usuariosxmaterias")
    .where({ id_usuario: id_usuario })
    .join("materias", "materias.id_materia", "usuariosxmaterias.id_materia")
    .join("secciones", "secciones.id_seccion", "usuariosxmaterias.id_seccion")
    .orderBy("nombre", "asc")
    .orderBy("numero", "asc");

  res.json(secciones);
});

const getSeccionById = tryCatch(async function (req, res) {
  const { id_seccion } = req.params;

  const seccion = await knex
    .select("secciones.id_seccion", "secciones.numero")
    .from("secciones")
    .where({ id_seccion: id_seccion });

  res.json(seccion);
});

module.exports = { getSeccionesByIdUsuario, getSeccionById };
