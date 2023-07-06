import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Layout from "../components/layout/Layout";
import { getUsuarioById } from "../services/UsuariosServices";

export default function SimpleContainer() {
  const [usuario, setUsuario] = React.useState(null);

  const getUsuarioById = async () => {
    try {
      const response = await getUsuarioById();
      console.log(
        "🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:",
        response
      );
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {}, []);

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
          <TextField id="filled-basic" label="Filled" variant="filled" />
        </Box>
      </Container>
    </Layout>
  );
}
