const knex = require("../db");

const createSolicitud = async function (req, res) {
  const {
    id_usuario,
    id_materia,
    id_seccion,
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
        id_materia: id_materia,
        id_seccion: id_seccion,
        titulo: title,
        descripcion: description,
        tipo: tipo,
        hora_inicio: start,
        hora_final: end,
        estado: "PENDIENTE",
      });
    console.log(newSolicitud);
    res.json(newSolicitud);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getSolicitudesByIdSeccion = async function (req, res) {
  const { id_usuario, id_seccion } = req.params;
  console.log(req.params);
  try {
    const solicitudes = await knex
      .select(
        "id_solicitud as id",
        "id_usuario",
        "id_materia",
        "id_seccion",
        "titulo as title",
        "hora_inicio as start",
        "hora_final as end",
        "descripcion as desc",
        "tipo",
        "estado"
      )
      .from("solicitudes")
      .where({ id_seccion: id_seccion });
    res.json(solicitudes);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getSolicitudesUsuariosByIdSeccion = async function (req, res) {
  const { id_seccion } = req.body;
  try {
    const solicitudes = await knex
      .select(
        "solicitudes.id_solicitud as id",
        "solicitudes.id_usuario",
        "solicitudes.id_materia",
        "solicitudes.id_seccion",
        "solicitudes.titulo as title",
        "solicitudes.hora_inicio as start",
        "solicitudes.hora_final as end",
        "solicitudes.descripcion as desc",
        "solicitudes.tipo",
        "solicitudes.estado",
        "usuarios.nombre",
        "usuarios.email"
      )
      .from("solicitudes")
      .whereIn("id_seccion", id_seccion)
      .join("usuarios", "usuarios.id_usuario", "solicitudes.id_usuario");
    res.json(solicitudes);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getAllSolicitudes = async (req, res) => {
  try {
    const solicitudes = await knex
      .select(
        "solicitudes.id_usuario",
        "solicitudes.id_materia",
        "solicitudes.id_seccion",
        "solicitudes.titulo",
        "solicitudes.descripcion",
        "solicitudes.tipo",
        "solicitudes.estado"
      )
      .from("solicitudes");

    res.json(solicitudes);
  } catch (error) {
    console.error(error);
  }
};

const editSolicitud = async function (req, res) {
  const { id_solicitud, title, description, tipo, start, end, estado } =
    req.body;
  try {
    const updatedSolicitud = await knex("solicitudes")
      .where({ id_solicitud: id_solicitud })
      .update({
        titulo: title,
        descripcion: description,
        tipo: tipo,
        hora_inicio: start,
        hora_final: end,
        estado: estado,
      });
    res.json(updatedSolicitud);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const actualizaEstadoSolicitud = async function (req, res) {
  const { id_solicitud, estado } = req.body;
  try {
    const updatedSolicitud = await knex("solicitudes")
      .where({ id_solicitud: id_solicitud })
      .update({
        estado: estado,
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
  actualizaEstadoSolicitud,
  getSolicitudesByIdSeccion,
  getSolicitudesUsuariosByIdSeccion,
  deleteSolicitud,
  editSolicitud,
  getAllSolicitudes,
};
