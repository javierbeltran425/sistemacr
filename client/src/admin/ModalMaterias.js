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

const ModalCarreras = ({
  mode,
  showModal,
  setShowModal,
  handleOpen,
  handleClose,
  getData,
  materia,
  carreras,
}) => {
  const editMode = mode === "edit" ? true : false;
  const [data, setData] = useState({
    id: editMode ? materia.id : "",
    name: editMode ? materia.name : "",
    uv: editMode ? materia.uv : "",
    majors: [],
  });

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/materias/createmateria`,
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
        `${process.env.REACT_APP_SERVER_URL}/materias/editmateria/${String(
          materia.id
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

  const findSelected = async () => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/materias/getcarreras/${materia.id}`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        var arr = [];
        resp.forEach((element) => {
          arr.push(element.id_carrera);
        });
        setData({
          ...data,
          majors: arr,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (editMode) {
      findSelected();
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
              label="UVs"
              variant="filled"
              name="uv"
              value={data.uv}
              onChange={handleChange}
            />
            <br />
            <br />
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Carreras</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                name="majors"
                value={data.majors}
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
              <br />
              <Button type="submit" onClick={editMode ? editData : postData}>
                submit
              </Button>{" "}
            </FormControl>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalCarreras;
