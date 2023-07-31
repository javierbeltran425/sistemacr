const knex = require("../config/db");
const { tryCatch } = require("../utils/tryCatch");

const createHorario = tryCatch(async function (req, res) {
  const {
    id_usuario,
    id_materia,
    id_seccion,
    identificador,
    title,
    description,
    start,
    end,
  } = req.body;

  const newSolicitud = await knex("horarios").insert({
    id_usuario: id_usuario,
    id_materia: id_materia,
    id_seccion: id_seccion,
    identificador: identificador,
    titulo: title,
    descripcion: description,
    hora_inicio: start,
    hora_final: end,
  });

  res.json(newSolicitud);
});

const getHorariosByIdUsuario = tryCatch(async function (req, res) {
  const { id_usuario } = req.params;

  const horarios = await knex
    .select(
      "id_horario as id",
      "id_usuario",
      "id_materia",
      "id_seccion",
      "titulo as title",
      "hora_inicio as start",
      "hora_final as end",
      "descripcion as desc",
      "identificador"
    )
    .from("horarios")
    .where({ id_usuario: id_usuario });

  res.json(horarios);
});

const getHorariosByIdSeccion = tryCatch(async function (req, res) {
  const { id_seccion } = req.params;

  const horarios = await knex
    .select(
      "id_horario as id",
      "id_usuario",
      "id_materia",
      "id_seccion",
      "titulo as title",
      "hora_inicio as start",
      "hora_final as end",
      "descripcion as desc",
      "identificador"
    )
    .from("horarios")
    .where({ id_seccion: id_seccion });

  res.json(horarios);
});

const deleteHorariosByIdUsuarioIdMateria = tryCatch(async function (req, res) {
  const { id_evento } = req.params;

  const horarios = await knex("horarios")
    .where({ identificador: id_evento })
    .del();

  res.json(horarios);
});

module.exports = {
  createHorario,
  getHorariosByIdSeccion,
  getHorariosByIdUsuario,
  deleteHorariosByIdUsuarioIdMateria,
};
