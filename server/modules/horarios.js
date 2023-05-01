const knex = require('../db')

const createHorario = async function (req, res) {
    const { id_usuario, id_materia, title, description, start, end } = req.body

    try {
        const newSolicitud = await knex('horarios').insert({ id_usuario: id_usuario, id_materia: id_materia, titulo: title, descripcion: description, tipo: type, hora_inicio: start, hora_final: end })

        res.json(newSolicitud)
    } catch (error) {
        res.status(400).send(error)
        console.error(error)
    }
}

module.exports = { createHorario }