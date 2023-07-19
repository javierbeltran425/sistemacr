const knex = require("../db");

const getAllMaterias = async function (req, res) {
  try {
    const materias = await knex
      .select(
        "materias.id_materia",
        "materias.nombre",
        "materias.uv",
        knex.raw("STRING_AGG(DISTINCT carreras.nombre, '\n') as carreras"),
        knex.raw("MAX(secciones.numero) as numsecciones"),
        knex.raw("JSON_AGG(DISTINCT secciones) as arrsecciones")
      )
      .from("materias")
      .leftJoin(
        "materiasxcarreras",
        "materias.id_materia",
        "materiasxcarreras.id_materia"
      )
      .leftJoin(
        "carreras",
        "carreras.id_carrera",
        "materiasxcarreras.id_carrera"
      )
      .leftJoin("secciones", "secciones.id_materia", "materias.id_materia")
      .groupBy("materias.id_materia")
      .orderBy("materias.id_materia", "desc");
    res.json(materias);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getMateriasByIdUsuario = async function (req, res) {
  const { id_usuario } = req.params;

  try {
    const materias = await knex
      .select(
        "usuariosxmaterias.id_materia",
        knex.raw("ARRAY_AGG(secciones.id_seccion) as arrsecciones"),
        "materias.nombre",
        "materias.uv"
      )
      .from("usuariosxmaterias")
      .where({ id_usuario: id_usuario })
      .join("materias", "materias.id_materia", "usuariosxmaterias.id_materia")
      .leftJoin(
        "secciones",
        "secciones.id_seccion",
        "usuariosxmaterias.id_seccion"
      )
      .groupBy(
        "usuariosxmaterias.id_materia",
        "materias.nombre",
        "materias.uv"
      );
    res.json(materias);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getMateriaById = async function (req, res) {
  const { id_materia } = req.params;

  try {
    const materia = await knex
      .select("materias.id_materia", "materias.nombre", "materias.uv")
      .from("materias")
      .where({ id_materia: id_materia });

    res.json(materia);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const createMateria = async function (req, res) {
  const { id_materia, nombre, uv, numsecciones, carreras } = req.body;

  try {
    const newMateria = await knex("materias")
      .returning("id_materia")
      .insert({ id_materia: id_materia, nombre: nombre, uv: uv });

    if (carreras.length > 0) {
      const fieldsToInsert = carreras.map((carrera) => ({
        id_materia: newMateria[0].id_materia,
        id_carrera: carrera,
      }));
      await knex("materiasxcarreras").insert(fieldsToInsert);
    }

    const arrsecciones = Array.from({ length: numsecciones }, (_, i) => i + 1);
    const fieldsToInsert = arrsecciones.map((seccion) => ({
      id_seccion: newMateria[0].id_materia + seccion,
      id_materia: newMateria[0].id_materia,
      numero: seccion,
    }));
    await knex("secciones").insert(fieldsToInsert);

    res.json(newMateria);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const removeMateriaById = async function (req, res) {
  const { id_materia } = req.params;
  try {
    await knex("materiasxcarreras")
      .del()
      .where({ id_materia: id_materia })
      .then(async (resp) => {
        await knex("materias").where({ id_materia: id_materia }).del();

        res.json(resp);
      });
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const editMateria = async function (req, res) {
  const { id_materia, nombre, uv, numsecciones, carreras } = req.body;
  try {
    const editCarrera = await knex("materias")
      .where({ id_materia: id_materia })
      .update({ nombre: nombre, uv: uv });

    // handle carreras
    const currentCarreras = await knex
      .select("id_carrera")
      .from("materiasxcarreras")
      .where({ id_materia: id_materia });
    var arr = [];
    currentCarreras.forEach((element) => {
      arr.push(element.id_carrera);
    });
    const remove = arr.filter((element) => !carreras.includes(element));
    const insert = carreras.filter((element) => !arr.includes(element));
    if (insert.length != 0) {
      const fieldsToInsert = insert.map((element) => ({
        id_materia: id_materia,
        id_carrera: element,
      }));
      await knex("materiasxcarreras").insert(fieldsToInsert);
    }
    if (remove.length != 0) {
      await knex("materiasxcarreras")
        .del()
        .where({ id_materia: id_materia })
        .whereIn("id_carrera", remove);
    }

    // handle secciones
    let currentSecciones = await knex("secciones")
      .where({ id_materia: id_materia })
      .count();
    currentSecciones = parseInt(currentSecciones[0]?.count);
    let newSecciones = parseInt(numsecciones);
    if (currentSecciones < newSecciones) {
      const arrsecciones = Array.from(
        { length: newSecciones - currentSecciones },
        (_, i) => i + currentSecciones + 1
      );
      const fieldsToInsert = arrsecciones.map((seccion) => ({
        id_seccion: id_materia + seccion,
        id_materia: id_materia,
        numero: seccion,
      }));
      await knex("secciones").insert(fieldsToInsert);
    }
    if (currentSecciones > newSecciones) {
      const arrsecciones = Array.from(
        { length: currentSecciones - newSecciones },
        (_, i) => i + newSecciones + 1
      );
      await knex("secciones")
        .del()
        .where({ id_materia: id_materia })
        .whereIn("numero", arrsecciones);
    }

    res.json(editCarrera);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

module.exports = {
  getAllMaterias,
  getMateriasByIdUsuario,
  createMateria,
  removeMateriaById,
  editMateria,
  getMateriaById,
};
