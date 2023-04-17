import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const ModalCarreras = ({
  mode,
  showModal,
  setShowModal,
  handleOpen,
  handleClose,
  getData,
  carrera,
}) => {
  const editMode = mode === "edit" ? true : false;

  const [data, setData] = useState({
    id: editMode ? carrera.id : "",
    name: editMode ? carrera.name : "",
    faculty: editMode ? carrera.faculty : "",
  });

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/carreras/createcarrera`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        console.log("WORKED");
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/carreras/editcarrera/${String(
          carrera.id
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value,
    }));

    console.log(data);
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
            {mode.toUpperCase()} mode
          </Typography>
          <br />
          <form>
            <TextField
              id="filled-basic"
              label="Nombre"
              variant="filled"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
            <br />
            <TextField
              id="filled-basic"
              label="Facultad"
              variant="filled"
              name="faculty"
              value={data.faculty}
              onChange={handleChange}
            />
            <br />
            <br />
            <Button type="submit" onClick={editMode ? editData : postData}>
              submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalCarreras;
