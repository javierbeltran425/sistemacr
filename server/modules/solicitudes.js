const knex = require("../db");

const createSolicitud = async function (req, res) {
  const {
    id_usuario,
    id_profesor,
    id_materia,
    title,
    description,
    type,
    start,
    end,
  } = req.body;

  try {
    const newSolicitud = await knex("solicitudes").insert({
      id_usuario: id_usuario,
      id_profesor: id_profesor,
      id_materia: id_materia,
      titulo: title,
      descripcion: description,
      tipo: type,
      hora_inicio: start,
      hora_final: end,
    });

    res.json(newSolicitud);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getSolicitudesByIdUsuarioIdMateria = async function (req, res) {
  const { id_usuario, id_materia } = req.params;
  console.log(req.params);
  try {
    const solicitudes = await knex
      .select(
        "id_solicitud as id",
        "id_profesor",
        "id_materia",
        "titulo as title",
        "hora_inicio as start",
        "hora_final as end",
        "descripcion as desc"
      )
      .from("solicitudes")
      .where({ id_profesor: id_usuario })
      .andWhere({ id_materia: id_materia });
    res.json(solicitudes);
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
    res.json(deleteSolicitud);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

module.exports = {
  createSolicitud,
  getSolicitudesByIdUsuarioIdMateria,
  deleteSolicitud,
};
