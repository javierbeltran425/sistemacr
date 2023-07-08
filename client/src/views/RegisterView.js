import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Layout from "../components/layout/Layout";
import { getUsuarioById } from "../services/UsuariosServices";
import { ContextUsuario } from "../context/usuario";

export default function SimpleContainer() {
  const [usuario, setUsuario] = React.useState({});
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

  React.useEffect(() => {
    getUsuario(contextUsuario.id_usuario);
  }, []);

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
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
            sx={{ marginBottom: 2, textAlign: "center" }}
          >
            Verifica la información asociada a tu cuenta
          </Typography>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <TextField
              id="filled-basic"
              value={usuario.email}
              label="Email"
              variant="filled"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <TextField
              id="filled-basic"
              value={usuario.nombre}
              label="Nombre"
              variant="filled"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <TextField
              id="filled-basic"
              value={usuario.email}
              label="Email"
              variant="filled"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <TextField
              id="filled-basic"
              value={usuario.email}
              label="Email"
              variant="filled"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <TextField
              id="filled-basic"
              value={usuario.email}
              label="Email"
              variant="filled"
            />
          </FormControl>
        </Box>
      </Container>
    </Layout>
  );
}
