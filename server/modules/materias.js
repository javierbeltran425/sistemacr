const knex = require('../db')

const getMaterias = async function (req, res) {
  try {
    const materias = await knex.select('materias.id_materia', 'materias.nombre', 'materias.uv', knex.raw('STRING_AGG(carreras.nombre, \'\n\') as carreras'))
      .from('materias')
      .leftJoin('materiasxcarreras', 'materias.id_materia', 'materiasxcarreras.id_materia')
      .leftJoin('carreras', 'carreras.id_carrera', 'materiasxcarreras.id_carrera')
      .groupBy('materias.id_materia')
    res.json(materias)
  } catch (err) {
    console.error(err)
  }
}

const getCarreras = async function (req, res) {
  const { id } = req.params

  try {
    const carreras = await knex.select('materiasxcarreras.id_carrera')
      .from('materiasxcarreras')
      .where({id_materia: id})
    res.json(carreras)
  } catch (err) {
    console.error(err)
  }
}

const createMateria = async function (req, res) {
    const { id, name, uv, majors } = req.body

    try {
      const newMateria = await knex('materias').returning('id_materia').insert({nombre: name, uv: uv})
      .then ( async (resp) => {
      const fieldsToInsert = majors.map(major => 
        ({ id_materia: resp[0].id_materia, id_carrera: major })); 

        await knex('materiasxcarreras').insert(fieldsToInsert)
    })
        
        res.json(newMateria)
    } catch (err) {
        console.error(err)
        if (err) {
            res.json({ detail: err.detail})
        }
    }
}

const removeMateria = async function (req, res) {
  const { id } = req.params
  try {
    await knex('materiasxcarreras').del().where({id_materia: id})
    .then( async (resp) => {
      await knex('materias').where({id_materia: id}).del()

      res.json(resp)
    })
  } catch (err) {
    console.error(err)
  }
}

const editMateria = async function (req, res) {
  const { ID } = req.params
  const { id, name, uv, majors } = req.body

  try {
    const editCarrera = await knex('materias').where({id_materia: ID}).update({nombre: name, uv: uv})
    .then( async () => {
      const carreras = await knex.select('id_carrera').from('materiasxcarreras').where({id_materia: ID})
      var arr = []
      carreras.forEach((element) => {
        arr.push(element.id_carrera);
      });
      return arr
    }).then( async (carreras) => {
      const remove = carreras.filter(element => !majors.includes(element));
      const insert = majors.filter(element => !carreras.includes(element));

      if (insert.length != 0) {
        const fieldsToInsert = insert.map(element => 
          ({ id_materia: ID, id_carrera: element })); 
        await knex('materiasxcarreras').insert(fieldsToInsert)
      }
      if (remove.length != 0) {
        await knex('materiasxcarreras').del().where({id_materia: ID}).whereIn('id_carrera', remove)
      }
    })
    res.json(editCarrera)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { getMaterias, createMateria, removeMateria, editMateria, getCarreras }