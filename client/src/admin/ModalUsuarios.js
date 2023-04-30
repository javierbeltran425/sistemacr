import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import "../constants/usuario";
import { USUARIO_ROLES, USUARIO_ROLES_ARRAY } from "../constants/usuario";

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
    materias: [],
  });

  const createUsuario = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/createusuario`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUsuario),
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
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/editusuario`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUsuario),
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
    width: 400,
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
      var arr = [];
      json.forEach((element) => {
        arr.push(element.id_materia);
      });
      setNewUsuario({
        ...newUsuario,
        materias: arr,
      });
    } catch (error) {
      console.error(error);
    }
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
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {editMode ? "Editando usuario..." : "Nuevo usuario"}
          </Typography>
          <br />
          <form>
            {!editMode && (
              <TextField
                id="filled-basic"
                label="Email"
                variant="filled"
                name="email"
                value={newUsuario.email}
                onChange={handleChange}
                sx={{ m: 2 }}
              />
            )}
            <TextField
              id="filled-basic"
              label="Nombre"
              variant="filled"
              name="nombre"
              value={newUsuario.nombre}
              onChange={handleChange}
              sx={{ m: 2 }}
            />
            <br />
            {!editMode && (
              <TextField
                id="filled-basic"
                label="Contraseña"
                variant="filled"
                name="password"
                value={newUsuario.password}
                onChange={handleChange}
                sx={{ m: 2 }}
              />
            )}
            <br />
            <br />
            <FormControl fullWidth>
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
            <br />
            <br />
            <FormControl fullWidth>
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
            <br />
            <br />
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Materias</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                name="materias"
                value={newUsuario.materias}
                onChange={handleChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Materias" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          materias.find((materia) => {
                            return materia.id_materia == value;
                          }).nombre
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
                {materias.map((materia) => (
                  <MenuItem
                    key={materia.id_materia}
                    value={materia.id_materia}
                    style={null}
                  >
                    {materia.nombre}
                  </MenuItem>
                ))}
              </Select>
              <br />
              <Button
                type="submit"
                onClick={editMode ? editUsuario : createUsuario}
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
