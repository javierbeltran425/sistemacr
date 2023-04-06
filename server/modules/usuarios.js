const knex = require('../db')
const bcrypt = require('bcrypt')

const getUsuarios = async function (req, res) {
  try {
    const usuarios = await knex.select('email', 'rol').from('usuarios')
    res.json(usuarios)
  } catch (err) {
    console.error(err)
  }
}

const getRol = async function (req, res) {
  const { email } = req.params
  try {
    const rol = await knex.select('rol').from('usuarios').where({email: email})
    res.json(rol)
  } catch (err) {
    console.error(err)
  }
}

const createUsuario = async function (req, res) {
    const { email, password, role } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    
    try {
        const newUsuario = await knex('usuarios').insert({email: email, hashed_password: hashedPassword, rol: role})
        
        res.json(newUsuario)
    } catch (err) {
        console.error(err)
        if (err) {
            res.json({ detail: err.detail})
        }
    }
}
module.exports = { getRol , getUsuarios , createUsuario };