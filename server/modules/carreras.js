const knex = require('../db')

const getCarreras = async function (req, res) {
  try {
    const carreras = await knex.select('id_carrera', 'nombre', 'facultad').from('carreras')
    res.json(carreras)
  } catch (err) {
    console.error(err)
  }
}

const createCarrera = async function (req, res) {
    const { name, faculty } = req.body
    
    try {
        const newCarrera = await knex('carreras').insert({nombre: name, facultad: faculty})
        
        res.json(newCarrera)
    } catch (err) {
        console.error(err)
        if (err) {
            res.json({ detail: err.detail})
        }
    }
}

const removeCarrera = async function (req, res) {
  const { id } = req.params
  console.log(id)
  try {
    const deleteCarrera = await knex('carreras').where({id_carrera: id}).del()
    res.json(deleteCarrera)
  } catch (err) {
    console.error(err)
  }
}

const editCarrera = async function (req, res) {
  const { ID } = req.params
  const { id, name, faculty } = req.body
  try {
      const editCarrera = await knex('carreras').where({id_carrera: ID}).update({nombre: name, facultad: faculty})
    res.json(editCarrera)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { getCarreras, createCarrera, removeCarrera, editCarrera }