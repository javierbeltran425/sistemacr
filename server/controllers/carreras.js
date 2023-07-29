const { httpCodes } = require("../constants/httpCodes");
const { errorMessages } = require("../constants/errorMessages");
const knex = require("../db");
const apiError = require("../common/apiError");
const { tryCatch } = require("../utils/tryCatch");

const getAllCarreras = tryCatch(async function (req, res) {
  const carreras = await knex
    .select("id_carrera", "nombre", "facultad")
    .from("carreras")
    .orderBy("id_carrera", "desc");

  res.json(carreras);
});

const getCarrerasByIdMateria = tryCatch(async function (req, res) {
  const { id_materia } = req.params;

  const carreras = await knex
    .select("materiasxcarreras.id_carrera")
    .from("materiasxcarreras")
    .where({ id_materia: id_materia });

  res.json(carreras);
});

const createCarrera = tryCatch(async function (req, res) {
  const { id_carrera, nombre, facultad } = req.body;

  const newCarrera = await knex("carreras")
    .insert({
      id_carrera: id_carrera,
      nombre: nombre,
      facultad: facultad,
    })
    .catch(() => {
      throw new apiError(
        httpCodes.BAD_REQUEST,
        errorMessages.UNIQUE_CONSTRAINT
      );
    });

  res.json(newCarrera);
});

const removeCarreraById = tryCatch(async function (req, res) {
  const { id_carrera } = req.params;

  const removedCarrera = await knex("carreras")
    .where({ id_carrera: id_carrera })
    .del();

  res.json(removedCarrera);
});

const editCarrera = tryCatch(async function (req, res) {
  const { id_carrera, nombre, facultad } = req.body;

  const updatedCarrera = await knex("carreras")
    .where({ id_carrera: id_carrera })
    .update({ nombre: nombre, facultad: facultad });

  res.json(updatedCarrera);
});

module.exports = {
  getAllCarreras,
  getCarrerasByIdMateria,
  createCarrera,
  removeCarreraById,
  editCarrera,
};
