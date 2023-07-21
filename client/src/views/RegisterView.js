import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Layout from "../components/layout/Layout";
import ContextUsuario from "../context/ContextUsuario";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { ListItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import EmailIcon from "@mui/icons-material/Email";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { getUsuarioById } from "../services/UsuariosServices";
import { getSeccionesByIdUsuario } from "../services/SeccionesServices";
import { changePassword, activateUser } from "../services/UsuariosServices";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function RegisterView() {
  const [usuario, setUsuario] = React.useState({});
  const [secciones, setSecciones] = React.useState([]);
  const contextUsuario = React.useContext(ContextUsuario);
  const [open, setOpen] = React.useState(false);
  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [error, setError] = React.useState(null);
  const toast = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    contextUsuario.id_usuario === "" && navigate('/')
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
    setOldPass("");
    setNewPass("");
    setError(null);
    setConfirmPass("");
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const ChangePassword = async () => {
    if (newPass == "" || confirmPass == "") {
      setError("Ningún campo puede estar vacío.");
      return;
    }
    if (newPass != confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const data = {
        email: usuario.email,
        oldPassword: oldPass,
        newPassword: newPass,
      };
      console.log(data);
      const response = await changePassword(data);
      console.log(
        "🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:",
        response
      );
      if (response.status == 200) {
        showSuccess();
        handleClose();
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError(error.response.data.error);
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

  const ActivateUser = async (id_usuario) => {
    try {
      const response = await activateUser(id_usuario);
      console.log(
        "🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:",
        response
      );
      if (response.status == 200) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Operación exitosa",
      detail: "",
      life: 3000,
    });
  };

  React.useEffect(() => {
    getUsuario(contextUsuario.id_usuario);
    getSecciones(contextUsuario.id_usuario);
  }, []);

  React.useEffect(() => {
    contextUsuario.id_usuario === "" && navigate('/login')
  }, [])

  return (
    <Layout>
      <Toast ref={toast} />
      {contextUsuario.activo ? (
        <div className="w-full flex flex-row justify-content-start">
          <div className="flex flex-row justify-content-center align-items-center m-2 cursor-pointer" onClick={() => navigate('/')} >
            <i className="pi pi-angle-left" style={{ fontSize: '1.5rem' }}></i>
            <p className="m-0" style={{ fontSize: '1.5rem' }}>Regresar</p>
          </div>
        </div>
      ) : ""}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cambiar contraseña</DialogTitle>
        <DialogContent>
          <div className="card flex justify-content-center flex-column">
            <span className="p-float-label my-3">
              <Password
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                toggleMask
              />
              <label htmlFor="password">Contraseña Actual</label>
            </span>
            <hr style={{ width: "100%" }}></hr>
            <span className="p-float-label my-3">
              <Password
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                toggleMask
              />
              <label htmlFor="password">Contraseña Nueva</label>
            </span>
            <span className="p-float-label">
              <Password
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                toggleMask
              />
              <label htmlFor="password">Confirma la Contraseña</label>
            </span>

            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button variant="outlined" onClick={handleClose}>
            Salir
          </Button>
          <Button variant="outlined" color="success" onClick={ChangePassword}>
            guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
        container
      >
        <Grid
          direction="column"
          sx={{
            padding: 2,
          }}
        >
          <Typography
            sx={{ mt: 4, mb: 2, textAlign: "center" }}
            variant="h3"
            component="div"
          >
            Perfil
          </Typography>
          <Demo>
            <ListItem>
              <ListItemAvatar>
                <EmailIcon />
              </ListItemAvatar>
              <ListItemText primary={usuario.email} secondary={"Email"} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <AccountCircleIcon />
              </ListItemAvatar>
              <ListItemText primary={usuario.nombre} secondary={"Nombre"} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <AutoStoriesIcon />
              </ListItemAvatar>
              <ListItemText primary={usuario.carrera} secondary={"Carrera"} />
            </ListItem>
          </Demo>
          <Typography
            sx={{ m: 3, textAlign: "center" }}
            variant="h7"
            component="div"
            color={"grey"}
          >
            ASIGNATURAS:
          </Typography>

          <Grid spacing={2}>
            {secciones.map((seccion) => (
              <div
                key={seccion.id_materia}
                className="flex justify-content-between m-2"
              >
                <Grid item xs={8}>
                  <Item>{seccion.nombre}</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>Sección {seccion.numero}</Item>
                </Grid>
              </div>
            ))}
          </Grid>
          <Stack
            sx={{
              display: "flex",
              marginTop: 5,
              alignItems: "flex-start",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              sx={{ alignSelf: "center", marginBottom: 3 }}
              onClick={handleClickOpen}
            >
              Cambiar mi contraseña
            </Button>
            {!usuario?.activo && (
              <Button
                sx={{ alignSelf: "center" }}
                variant="outlined"
                onClick={() => {
                  ActivateUser(usuario.id_usuario);
                }}
              >
                Activar mi cuenta
              </Button>
            )}
          </Stack>
        </Grid>
      </Box>
    </Layout>
  );
}
