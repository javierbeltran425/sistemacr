const knex = require('../db')
const bcrypt = require('bcrypt')

const getAllUsuarios = async function (req, res) {
  try {
    const usuarios = await knex.select('usuarios.id_usuario', 'usuarios.id_carrera', 'usuarios.email', 'usuarios.nombre', 'usuarios.rol', knex.raw('STRING_AGG(DISTINCT carreras.nombre, \'\n\') as carrera'), knex.raw('STRING_AGG(materias.nombre, \'\n\') as materias'))
      .from('usuarios')
      .leftJoin('carreras', 'usuarios.id_carrera', 'carreras.id_carrera')
      .leftJoin('usuariosxmaterias', 'usuarios.id_usuario', 'usuariosxmaterias.id_usuario')
      .leftJoin('materias', 'materias.id_materia', 'usuariosxmaterias.id_materia')
      .groupBy('usuarios.id_usuario')
    res.json(usuarios)
  } catch (error) {
    res.status(400).send(error)
    console.error(error)
  }
}

const getRolById = async function (req, res) {
  const { id_usuario } = req.params
  try {
    const rol = await knex.select('rol').from('usuarios').where({id_usuario: id_usuario})
    res.json(rol)
  } catch (error) {
    res.status(400).send(error)
    console.error(error)
  }
}

const createUsuario = async function (req, res) {
    const { id_usuario, id_carrera, email, nombre, rol, password, materias } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    
    try {
      const newUsuario = await knex('usuarios').returning('id_usuario').insert({ email: email, nombre: nombre, hashed_password: hashedPassword, rol: rol, id_carrera: id_carrera})
      const fieldsToInsert = materias.map(materia => 
        ({ id_usuario: newUsuario[0].id_usuario, id_materia: materia })); 

      await knex('usuariosxmaterias').insert(fieldsToInsert)
      
      res.json(newUsuario)
    } catch (error) {
      res.status(400).send(error)
      console.error(error)
    }
}

const editUsuario = async function (req, res) {
  const { id_usuario, id_carrera, email, nombre, rol, password, materias } = req.body

  try {
    const editedUsuario = await knex('usuarios').where({id_usuario: id_usuario}).update({nombre: nombre, rol: rol, id_carrera: id_carrera})
    const currentMaterias = await knex.select('usuariosxmaterias.id_materia').from('usuariosxmaterias').where({id_usuario: id_usuario})

    var arr = []
    currentMaterias.forEach((element) => {
      arr.push(element.id_materia);
    });

    const remove = arr.filter(element => !materias.includes(element));
    const insert = materias.filter(element => !arr.includes(element));

    if (insert.length != 0) {
      const fieldsToInsert = insert.map(element => 
        ({ id_usuario: id_usuario, id_materia: element })); 
      await knex('usuariosxmaterias').insert(fieldsToInsert)
    }
    if (remove.length != 0) {
      await knex('usuariosxmaterias').del().where({id_usuario: id_usuario}).whereIn('id_materia', remove)
    }
    res.json(editedUsuario)
  } catch (error) {
      res.status(400).send(error)
      console.error(error)
  }
}

const removeUsuarioById = async function (req, res) {
  const { id_usuario } = req.params
  try {
    const removedUsuario = await knex('usuarios').where({id_usuario: id_usuario}).del()
    res.json(removedUsuario)
  }
  catch (error) {
    res.status(400).send(error)
    console.error(error)
  }
}

module.exports = { getAllUsuarios, getRolById  , createUsuario , editUsuario, removeUsuarioById };