const knex = require("../db");

const getAllCarreras = async function (req, res) {
  try {
    const carreras = await knex
      .select("id_carrera", "nombre", "facultad")
      .from("carreras")
      .orderBy("id_carrera", "desc");
    res.json(carreras);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getCarrerasByIdMateria = async function (req, res) {
  const { id_materia } = req.params;

  try {
    const carreras = await knex
      .select("materiasxcarreras.id_carrera")
      .from("materiasxcarreras")
      .where({ id_materia: id_materia });
    res.json(carreras);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const createCarrera = async function (req, res) {
  const { id_carrera, nombre, facultad } = req.body;

  try {
    const newCarrera = await knex("carreras").insert({
      id_carrera: id_carrera,
      nombre: nombre,
      facultad: facultad,
    });

    res.json(newCarrera);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const removeCarreraById = async function (req, res) {
  const { id_carrera } = req.params;
  try {
    const removedCarrera = await knex("carreras")
      .where({ id_carrera: id_carrera })
      .del();
    res.json(removedCarrera);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const editCarrera = async function (req, res) {
  const { id_carrera, nombre, facultad } = req.body;
  try {
    const updatedCarrera = await knex("carreras")
      .where({ id_carrera: id_carrera })
      .update({ nombre: nombre, facultad: facultad });
    res.json(updatedCarrera);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

module.exports = {
  getAllCarreras,
  getCarrerasByIdMateria,
  createCarrera,
  removeCarreraById,
  editCarrera,
};
