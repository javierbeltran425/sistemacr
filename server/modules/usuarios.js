const knex = require('../db')

const getRol = async function (req, res) {
  const { email } = req.params
  try {
    const rol = await knex.select('rol').from('usuarios').where({email: email})
    res.json(rol)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { getRol };