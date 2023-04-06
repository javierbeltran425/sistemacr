import { useState } from "react";
import { useCookies } from "react-cookie";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const ModalUsuarios = ({
  mode,
  showModal,
  setShowModal,
  handleOpen,
  handleClose,
  getData,
  usuario,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === "edit" ? true : false;

  const [data, setData] = useState({
    email: editMode ? usuario.email : "",
    password: "",
    role: editMode ? usuario.role : "",
  });

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/createusuario`,
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
        `${process.env.REACT_APP_SERVERURL}/todos/${usuario.id}`,
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
              label="Email"
              variant="filled"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <br />
            {!editMode && (
              <TextField
                id="filled-basic"
                label="Contraseña"
                variant="filled"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
            )}
            <TextField
              id="filled-basic"
              label="Rol"
              variant="filled"
              name="role"
              value={data.role}
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

export default ModalUsuarios;
