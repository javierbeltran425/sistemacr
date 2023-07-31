import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { InputText } from "primereact/inputtext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

import { createCarrera, editCarrera } from "../services/CarrerasServices";

import useAuth from "../hooks/useAuth";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ModalCarreras = ({
  mode,
  showModal,
  handleClose,
  getAllCarreras,
  carreraToEdit,
}) => {
  const editMode = mode === "edit" ? true : false;

  const [newCarrera, setNewCarrera] = useState({
    id_carrera: editMode ? carreraToEdit.id_carrera : "",
    nombre: editMode ? carreraToEdit.nombre : "",
    facultad: editMode ? carreraToEdit.facultad : "",
  });
  const [idEmpty, setIdEmpty] = useState(false);
  const [nameEmpty, setNameEmpty] = useState(false);

  const { auth } = useAuth();

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

  const CreateCarrera = async (e) => {
    e.preventDefault();
    newCarrera.id_carrera == "" ? setIdEmpty(true) : setIdEmpty(false);
    newCarrera.nombre == "" ? setNameEmpty(true) : setNameEmpty(false);
    if (newCarrera.id_carrera == "" || newCarrera.nombre == "") return;

    try {
      const response = await createCarrera(newCarrera, auth.accessToken);

      if (response.status === 200) {
        getAllCarreras();
        handleClose();
      }
    } catch (error) {
      handleOpenSnack(error);
    }
  };

  const EditCarrera = async (e) => {
    e.preventDefault();
    newCarrera.nombre == "" ? setNameEmpty(true) : setNameEmpty(false);
    if (newCarrera.nombre == "") return;

    e.preventDefault();
    try {
      const response = await editCarrera(newCarrera, auth.accessToken);

      if (response.status === 200) {
        getAllCarreras();
        handleClose();
      }
    } catch (error) {
      handleOpenSnack(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewCarrera((newCarrera) => ({
      ...newCarrera,
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
            {mode == "edit" ? "Editando carrera..." : "Nueva carrera"}
          </Typography>
          <form className="flex flex-column gap-3">
            {!editMode && (
              <FormControl fullWidth>
                <label>ID de carrera*</label>
                <InputText
                  placeholder="ID"
                  name="id_carrera"
                  value={newCarrera.id_carrera}
                  onChange={handleChange}
                  className={idEmpty ? "w-full p-invalid" : "w-full"}
                  keyfilter="int"
                />
              </FormControl>
            )}
            <FormControl fullWidth>
              <label>Nombre de carrera*</label>
              <InputText
                placeholder="Nombre"
                name="nombre"
                value={newCarrera.nombre}
                onChange={handleChange}
                className={nameEmpty ? "w-full p-invalid" : "w-full"}
                keyfilter={/^[a-zA-Z0-9 ]*$/}
              />
            </FormControl>
            <FormControl fullWidth>
              <label>Facultad</label>
              <InputText
                placeholder="Facultad"
                name="facultad"
                value={newCarrera.facultad}
                onChange={handleChange}
                keyfilter={/^[a-zA-Z0-9 ]*$/}
              />
            </FormControl>

            <FormControl fullWidth sx={{ my: 2 }}>
              <Button
                type="submit"
                onClick={editMode ? EditCarrera : CreateCarrera}
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

export default ModalCarreras;

ModalCarreras.propTypes = {
  mode: PropTypes.string,
  showModal: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
  getAllCarreras: PropTypes.func,
  carreraToEdit: PropTypes.object,
};
