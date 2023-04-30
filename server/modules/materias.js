const knex = require('../db')

const getAllMaterias = async function (req, res) {
  try {
    const materias = await knex.select('materias.id_materia', 'materias.nombre', 'materias.uv', knex.raw('STRING_AGG(carreras.nombre, \'\n\') as carreras'))
      .from('materias')
      .leftJoin('materiasxcarreras', 'materias.id_materia', 'materiasxcarreras.id_materia')
      .leftJoin('carreras', 'carreras.id_carrera', 'materiasxcarreras.id_carrera')
      .groupBy('materias.id_materia')
    res.json(materias)
  } catch (error) {
    res.status(400).send(error)
    console.error(error)
  }
}

const getMateriasByIdUsuario = async function (req, res) {
  const { id_usuario } = req.params

  try {
    const materias = await knex.select('usuariosxmaterias.id_materia', 'materias.nombre', 'materias.uv')
      .from('usuariosxmaterias')
      .where({id_usuario: id_usuario})
      .join('materias', 'materias.id_materia', 'usuariosxmaterias.id_materia')
    res.json(materias)
  } catch (error) {
    res.status(400).send(error)
    console.error(error)
  }
}

const createMateria = async function (req, res) {
    const { id_materia, nombre, uv, carreras } = req.body

    try {
      const newMateria = await knex('materias').returning('id_materia').insert({nombre: nombre, uv: uv})
      if (carreras.length > 0) {
        const fieldsToInsert = carreras.map(carrera => 
          ({ id_materia: newMateria[0].id_materia, id_carrera: carrera })); 
        await knex('materiasxcarreras').insert(fieldsToInsert)
      }
      
      res.json(newMateria)

    } catch (error) {
      res.status(400).send(error)
      console.error(error)
    }
}

const removeMateriaById = async function (req, res) {
  const { id_materia } = req.params
  try {
    await knex('materiasxcarreras').del().where({id_materia: id_materia})
    .then( async (resp) => {
      await knex('materias').where({id_materia: id_materia}).del()

      res.json(resp)
    })
  } catch (error) {
      res.status(400).send(error)
      console.error(error)
  }
}

const editMateria = async function (req, res) {
  const { id_materia, nombre, uv, carreras } = req.body
  try {
    const editCarrera = await knex('materias').where({id_materia: id_materia}).update({nombre: nombre, uv: uv})
    const currentCarreras = await knex.select('id_carrera').from('materiasxcarreras').where({id_materia: id_materia})

    var arr = []
    currentCarreras.forEach((element) => {
      arr.push(element.id_carrera);
    });

    const remove = arr.filter(element => !carreras.includes(element));
    const insert = carreras.filter(element => !arr.includes(element));

    if (insert.length != 0) {
      const fieldsToInsert = insert.map(element => 
        ({ id_materia: id_materia, id_carrera: element })); 
      await knex('materiasxcarreras').insert(fieldsToInsert)
    }

    if (remove.length != 0) {
      await knex('materiasxcarreras').del().where({id_materia: id_materia}).whereIn('id_carrera', remove)
    }

    res.json(editCarrera)
  } catch (error) {
      res.status(400).send(error)
      console.error(error)
  }
}

module.exports = { getAllMaterias, getMateriasByIdUsuario, createMateria, removeMateriaById, editMateria }