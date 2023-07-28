import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import "../constants/usuario";
import { USUARIO_ROLES_ARRAY } from "../constants/usuario";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PropTypes from "prop-types";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

const ModalUsuarios = ({
  mode,
  showModal,
  handleOpen,
  handleClose,
  getAllUsuarios,
  usuarioToEdit,
  carreras,
  materias,
}) => {
  const editMode = mode === "edit" ? true : false;

  const [newUsuario, setNewUsuario] = useState({
    id_usuario: editMode ? usuarioToEdit.id_usuario : null,
    id_carrera: editMode ? usuarioToEdit.id_carrera : null,
    email: editMode ? usuarioToEdit.email : "",
    nombre: editMode ? usuarioToEdit.nombre : "",
    rol: editMode ? usuarioToEdit.rol : "",
    password: "",
  });
  const [newMaterias, setNewMaterias] = useState([]);

  const createUsuario = async (e) => {
    e.preventDefault();
    try {
      let data = newUsuario;
      data.materias = newMaterias;

      console.log(data);

      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/createusuario`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        getAllUsuarios();
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editUsuario = async (e) => {
    e.preventDefault();
    try {
      let data = newUsuario;
      data.materias = newMaterias;
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/editusuario`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        console.log("Ok!");
        getAllUsuarios();
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewUsuario((newUsuario) => ({
      ...newUsuario,
      [name]: value,
    }));

    console.log(newUsuario);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const getMateriasByIdUsuario = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/materias/getmateriasbyidusuario/${newUsuario.id_usuario}`
      );
      const json = await resp.json();
      setNewMaterias(json);
    } catch (error) {
      console.error(error);
    }
  };

  const getDisabled = (id_materia) => {
    if (newMaterias.map((i) => i.id_materia).includes(id_materia))
      return { disabled: true };
    return {};
  };

  useEffect(() => {
    if (editMode) {
      getMateriasByIdUsuario();
    }
  }, []);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            sx={{ marginBottom: 2 }}
          >
            {editMode ? "Editando usuario..." : "Nuevo usuario"}
          </Typography>
          <form>
            {!editMode && (
              <FormControl fullWidth>
                <InputText
                  id="filled-basic"
                  placeholder="Email"
                  name="email"
                  value={newUsuario.email}
                  onChange={handleChange}
                  keyfilter={/^[a-zA-Z0-9@._+-]*$/}
                  className="w-full my-1"
                />
              </FormControl>
            )}
            <FormControl fullWidth>
              <InputText
                placeholder="Nombre"
                name="nombre"
                value={newUsuario.nombre}
                onChange={handleChange}
                keyfilter={/^[a-zA-Z0-9 ]*$/}
                className="w-full my-1"
              />
            </FormControl>
            <FormControl fullWidth>
              <Password
                placeholder="Contraseña"
                name="password"
                value={newUsuario.password}
                onChange={handleChange}
                keyfilter={/^[\w!@#$%^&*()\-+=<>?/\|{}\[\]~]*$/}
                toggleMask={true}
                inputStyle={{ width: "100%" }}
                className="my-1"
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="demo-simple-select-label">Rol</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="rol"
                value={newUsuario.rol}
                label="Rol"
                onChange={handleChange}
              >
                {USUARIO_ROLES_ARRAY.map((rol) => (
                  <MenuItem key={rol} value={rol} style={null}>
                    {rol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="demo-simple-select-label">Carrera</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="id_carrera"
                value={newUsuario.id_carrera}
                label="Carrera"
                onChange={handleChange}
              >
                {carreras.map((carrera) => (
                  <MenuItem
                    key={carrera.id_carrera}
                    value={carrera.id_carrera}
                    style={null}
                  >
                    {carrera.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              id="modal-modal-title"
              variant="h6"
              sx={{ textAlign: "center", marginTop: 2 }}
            >
              Materias
            </Typography>
            {newMaterias.map((newMateria, index) => (
              <div
                key={newMateria.id_materia}
                style={{ display: "flex", alignItems: "center" }}
              >
                <FormControl fullWidth sx={{ my: 1 }}>
                  <InputLabel id="demo-simple-select-label">Materia</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="materias"
                    value={newMateria.id_materia}
                    label="Materia"
                    onChange={(e) => {
                      let arr = [...newMaterias];
                      arr[index].id_materia = e.target.value;
                      arr[index].arrsecciones = [];
                      setNewMaterias(arr);
                      console.log(
                        materias.find(
                          (materia) =>
                            materia.id_materia == newMateria.id_materia
                        ).id_materia
                      );
                    }}
                  >
                    {materias.map((element) => (
                      <MenuItem
                        key={element.id_materia}
                        value={element.id_materia}
                        style={null}
                        {...getDisabled(element.id_materia)}
                      >
                        {element.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel id="demo-multiple-chip-label">
                    Secciones
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    name="arrsecciones"
                    value={newMateria.arrsecciones}
                    onChange={(e) => {
                      let arr = [...newMaterias];
                      arr[index].arrsecciones = e.target.value;
                      setNewMaterias(arr);
                    }}
                    input={
                      <OutlinedInput
                        id="select-multiple-chip"
                        label="Secciones"
                      />
                    }
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          maxHeight: 3,
                        }}
                      >
                        {selected.sort().map((value) => (
                          <Chip
                            key={value}
                            label={
                              materias
                                .find(
                                  (e) => e.id_materia == newMateria.id_materia
                                )
                                .arrsecciones.find((e) => e.id_seccion == value)
                                .numero
                            }
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                        },
                      },
                    }}
                  >
                    {materias
                      .find(
                        (materia) => materia.id_materia == newMateria.id_materia
                      )
                      ?.arrsecciones.map((e) => (
                        <MenuItem
                          key={e.id_seccion}
                          value={e.id_seccion}
                          style={null}
                        >
                          {`Sección ${e.numero}`}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl style={null}>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      setNewMaterias((newMaterias) =>
                        newMaterias.filter((s, i) => i != index)
                      );
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </FormControl>
              </div>
            ))}
            <div style={{ textAlign: "center" }}>
              <FormControl style={null}>
                <IconButton
                  onClick={() => {
                    setNewMaterias([
                      ...newMaterias,
                      {
                        id_materia: null,
                        arrsecciones: [],
                      },
                    ]);
                  }}
                  aria-label="delete"
                >
                  <AddCircleIcon />
                </IconButton>
              </FormControl>
            </div>
            <FormControl fullWidth sx={{ my: 1 }}>
              <Button
                type="submit"
                onClick={editMode ? editUsuario : createUsuario}
                sx={{ mx: "auto" }}
                variant="outlined"
              >
                Guardar
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalUsuarios;

ModalUsuarios.propTypes = {
  mode: PropTypes.string,
  showModal: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
  getAllUsuarios: PropTypes.func,
  usuarioToEdit: PropTypes.object,
  carreras: PropTypes.array,
  materias: PropTypes.array,
};
