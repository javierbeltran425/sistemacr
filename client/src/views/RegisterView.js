import { changePassword, activateUser } from "../services/UsuariosServices";
import { getSeccionesByIdUsuario } from "../services/SeccionesServices";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { getUsuarioById } from "../services/UsuariosServices";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ContextUsuario from "../context/ContextUsuario";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import Layout from "../components/layout/Layout";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { useCookies } from "react-cookie";
import React, { useEffect } from "react";
import { ListItem } from "@mui/material";
import { Toast } from "primereact/toast";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

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
  const [cookies, setCookie, removeCookie] = useCookies(null);

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
      const response = await getUsuarioById(id_usuario, cookies.authToken);

      if (response.status == 200 || response.status == 204) {
        setUsuario(response.data[0]);
        contextUsuario.setActivo(response.data[0].activo);
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        removeCookie("id_usuario");
        removeCookie("email");
        removeCookie("authToken");
        removeCookie("nombre");
        removeCookie("act");
        navigate("/");
        window.location.reload()
      } else {
        alert("Ha ocurrido un error inesperado");
      }
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
      const response = await changePassword(data, cookies.authToken);
      if (response.status == 200) {
        showSuccess();
        handleClose();
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.log("🚀 ~ file: RegisterView.js:116 ~ ChangePassword ~ error:", error)
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        removeCookie("id_usuario");
        removeCookie("email");
        removeCookie("authToken");
        removeCookie("nombre");
        removeCookie("act");
        navigate("/");
        window.location.reload()

      } else {
        setError(error.response.data.error);
      }
    }
  };

  const getSecciones = async (id_usuario) => {
    try {
      const response = await getSeccionesByIdUsuario(id_usuario, cookies.authToken);
      if (response.status == 200) {
        setSecciones(response.data);
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        removeCookie("id_usuario");
        removeCookie("email");
        removeCookie("authToken");
        removeCookie("nombre");
        removeCookie("act");
        navigate("/");
        window.location.reload()

      } else {
        alert("Ha ocurrido un error inesperado", error.response.status);
      }
    }
  };

  const ActivateUser = async (id_usuario) => {
    try {
      const response = await activateUser(id_usuario, cookies.authToken);
      if (response.status == 200) {
        contextUsuario.setActivo(true);
        setCookie("act", true);
        navigate("/");
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        removeCookie("id_usuario");
        removeCookie("email");
        removeCookie("authToken");
        removeCookie("nombre");
        removeCookie("act");
        navigate("/");
        window.location.reload()

      } else {
        alert("Ha ocurrido un error inesperado");
      }
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
    getUsuario(cookies.id_usuario);
    getSecciones(cookies.id_usuario);
  }, []);

  return (
    <Layout>
      <Toast ref={toast} />
      {cookies.act ? (
        <div className="w-full flex flex-row justify-content-start">
          <div
            className="flex flex-row justify-content-center align-items-center m-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <i className="pi pi-angle-left" style={{ fontSize: "1.5rem" }}></i>
            <p className="m-0" style={{ fontSize: "1.5rem" }}>
              Regresar
            </p>
          </div>
        </div>
      ) : (
        ""
      )}

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
                Ingresar
              </Button>
            )}
          </Stack>
        </Grid>
      </Box>
    </Layout>
  );
}
