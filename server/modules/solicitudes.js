const knex = require('../db')

const createSolicitud = async function (req, res) {
  const { id_usuario, title, description, type, start, end } = req.body

  try {
    const newSolicitud = await knex('solicitudes').insert({id_usuario: id_usuario, titulo: title, descripcion: description, tipo: type, hora_inicio: start, hora_final: end})

    res.json(newSolicitud)
  } catch (error) {
    res.status(400).send(error)
    console.error(error)
  }
}

const getSolicitudesByIdUsuario = async function (req, res) {
  const { id_usuario } = req.params
  try {
    const solicitudes = await knex.select('id_solicitud as id', 'titulo as title', 'hora_inicio as start', 'hora_final as end', 'descripcion as desc').from('solicitudes').where({id_usuario: id_usuario})
    res.json(solicitudes)
  } catch (error) {
    res.status(400).send(error)
    console.error(error)
  }
}

module.exports = { createSolicitud, getSolicitudesByIdUsuario };