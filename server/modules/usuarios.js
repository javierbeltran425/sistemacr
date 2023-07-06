const knex = require("../db");
const bcrypt = require("bcrypt");

const getAllUsuarios = async function (req, res) {
  try {
    const usuarios = await knex
      .select(
        "usuarios.id_usuario",
        "usuarios.id_carrera",
        "usuarios.email",
        "usuarios.nombre",
        "usuarios.rol",
        knex.raw("STRING_AGG(DISTINCT carreras.nombre, '\n') as carrera"),
        knex.raw("STRING_AGG(DISTINCT materias.nombre,  '\n') as materias"),
        knex.raw("ARRAY_AGG(materias.id_materia) as id_materia")
      )
      .from("usuarios")
      .leftJoin("carreras", "usuarios.id_carrera", "carreras.id_carrera")
      .leftJoin(
        "usuariosxmaterias",
        "usuarios.id_usuario",
        "usuariosxmaterias.id_usuario"
      )
      .leftJoin(
        "materias",
        "materias.id_materia",
        "usuariosxmaterias.id_materia"
      )
      .groupBy("usuarios.id_usuario")
      .orderBy("usuarios.id_usuario", "desc");
    res.json(usuarios);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getUsuarioById = async function (req, res) {
  const { id_usuario } = req.body;
  try {
    const usuarios = await knex
      .select(
        "usuarios.id_usuario",
        "usuarios.id_carrera",
        "usuarios.email",
        "usuarios.nombre",
        "usuarios.rol",
        knex.raw("STRING_AGG(DISTINCT carreras.nombre, '\n') as carrera"),
        knex.raw("STRING_AGG(DISTINCT materias.nombre,  '\n') as materias"),
        knex.raw("ARRAY_AGG(materias.id_materia) as id_materia")
      )
      .from("usuarios")
      .where({ id_usuario: id_usuario })
      .leftJoin("carreras", "usuarios.id_carrera", "carreras.id_carrera")
      .leftJoin(
        "usuariosxmaterias",
        "usuarios.id_usuario",
        "usuariosxmaterias.id_usuario"
      )
      .leftJoin(
        "materias",
        "materias.id_materia",
        "usuariosxmaterias.id_materia"
      )
      .groupBy("usuarios.id_usuario")
      .orderBy("usuarios.id_usuario", "desc");
    res.json(usuarios);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getRolById = async function (req, res) {
  const { id_usuario } = req.params;
  try {
    const rol = await knex
      .select("rol")
      .from("usuarios")
      .where({ id_usuario: id_usuario });
    res.json(rol);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const createUsuario = async function (req, res) {
  const { id_usuario, id_carrera, email, nombre, rol, password, materias } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUsuario = await knex("usuarios").returning("id_usuario").insert({
      email: email,
      nombre: nombre,
      hashed_password: hashedPassword,
      rol: rol,
      id_carrera: id_carrera,
    });

    if (materias.length == 0) return res.json(newUsuario);

    let fieldsToInsert = [];
    let fieldsToUpdate = [];

    materias.forEach((materia) => {
      materia.arrsecciones.forEach((id_seccion) => {
        fieldsToInsert.push({
          id_usuario: newUsuario[0].id_usuario,
          id_materia: materia.id_materia,
          id_seccion: id_seccion,
        });
      });

      if (rol == "profesor") {
        materia.arrsecciones.forEach((e) => fieldsToUpdate.push(e));
      }
    });

    await knex("usuariosxmaterias").insert(fieldsToInsert);

    if (rol == "profesor") {
      await knex("secciones")
        .whereIn("id_seccion", fieldsToUpdate)
        .update({ id_profesor: newUsuario[0].id_usuario });
    }

    res.json(newUsuario);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const bulkCreateUsuario = async function (req, res) {
  for (let i = 0; i < req.body.length; i++) {
    const salt = bcrypt.genSaltSync(10);
    req.body[i].hashed_password = bcrypt.hashSync(
      req.body[i].hashed_password,
      salt
    );
  }

  try {
    const newUsuarios = await knex.batchInsert("usuarios", req.body, 1000);
    res.json(newUsuarios);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
    console.error(error);
  }
};

const editUsuario = async function (req, res) {
  const { id_usuario, id_carrera, email, nombre, rol, password, materias } =
    req.body;

  try {
    const editedUsuario = await knex("usuarios")
      .where({ id_usuario: id_usuario })
      .update({ nombre: nombre, rol: rol, id_carrera: id_carrera });

    await knex("usuariosxmaterias").where({ id_usuario: id_usuario }).del();

    if (materias.length == 0) return res.json(editedUsuario);

    let fieldsToInsert = [];
    let fieldsToUpdate = [];

    materias.forEach((materia) => {
      materia.arrsecciones.forEach((id_seccion) => {
        fieldsToInsert.push({
          id_usuario: id_usuario,
          id_materia: materia.id_materia,
          id_seccion: id_seccion,
        });
      });

      if (rol == "profesor") {
        materia.arrsecciones.forEach((e) => fieldsToUpdate.push(e));
      }
    });

    await knex("usuariosxmaterias").insert(fieldsToInsert);

    if (rol == "profesor") {
      await knex("secciones")
        .whereIn("id_seccion", fieldsToUpdate)
        .update({ id_profesor: id_usuario });
    }

    res.json(editedUsuario);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const removeUsuarioById = async function (req, res) {
  const { id_usuario } = req.params;
  try {
    const removedUsuario = await knex("usuarios")
      .where({ id_usuario: id_usuario })
      .del();
    res.json(removedUsuario);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getUsuarioInfo = async (req, res) => {
  const { id_usuario } = req.body;

  try {
    const responseUsuarioInfo = await knex("usuarios")
      .select("id_usuario", "email", "nombre")
      .from("usuarios")
      .where({ id_usuario: id_usuario });

    res.json(responseUsuarioInfo);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  getRolById,
  createUsuario,
  bulkCreateUsuario,
  editUsuario,
  removeUsuarioById,
  getUsuarioInfo,
};
