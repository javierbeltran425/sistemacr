import React, { useEffect, useState } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import { InputNumber } from "primereact/inputnumber";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import { InputText } from "primereact/inputtext";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

import { createMateria, editMateria } from "../services/MateriasServices";
import { getCarrerasByIdMateria } from "../services/CarrerasServices";

import useAuth from "../hooks/useAuth";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ModalMaterias = ({
  mode,
  showModal,
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

  const [idEmpty, setIdEmpty] = useState(false);
  const [nameEmpty, setNameEmpty] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpenSnack = (error) => {
    setSnackError("ERROR: " + error.response.data.message);
    setOpen(true);
  };
  const [snackError, setSnackError] = useState("");
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { auth } = useAuth();

  const CreateMateria = async (e) => {
    e.preventDefault();
    newMateria.id_materia == "" ? setIdEmpty(true) : setIdEmpty(false);
    newMateria.nombre == "" ? setNameEmpty(true) : setNameEmpty(false);
    if (newMateria.id_materia == "" || newMateria.nombre == "") return;

    try {
      const response = await createMateria(newMateria, auth.accessToken);

      if (response.status === 200) {
        getAllMaterias();
        handleClose();
      }
    } catch (error) {
      handleOpenSnack(error);
    }
  };

  const EditMateria = async (e) => {
    e.preventDefault();
    newMateria.nombre == "" ? setNameEmpty(true) : setNameEmpty(false);
    if (newMateria.nombre == "") return;

    try {
      const response = await editMateria(newMateria, auth.accessToken);

      if (response.status === 200) {
        getAllMaterias();
        handleClose();
      }
    } catch (error) {
      handleOpenSnack(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewMateria((newMateria) => ({
      ...newMateria,
      [name]: value,
    }));
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

  const GetCarrerasByIdMateria = async () => {
    try {
      const response = await getCarrerasByIdMateria(
        newMateria.id_materia,
        auth.accessToken
      );

      if (response.status === 200) {
        const json = await response.data;
        var arr = [];
        json.forEach((element) => {
          arr.push(element.id_carrera);
        });
        setNewMateria({
          ...newMateria,
          carreras: arr,
        });
      }
    } catch (error) {
      handleOpenSnack(error);
    }
  };

  useEffect(() => {
    if (editMode) {
      GetCarrerasByIdMateria();
    }
  }, []);

  return (
    <div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackError}
          </Alert>
        </Snackbar>
      </Stack>

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
          <form className="flex flex-column gap-2">
            {!editMode && (
              <FormControl fullWidth>
                <label>ID de la materia*</label>
                <InputText
                  placeholder="ID"
                  name="id_materia"
                  value={newMateria.id_materia}
                  onChange={handleChange}
                  className={idEmpty ? "w-full p-invalid" : "w-full"}
                  keyfilter="int"
                />
              </FormControl>
            )}
            <FormControl fullWidth>
              <label>Nombre*</label>
              <InputText
                placeholder="Nombre"
                name="nombre"
                value={newMateria.nombre}
                onChange={handleChange}
                className={nameEmpty ? "w-full p-invalid" : "w-full"}
                keyfilter={/^[a-zA-Z0-9 ]*$/}
              />
            </FormControl>
            <FormControl fullWidth>
              <label>Unidades valorativas</label>
              <InputNumber
                inputId="uv"
                name="uv"
                value={newMateria.uv}
                onChange={(e) => {
                  setNewMateria((newMateria) => ({
                    ...newMateria,
                    ["uv"]: e.value,
                  }));
                }}
                mode="decimal"
                showButtons
                min={0}
                max={9}
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
              <label>Número de secciones</label>
              <InputNumber
                inputId="numsecciones"
                name="numsecciones"
                value={newMateria.numsecciones}
                onChange={(e) => {
                  setNewMateria((newMateria) => ({
                    ...newMateria,
                    ["numsecciones"]: e.value,
                  }));
                }}
                mode="decimal"
                showButtons
                min={1}
                max={9}
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <Button
                type="submit"
                onClick={editMode ? EditMateria : CreateMateria}
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
