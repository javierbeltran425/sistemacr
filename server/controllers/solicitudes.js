const knex = require("../db");
const { tryCatch } = require("../utils/tryCatch");

const createSolicitud = tryCatch(async function (req, res) {
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

  res.json(newSolicitud);
});

const getSolicitudesByIdSeccion = tryCatch(async function (req, res) {
  const { id_seccion } = req.params;

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
});

const getSolicitudesUsuariosByIdSeccion = tryCatch(async function (req, res) {
  const { id_seccion } = req.body;

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
    .whereNot({ archivada: true })
    .join("usuarios", "usuarios.id_usuario", "solicitudes.id_usuario");

  res.json(solicitudes);
});

const getAllSolicitudes = tryCatch(async (req, res) => {
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
});

const editSolicitud = tryCatch(async function (req, res) {
  const { id_solicitud, title, description, tipo, start, end, estado } =
    req.body;

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
});

const actualizaEstadoSolicitud = tryCatch(async function (req, res) {
  const { id_solicitud, estado } = req.body;

  const updatedSolicitud = await knex("solicitudes")
    .where({ id_solicitud: id_solicitud })
    .update({
      estado: estado,
    });
  res.json(updatedSolicitud);
});

const archivarSolicitud = tryCatch(async function (req, res) {
  const { id_solicitud } = req.params;

  const updatedSolicitud = await knex("solicitudes")
    .where({ id_solicitud: id_solicitud })
    .update({
      archivada: true,
    });

  res.json(updatedSolicitud);
});

const deleteSolicitud = tryCatch(async function (req, res) {
  const { id_solicitud } = req.params;

  const deletedSolicitud = await knex("solicitudes")
    .where({ id_solicitud: id_solicitud })
    .del();

  res.json(deletedSolicitud);
});

module.exports = {
  createSolicitud,
  actualizaEstadoSolicitud,
  getSolicitudesByIdSeccion,
  getSolicitudesUsuariosByIdSeccion,
  deleteSolicitud,
  editSolicitud,
  getAllSolicitudes,
  archivarSolicitud,
};
