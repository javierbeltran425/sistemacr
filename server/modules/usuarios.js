const knex = require('../db')
const bcrypt = require('bcrypt')

const getUsuarios = async function (req, res) {
  try {
    const usuarios = await knex.select('usuarios.email', 'usuarios.rol', 'usuarios.id_carrera', knex.raw('STRING_AGG(DISTINCT carreras.nombre, \'\n\') as carrera'), knex.raw('STRING_AGG(materias.nombre, \'\n\') as materias'))
      .from('usuarios')
      .leftJoin('carreras', 'usuarios.id_carrera', 'carreras.id_carrera')
      .leftJoin('usuariosxmaterias', 'usuarios.email', 'usuariosxmaterias.email')
      .leftJoin('materias', 'materias.id_materia', 'usuariosxmaterias.id_materia')
      .groupBy('usuarios.email')
    res.json(usuarios)
  } catch (err) {
    console.error(err)
  }
}

const getMaterias = async function (req, res) {
  const { email } = req.params

  try {
    const materias = await knex.select('usuariosxmaterias.id_materia')
      .from('usuariosxmaterias')
      .where({email: email})
    res.json(materias)
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
    const { email, password, role, major, subjects } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    
    try {
      const newUsuario = await knex('usuarios').insert({email: email, hashed_password: hashedPassword, rol: role, id_carrera: major})
      .then ( async () => {
      const fieldsToInsert = subjects.map(subject => 
        ({ email: email, id_materia: subject })); 

        await knex('usuariosxmaterias').insert(fieldsToInsert)
      })
        
        res.json(newUsuario)
    } catch (err) {
        console.error(err)
        if (err) {
            res.json({ detail: err.detail})
        }
    }
}

const editUsuario = async function (req, res) {
  const { id } = req.params
  const { email, password, role, major, subjects } = req.body

  try {
    const editUsuario = await knex('usuarios').where({email: id}).update({email: email, rol: role, id_carrera: major})
    .then( async () => {
      const materias = await knex.select('usuariosxmaterias.id_materia').from('usuariosxmaterias').where({email: id})
      var arr = []
      materias.forEach((element) => {
        arr.push(element.id_materia);
      });
      return arr
    }).then( async (materias) => {
      const remove = materias.filter(element => !subjects.includes(element));
      const insert = subjects.filter(element => !materias.includes(element));

      if (insert.length != 0) {
        const fieldsToInsert = insert.map(element => 
          ({ email: email, id_materia: element })); 
        await knex('usuariosxmaterias').insert(fieldsToInsert)
      }
      if (remove.length != 0) {
        await knex('usuariosxmaterias').del().where({email: id}).whereIn('id_materia', remove)
      }
    })
    res.json(editUsuario)
  } catch (err) {
    console.error(err)
  }
}

const removeUsuario = async function (req, res) {
  const { email } = req.params
  try {
    await knex('usuariosxmaterias').del().where({email: email})
    .then( async (resp) => {
      await knex('usuarios').where({email: email}).del()

      res.json(resp)
    })

  } catch (err) {
    console.error(err)
  }
}

module.exports = { getRol , getUsuarios , getMaterias , createUsuario , editUsuario, removeUsuario };