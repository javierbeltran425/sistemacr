import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Layout from "../components/layout/Layout";
import { ContextUsuario } from "../context/usuario";
import Button from "@mui/material/Button";

import { getUsuarioById } from "../services/UsuariosServices";
import { getSeccionesByIdUsuario } from "../services/SeccionesServices";

export default function SimpleContainer() {
  const [usuario, setUsuario] = React.useState({});
  const [secciones, setSecciones] = React.useState([]);
  const contextUsuario = React.useContext(ContextUsuario);

  const getUsuario = async (id_usuario) => {
    try {
      const response = await getUsuarioById(id_usuario);
      console.log(
        "🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:",
        response
      );
      if (response.status == 200) {
        setUsuario(response.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSecciones = async (id_usuario) => {
    try {
      const response = await getSeccionesByIdUsuario(id_usuario);
      console.log(
        "🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:",
        response
      );
      if (response.status == 200) {
        setSecciones(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getUsuario(contextUsuario.id_usuario);
    getSecciones(contextUsuario.id_usuario);
  }, []);

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "30ch" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            sx={{ marginBottom: 2, textAlign: "center", margin: 2 }}
          >
            Verifica la información asociada a tu cuenta
          </Typography>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <TextField
              id="filled-basic"
              value={usuario.email}
              label="Email"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <TextField
              id="filled-basic"
              value={usuario.nombre}
              label="Nombre"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <TextField
              id="filled-basic"
              value={usuario.carrera}
              label="Carrera"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <Typography variant="h6" component="div">
            Materias
          </Typography>
          {secciones.map((seccion) => (
            <div
              key={seccion.id_materia}
              className="flex justify-content-between"
            >
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {seccion.nombre}
              </Typography>
              <Typography variant="body2">Sección {seccion.numero}</Typography>
            </div>
          ))}
          <Button>Activar mi cuenta</Button>
        </Box>
      </Container>
    </Layout>
  );
}
