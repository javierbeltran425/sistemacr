import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

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
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {mode == "edit" ? "Editando carrera..." : "Nueva carrera"}
          </Typography>
          <br />
          <form>
            <TextField
              id="filled-basic"
              label="Nombre"
              variant="filled"
              name="nombre"
              value={newCarrera.nombre}
              onChange={handleChange}
              sx={{ m: 2 }}
            />
            <br />
            <TextField
              id="filled-basic"
              label="Facultad"
              variant="filled"
              name="facultad"
              value={newCarrera.facultad}
              onChange={handleChange}
              sx={{ m: 2 }}
            />
            <br />
            <br />
            <FormControl sx={{ m: 1, width: 300 }}>
              <Button
                type="submit"
                onClick={editMode ? editCarrera : createCarrera}
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