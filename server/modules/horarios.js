const knex = require("../db");

const createHorario = async function (req, res) {
  const {
    id_usuario,
    id_materia,
    identificador,
    title,
    description,
    start,
    end,
  } = req.body;
  console.log("Body recibido: ", req.body);
  try {
    const newSolicitud = await knex("horarios").insert({
      id_usuario: id_usuario,
      id_materia: id_materia,
      identificador: identificador,
      titulo: title,
      descripcion: description,
      hora_inicio: start,
      hora_final: end,
    });

    res.json(newSolicitud);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getHorariosByIdUsuario = async function (req, res) {
  const { id_usuario } = req.params;
  try {
    const horarios = await knex
      .select(
        "id_horario as id",
        "id_usuario",
        "id_materia",
        "titulo as title",
        "hora_inicio as start",
        "hora_final as end",
        "descripcion as desc",
        "identificador"
      )
      .from("horarios")
      .where({ id_usuario: id_usuario });
    res.json(horarios);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getHorariosByIdUsuarioIdMateria = async function (req, res) {
  const { id_usuario, id_materia } = req.params;
  try {
    const horarios = await knex
      .select(
        "id_horario as id",
        "titulo as title",
        "hora_inicio as start",
        "hora_final as end",
        "descripcion as desc",
        "identificador"
      )
      .from("horarios")
      .where({ id_usuario: id_usuario, id_materia: id_materia });
    res.json(horarios);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const deleteHorariosByIdUsuarioIdMateria = async function (req, res) {
  const { id_evento } = req.params;
  console.log(
    "🚀 ~ file: horarios.js:45 ~ deleteHorariosByIdUsuarioIdMateria ~ id_evento:",
    id_evento
  );
  try {
    const horarios = await knex("horarios")
      .where({ identificador: id_evento })
      .del();
    res.json(horarios);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

module.exports = {
  createHorario,
  getHorariosByIdUsuarioIdMateria,
  getHorariosByIdUsuario,
  deleteHorariosByIdUsuarioIdMateria,
};
