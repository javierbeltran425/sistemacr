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
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import PropTypes from "prop-types";

const ModalMaterias = ({
  mode,
  showModal,
  handleOpen,
  handleClose,
  getAllMaterias,
  materiaToEdit,
  carreras,
}) => {
  const editMode = mode === "edit" ? true : false;
  const [newMateria, setNewMateria] = useState({
    id_materia: editMode ? materiaToEdit.id_materia : "",
    nombre: editMode ? materiaToEdit.nombre : "",
    uv: editMode ? materiaToEdit.uv : 0,
    numsecciones: editMode ? materiaToEdit.numsecciones : 1,
    carreras: [],
  });

  const createMateria = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/materias/createmateria`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMateria),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        getAllMaterias();
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editMateria = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/materias/editmateria`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMateria),
        }
      );
      if (response.status === 200) {
        console.log("Ok!");
        getAllMaterias();
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewMateria((newMateria) => ({
      ...newMateria,
      [name]: value,
    }));

    console.log(newMateria);
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

  const getCarrerasByIdMateria = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/carreras/getcarrerasbyidmateria/${newMateria.id_materia}`
      );
      const json = await resp.json();
      var arr = [];
      json.forEach((element) => {
        arr.push(element.id_carrera);
      });
      setNewMateria({
        ...newMateria,
        carreras: arr,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editMode) {
      getCarrerasByIdMateria();
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
            {editMode ? "Editando materia..." : "Nueva materia"}
          </Typography>
          <form>
            {!editMode && (
              <FormControl fullWidth>
                <TextField
                  id="filled-basic"
                  label="ID"
                  variant="filled"
                  name="id_materia"
                  value={newMateria.id_materia}
                  onChange={handleChange}
                  sx={{ my: 2 }}
                />
              </FormControl>
            )}
            <FormControl fullWidth>
              <TextField
                id="filled-basic"
                label="Nombre"
                variant="filled"
                name="nombre"
                value={newMateria.nombre}
                onChange={handleChange}
                sx={{ my: 2 }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="filled-basic"
                label="UVs"
                variant="filled"
                name="uv"
                type="number"
                InputProps={{ inputProps: { min: "0", max: "10" } }}
                value={newMateria.uv}
                onChange={handleChange}
                sx={{ my: 2 }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="demo-multiple-chip-label">Carreras</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                name="carreras"
                value={newMateria.carreras}
                onChange={handleChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Carreras" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          carreras.find((carrera) => {
                            return carrera.id_carrera == value;
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
            <FormControl fullWidth>
              <TextField
                id="filled-basic"
                label="Número de secciones"
                variant="filled"
                name="numsecciones"
                type="number"
                InputProps={{ inputProps: { min: "1", max: "10" } }}
                value={newMateria.numsecciones}
                onChange={handleChange}
                sx={{ my: 2 }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <Button
                type="submit"
                onClick={editMode ? editMateria : createMateria}
                sx={{ mx: "auto" }}
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

export default ModalMaterias;

ModalMaterias.propTypes = {
  mode: PropTypes.string,
  showModal: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
  getAllMaterias: PropTypes.func,
  materiaToEdit: PropTypes.object,
  carreras: PropTypes.array,
};
