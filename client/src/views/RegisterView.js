import { changePassword, activateUser } from "../services/UsuariosServices";
import { getSeccionesByIdUsuario } from "../services/SeccionesServices";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { getUsuarioById } from "../services/UsuariosServices";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
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
import React, { useEffect } from "react";
import { ListItem } from "@mui/material";
import { Toast } from "primereact/toast";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import useAuth from "../hooks/useAuth";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NetworkErrorHandler from "../components/NetworkErrorHandler";

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
  const [open, setOpen] = React.useState(false);
  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [error, setError] = React.useState(null);
  const [errorOld, setErrorOld] = React.useState(null);
  const [networkErrorMessage, setNetworkErrorMessage] = React.useState("");
  const toast = React.useRef(null);
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
    setOldPass("");
    setNewPass("");
    setError(null);
    setConfirmPass("");
  };

  useEffect(() => {
    setError("");
    setErrorOld("");
  }, [newPass, confirmPass, oldPass]);

  const handleClose = () => {
    setOpen(false);
  };

  const getUsuario = async (id_usuario) => {
    try {
      const response = await getUsuarioById(id_usuario, auth.accessToken);

      if (response.status == 200 || response.status == 204) {
        setUsuario(response.data[0]);
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setNetworkErrorMessage(error.response.status);
      } else {
        setNetworkErrorMessage("Error desconocido");
      }
    }
  };

  const ChangePassword = async () => {
    const expRegex =
      "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()\\-+=<>?/\\|{}\\[\\]~]{8,}$";

    const regex = new RegExp(expRegex);

    if (newPass == "" || confirmPass == "") {
      setError("Ningún campo puede estar vacío.");
      return;
    }
    if (newPass != confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!regex.test(newPass)) {
      setError("El texto no es una constraseña válida.");
      return;
    }

    if (!regex.test(oldPass)) {
      setErrorOld("El texto no es una constraseña válida.");
      return;
    }
    try {
      const data = {
        email: usuario.email,
        oldPassword: oldPass,
        newPassword: newPass,
      };
      const response = await changePassword(data, auth.accessToken);
      if (response.status == 200) {
        showSuccess();
        handleClose();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const getSecciones = async (id_usuario) => {
    try {
      const response = await getSeccionesByIdUsuario(
        id_usuario,
        auth.accessToken
      );
      if (response.status == 200) {
        setSecciones(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setNetworkErrorMessage(error.response.status);
      } else {
        setNetworkErrorMessage("Error desconocido");
      }
    }
  };

  const ActivateUser = async (id_usuario) => {
    try {
      const response = await activateUser(id_usuario, auth.accessToken);
      if (response.status == 200) {
        setAuth({ ...auth, activo: true });
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setNetworkErrorMessage(error.response.status);
      } else {
        setNetworkErrorMessage("Error desconocido");
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
    getUsuario(auth.id_usuario);
    getSecciones(auth.id_usuario);
  }, []);

  return (
    <Layout>
      <Toast ref={toast} />
      <NetworkErrorHandler
        error={networkErrorMessage}
        setNetworkErrorMessage={setNetworkErrorMessage}
      />
      {auth.activo ? (
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
          <div className="card flex justify-content-center align-items-center flex-column">
            <ul className="w-full">
              <li>La contraseña debe tener al menos 8 caracteres.</li>
              <li>
                Debe contener al menos una letra (mayúscula o minúscula) y al
                menos un número.
              </li>
              <li>
                Puedes utilizar letras (A-Z, a-z), números (0-9) y los
                siguientes caracteres especiales: ! @ # $ % ^ & * ( ) - + = &lt;
                &gt; ? / \ | {} [ ] ~.
              </li>
            </ul>
            <span className="p-float-label my-4">
              <Password
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                toggleMask
              />
              <label htmlFor="password">Contraseña Actual</label>
              <p>{errorOld}</p>
            </span>
            <hr style={{ width: "100%" }}></hr>
            <span className="p-float-label my-4">
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
                <ManageAccountsIcon />
              </ListItemAvatar>
              <ListItemText
                primary={usuario.rol}
                secondary={"Tipo de usuario"}
              />
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
