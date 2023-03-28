const knex = require('../db')

const createSolicitud = async function (req, res) {
  const { email, title, description, type, start, end } = req.body

  try {
    const newSolicitud = await knex('solicitudes').insert({email_usuario: email, titulo: title, descripcion: description, tipo: type, hora_inicio: start, hora_final: end})

    res.json(newSolicitud)
  } catch (err) {
    console.error(err)
  }
}

const getSolicitudes = async function (req, res) {
  const { email } = req.params
  try {
    const solicitudes = await knex.select('id_solicitud as id', 'titulo as title', 'hora_inicio as start', 'hora_final as end', 'descripcion as desc').from('solicitudes').where({email_usuario: email})
    res.json(solicitudes)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { createSolicitud, getSolicitudes };