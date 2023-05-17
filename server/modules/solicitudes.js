const knex = require("../db");

const createSolicitud = async function (req, res) {
  const {
    id_usuario,
    id_profesor,
    id_materia,
    title,
    description,
    tipo,
    start,
    end,
  } = req.body;

  try {
    const newSolicitud = await knex("solicitudes")
      .returning("id_solicitud")
      .insert({
        id_usuario: id_usuario,
        id_profesor: id_profesor,
        id_materia: id_materia,
        titulo: title,
        descripcion: description,
        tipo: tipo,
        hora_inicio: start,
        hora_final: end,
      });
    console.log(newSolicitud);
    res.json(newSolicitud);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getSolicitudesByIdUsuarioIdMateria = async function (req, res) {
  const { id_profesor, id_materia } = req.params;
  console.log(req.params);
  try {
    const solicitudes = await knex
      .select(
        "id_solicitud as id",
        "id_usuario",
        "id_profesor",
        "id_materia",
        "titulo as title",
        "hora_inicio as start",
        "hora_final as end",
        "descripcion as desc",
        "tipo"
      )
      .from("solicitudes")
      .where({ id_profesor: id_profesor })
      .andWhere({ id_materia: id_materia });
    res.json(solicitudes);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getSolicitudesUsuariosByIdUsuarioIdMateria = async function (req, res) {
  const { id_usuario, id_materia } = req.params;
  console.log(req.params);
  try {
    const solicitudes = await knex
      .select(
        "solicitudes.id_solicitud as id",
        "solicitudes.id_usuario",
        "solicitudes.id_profesor",
        "solicitudes.id_materia",
        "solicitudes.titulo as title",
        "solicitudes.hora_inicio as start",
        "solicitudes.hora_final as end",
        "solicitudes.descripcion as desc",
        "solicitudes.tipo",
        "usuarios.nombre",
        "usuarios.email"
      )
      .from("solicitudes")
      .where({ id_profesor: id_usuario })
      .andWhere({ id_materia: id_materia })
      .join("usuarios", "usuarios.id_usuario", "solicitudes.id_usuario");
    res.json(solicitudes);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getSolicitudesUsuariosByIdUsuario = async function (req, res) {
  const { id_usuario } = req.params;
  console.log(req.params);
  try {
    const solicitudes = await knex
      .select(
        "solicitudes.id_solicitud as id",
        "solicitudes.id_usuario",
        "solicitudes.id_profesor",
        "solicitudes.id_materia",
        "solicitudes.titulo as title",
        "solicitudes.hora_inicio as start",
        "solicitudes.hora_final as end",
        "solicitudes.descripcion as desc",
        "solicitudes.tipo",
        "usuarios.nombre",
        "usuarios.email"
      )
      .from("solicitudes")
      .where({ id_profesor: id_usuario })
      .join("usuarios", "usuarios.id_usuario", "solicitudes.id_usuario");
    res.json(solicitudes);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const editSolicitud = async function (req, res) {
  const { id_solicitud, title, description, tipo, start, end } = req.body;
  try {
    const updatedSolicitud = await knex("solicitudes")
      .where({ id_solicitud: id_solicitud })
      .update({
        titulo: title,
        descripcion: description,
        tipo: tipo,
        hora_inicio: start,
        hora_final: end,
      });
    res.json(updatedSolicitud);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const deleteSolicitud = async function (req, res) {
  const { id_solicitud } = req.params;
  try {
    const deletedSolicitud = await knex("solicitudes")
      .where({ id_solicitud: id_solicitud })
      .del();
    res.json(deletedSolicitud);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

module.exports = {
  createSolicitud,
  getSolicitudesByIdUsuarioIdMateria,
  getSolicitudesUsuariosByIdUsuarioIdMateria,
  getSolicitudesUsuariosByIdUsuario,
  deleteSolicitud,
  editSolicitud,
};
