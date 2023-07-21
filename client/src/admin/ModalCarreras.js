import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import PropTypes from "prop-types";
import { InputText } from "primereact/inputtext";

const ModalCarreras = ({
  mode,
  showModal,
  handleOpen,
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

  const createCarrera = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/carreras/createcarrera`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCarrera),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        getAllCarreras();
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editCarrera = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/carreras/editcarrera`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCarrera),
        }
      );
      if (response.status === 200) {
        console.log("Ok!");
        getAllCarreras();
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewCarrera((newCarrera) => ({
      ...newCarrera,
      [name]: value,
    }));

    console.log(newCarrera);
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
            {mode == "edit" ? "Editando carrera..." : "Nueva carrera"}
          </Typography>
          <form>
            {!editMode && (
              <FormControl fullWidth>
                <label>ID de carrera</label>
                <InputText
                  placeholder="ID"
                  name="id_carrera"
                  value={newCarrera.id_carrera}
                  onChange={handleChange}
                  className="w-full"
                  keyfilter="int"
                />
              </FormControl>
            )}
            <FormControl fullWidth>
              <label>Nombre de carrera</label>
              <InputText
                placeholder="Nombre"
                name="nombre"
                value={newCarrera.nombre}
                onChange={handleChange}
                className="w-full"
                keyfilter={/^[a-zA-Z0-9 ]*$/}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="filled-basic"
                label="Facultad"
                variant="filled"
                name="facultad"
                value={newCarrera.facultad}
                onChange={handleChange}
                sx={{ my: 2 }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <Button
                type="submit"
                onClick={editMode ? editCarrera : createCarrera}
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
