const knex = require("../db");

const getSeccionesByIdUsuario = async function (req, res) {
  try {
    const { id_usuario } = req.params;
    const secciones = await knex
      .select(
        "usuariosxmaterias.id_materia",
        "usuariosxmaterias.id_seccion",
        "secciones.numero",
        "secciones.id_profesor",
        "materias.nombre",
        "materias.uv"
      )
      .from("usuariosxmaterias")
      .where({ id_usuario: id_usuario })
      .join("materias", "materias.id_materia", "usuariosxmaterias.id_materia")
      .join("secciones", "secciones.id_seccion", "usuariosxmaterias.id_seccion")
      .orderBy("nombre", "asc")
      .orderBy("numero", "asc");
    res.json(secciones);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
};

const getSeccionById = async function(req,res) {
  try {
    const { id_seccion } = req.params

    const seccion = await knex
      .select(
        "secciones.id_seccion",
        "secciones.numero"
      )
      .from("secciones")
      .where({ id_seccion: id_seccion })

    res.json(seccion)
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getSeccionesByIdUsuario, getSeccionById };
