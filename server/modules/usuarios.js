const knex = require("../db");
const bcrypt = require("bcrypt");

const getAllUsuarios = async function (req, res) {
  try {
    const usuarios = await knex
      .select(
        "usuarios.id_usuario",
        "usuarios.id_carrera",
        "usuarios.email",
        "usuarios.nombre",
        "usuarios.rol",
        knex.raw("STRING_AGG(DISTINCT carreras.nombre, '\n') as carrera"),
        knex.raw("STRING_AGG(DISTINCT materias.nombre,  '\n') as materias"),
        knex.raw("ARRAY_AGG(materias.id_materia) as id_materia")
      )
      .from("usuarios")
      .leftJoin("carreras", "usuarios.id_carrera", "carreras.id_carrera")
      .leftJoin(
        "usuariosxmaterias",
        "usuarios.id_usuario",
        "usuariosxmaterias.id_usuario"
      )
      .leftJoin(
        "materias",
        "materias.id_materia",
        "usuariosxmaterias.id_materia"
      )
      .groupBy("usuarios.id_usuario")
      .orderBy("usuarios.id_usuario", "desc");
    res.json(usuarios);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getUsuarioById = async function (req, res) {
  const { id_usuario } = req.params;
  try {
    const usuarios = await knex
      .select(
        "usuarios.id_usuario",
        "usuarios.id_carrera",
        "usuarios.email",
        "usuarios.nombre",
        "usuarios.rol",
        "usuarios.activo",
        knex.raw("STRING_AGG(DISTINCT carreras.nombre, '\n') as carrera"),
        knex.raw("STRING_AGG(DISTINCT materias.nombre,  '\n') as materias"),
        knex.raw("ARRAY_AGG(materias.id_materia) as id_materia")
      )
      .from("usuarios")
      .where({ "usuarios.id_usuario": id_usuario })
      .leftJoin("carreras", "usuarios.id_carrera", "carreras.id_carrera")
      .leftJoin(
        "usuariosxmaterias",
        "usuarios.id_usuario",
        "usuariosxmaterias.id_usuario"
      )
      .leftJoin(
        "materias",
        "materias.id_materia",
        "usuariosxmaterias.id_materia"
      )
      .groupBy("usuarios.id_usuario")
      .orderBy("usuarios.id_usuario", "desc");
    res.json(usuarios);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getRolById = async function (req, res) {
  const { id_usuario } = req.params;
  try {
    const rol = await knex
      .select("rol")
      .from("usuarios")
      .where({ id_usuario: id_usuario });
    res.json(rol);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const createUsuario = async function (req, res) {
  const { id_usuario, id_carrera, email, nombre, rol, password, materias } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const IdUsuario = email.split("@")[0];

  try {
    const newUsuario = await knex("usuarios").returning("id_usuario").insert({
      id_usuario: IdUsuario,
      email: email,
      nombre: nombre,
      hashed_password: hashedPassword,
      rol: rol,
      id_carrera: id_carrera,
    });

    if (materias.length == 0) return res.json(newUsuario);

    let fieldsToInsert = [];
    let fieldsToUpdate = [];

    materias.forEach((materia) => {
      materia.arrsecciones.forEach((id_seccion) => {
        fieldsToInsert.push({
          id_usuario: IdUsuario,
          id_materia: materia.id_materia,
          id_seccion: id_seccion,
        });
      });

      if (rol == "profesor") {
        materia.arrsecciones.forEach((e) => fieldsToUpdate.push(e));
      }
    });

    await knex("usuariosxmaterias").insert(fieldsToInsert);

    if (rol == "profesor") {
      await knex("secciones")
        .whereIn("id_seccion", fieldsToUpdate)
        .update({ id_profesor: IdUsuario });
    }

    res.json(newUsuario);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const bulkCreateUsuario = async function (req, res) {
  const purge = req.body[0];
  const reqData = req.body[1];

  let usuariosData = reqData.map(
    ({ id_usuario, nombre, id_carrera, rol, email, hashed_password }) => ({
      id_usuario: id_usuario,
      nombre: nombre,
      id_carrera: id_carrera,
      rol: rol,
      email: email,
      hashed_password: hashed_password,
    })
  );

  for (let i = 0; i < usuariosData.length; i++) {
    const salt = bcrypt.genSaltSync(10);
    usuariosData[i].hashed_password = bcrypt.hashSync(
      usuariosData[i].hashed_password,
      salt
    );
  }

  let usuariosXMateriasData = reqData.map(
    ({ id_usuario, id_materia, id_seccion }) => ({
      id_usuario: id_usuario,
      id_materia: id_materia,
      id_seccion: id_seccion,
    })
  );

  let materiasxcarrerasData = reqData.map(({ id_carrera, id_materia }) => ({
    id_carrera: id_carrera,
    id_materia: id_materia,
  }));

  let materiasData = reqData.map(({ nombre_materia, id_materia }) => ({
    id_materia: id_materia,
    nombre: nombre_materia,
  }));

  let carrerassData = reqData.map(({ id_carrera, carrera }) => ({
    nombre: carrera,
    id_carrera: id_carrera,
  }));

  let seccionesData = reqData.map(
    ({ id_seccion, num_seccion, id_materia }) => ({
      id_materia: id_materia,
      id_seccion: id_seccion,
      numero: num_seccion,
    })
  );

  //Quitando duplicados

  let cleanMaterias = materiasData.filter(
    (materiasData, index, self) =>
      index === self.findIndex((t) => t.id_materia === materiasData.id_materia)
  );

  let cleanUsuarios = usuariosData.filter(
    (usuariosData, index, self) =>
      index === self.findIndex((t) => t.id_usuario === usuariosData.id_usuario)
  );

  let cleanSecciones = seccionesData.filter(
    (seccionesData, index, self) =>
      index === self.findIndex((t) => t.id_seccion === seccionesData.id_seccion)
  );

  let cleanCarreras = carrerassData.filter(
    (carrerassData, index, self) =>
      index === self.findIndex((t) => t.id_carrera === carrerassData.id_carrera)
  );


  try {
    //Borrando datos si se eleigio purgar la base de datos
    if (purge) {
      await knex("usuariosxmaterias").del();
      console.log("usuariosxmaterias deleted");

      await knex("materiasxcarreras").del();

      console.log("materiasxcarreras deleted");

      await knex("solicitudes").del();

      console.log("solicitudes deleted");

      await knex("horarios").del();

      console.log("horarios deleted");

      await knex("secciones").del();

      console.log("secciones deleted");

      await knex("usuarios").where('rol', 'estudiante').del();

      console.log("usuarios deleted");
    }

    //Insertando datos

    console.log("--> Importando materias");
    await knex("materias")
      .insert(cleanMaterias)
      .onConflict("id_materia")
      .ignore();

    console.log("--> Importando secciones");
    await knex("secciones")
      .insert(cleanSecciones)
      .onConflict("id_seccion")
      .ignore();

    console.log("--> Importando carreras");
    await knex("carreras")
      .insert(cleanCarreras)
      .onConflict("id_carrera")
      .ignore();

    console.log("--> Importando materiasXCarreras");
    await knex("materiasxcarreras").insert(materiasxcarrerasData);

    console.log("--> Importando usuarios");
    const newUsuarios = await knex("usuarios")
      .returning("email")
      .insert(cleanUsuarios)
      .onConflict("id_usuario")
      .ignore();

    console.log("--> Importando usuariosXMaterias");
    await knex("usuariosxmaterias").insert(usuariosXMateriasData);

    res.json(newUsuarios);
  } catch (error) {
    console.error("Error: ", error);
    res.status(400).send(error);
  }
};

const editUsuario = async function (req, res) {
  const { id_usuario, id_carrera, email, nombre, rol, password, materias } =
    req.body;

  try {
    const editedUsuario = await knex("usuarios")
      .where({ id_usuario: id_usuario })
      .update({ nombre: nombre, rol: rol, id_carrera: id_carrera });

    await knex("usuariosxmaterias").where({ id_usuario: id_usuario }).del();

    if (materias.length == 0) return res.json(editedUsuario);

    let fieldsToInsert = [];
    let fieldsToUpdate = [];

    materias.forEach((materia) => {
      materia.arrsecciones.forEach((id_seccion) => {
        fieldsToInsert.push({
          id_usuario: id_usuario,
          id_materia: materia.id_materia,
          id_seccion: id_seccion,
        });
      });

      if (rol == "profesor") {
        materia.arrsecciones.forEach((e) => fieldsToUpdate.push(e));
      }
    });

    await knex("usuariosxmaterias").insert(fieldsToInsert);

    if (rol == "profesor") {
      await knex("secciones")
        .whereIn("id_seccion", fieldsToUpdate)
        .update({ id_profesor: id_usuario });
    }

    res.json(editedUsuario);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const removeUsuarioById = async function (req, res) {
  const { id_usuario } = req.params;
  try {
    const removedUsuario = await knex("usuarios")
      .where({ id_usuario: id_usuario })
      .del();
    res.json(removedUsuario);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getUsuarioInfo = async (req, res) => {
  const { id_usuario } = req.body;

  try {
    const responseUsuarioInfo = await knex("usuarios")
      .select("id_usuario", "email", "nombre")
      .from("usuarios")
      .where({ id_usuario: id_usuario });

    res.json(responseUsuarioInfo);
  } catch (error) {
    res.status(400).send(error);
  }
};

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  console.log(email, oldPassword, newPassword);
  try {
    const usuario = await knex
      .select("id_usuario", "email", "hashed_password", "nombre")
      .from("usuarios")
      .where({ email: email });

    if (Object.keys(usuario).length === 0)
      return res.json({ error: "El usuario no existe!" });

    const success = await bcrypt.compare(
      oldPassword,
      usuario[0].hashed_password
    );

    if (success) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      const editedUsuario = await knex("usuarios")
        .where({ email: email })
        .update({ hashed_password: hashedPassword });
      res.json(editedUsuario);
    } else {
      res.status(400).json({ error: "La contraseña actual es incorrecta!" });
    }
  } catch (error) {
    res
      .status(400)
      .send({ error: "El servicio no está disponible en este momento" });
    console.log(error);
  }
};

const activateUser = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const editedUsuario = await knex("usuarios")
      .where({ id_usuario: id_usuario })
      .update({ activo: true });
    res.json(editedUsuario);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  getRolById,
  createUsuario,
  bulkCreateUsuario,
  editUsuario,
  removeUsuarioById,
  getUsuarioInfo,
  changePassword,
  activateUser,
};
