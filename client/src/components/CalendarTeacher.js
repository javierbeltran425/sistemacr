import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import DialogActions from "@mui/material/DialogActions";
import "../constants/usuario";
import "../styles/Calendar.css";
import "moment/locale/es";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Toast } from "primereact/toast";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { AuthHookHoc } from "./auth/AuthHookHoc";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

// constantes
import {
  SOLICITUDES_COLORES,
  SOLICITUDES_ESTADOS,
} from "../constants/solicitudes";

// servicios
import { getSeccionesByIdUsuario } from "../services/SeccionesServices";
import {
  getHorariosByIdSeccion,
  getHorariosByIdUsuario,
} from "../services/HorariosServices";
import {
  getSolicitudesUsuariosByIdSeccion,
  editSolicitud,
  actualizaEstadoSolicitud,
  archivarSolicitud,
} from "../services/SolicitudesServices";
import { EnviaNotificacione } from "../services/NotificacionesServices";

moment.locale("es");
moment.tz.setDefault("America/El _Salvador");
const localizer = momentLocalizer(moment);

class CalendarAlt extends React.Component {
  messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Na hay eventos este día.",
  };

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      backgroundEvents: [],
      title: "",
      start: "",
      end: "",
      desc: "",
      tipo: "",
      secciones: [],
      seccionSeleccionada: null,
      openSlot: false,
      openEvent: false,
      nombre: "",
      email: "",
      id_seccion: null,
      estado: "",
      timeIsChanged: false,
      alertIsOpen: true,
      clickedEvent: {},
      showArchiveModal: false,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.getSeccionesByIdUsuario();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.seccionSeleccionada !== this.state.seccionSeleccionada) {
      this.getHorariosByIdSeccion();
      this.getSolicitudes();
    }
  }

  // función para recuperar las materias
  getSeccionesByIdUsuario = async () => {
    try {
      const response = await getSeccionesByIdUsuario(
        this.props.auth.id_usuario,
        this.props.auth.accessToken
      );

      if (response.status === 200) {
        if (response.data) {
          this.setState({
            secciones: [
              {
                id_materia: -1,
                id_seccion: -1,
                id_profesor: -1,
                nombre: "Todas mis materias",
                uv: "",
              },
              ...response.data,
            ],
            seccionSeleccionada: response.data[0],
          });
        }
      }
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  getHorariosByIdSeccion = async () => {
    try {
      let response;
      if (this.state.seccionSeleccionada.id_seccion === -1) {
        response = await getHorariosByIdUsuario(
          this.props.auth.id_usuario,
          this.props.auth.accessToken
        );
      } else {
        response = await getHorariosByIdSeccion(
          this.state.seccionSeleccionada.id_seccion,
          this.props.auth.accessToken
        );
      }

      if (response.status === 200) {
        const json = response.data;

        json.forEach((element) => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
        });
        this.setState({ backgroundEvents: json });
      }
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  getSolicitudes = async () => {
    try {
      let response;
      if (this.state.seccionSeleccionada.id_seccion === -1) {
        response = await getSolicitudesUsuariosByIdSeccion(
          {
            id_seccion: this.state.secciones.map((e) => e.id_seccion),
          },
          this.props.auth.accessToken
        );
      } else {
        response = await getSolicitudesUsuariosByIdSeccion(
          {
            id_seccion: [this.state.seccionSeleccionada.id_seccion],
          },
          this.props.auth.accessToken
        );
      }
      if (response.status === 200) {
        const json = response.data;

        json.forEach((element) => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
        });

        this.setState({
          events: json,
        });
      }
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  //closes modals
  handleClose() {
    this.setState({ openEvent: false, openSlot: false });
  }

  handleCloseArchiveModal() {
    this.setState({ showArchiveModal: false });
  }

  //  Allows user to click on calendar slot and handles if appointment exists
  handleSlotSelected(slotInfo) {
    this.setState({
      title: "",
      desc: "",
      start: slotInfo.start,
      end: slotInfo.end,
      openSlot: true,
    });
  }

  handleEventSelected(event) {
    this.setState({
      openEvent: true,
      clickedEvent: event,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
      tipo: event.tipo,
      nombre: event.nombre,
      email: event.email,
      id_seccion: event.id_seccion,
      estado: event.estado,
      timeIsChanged: false,
    });
  }

  setTitle(e) {
    this.setState({ title: e });
  }

  setTipo(e) {
    this.setState({ tipo: e });
  }

  setDescription(e) {
    this.setState({ desc: e });
  }

  handleStartTime(date) {
    this.setState({ start: new Date(date), timeIsChanged: true });
  }

  handleEndTime(date) {
    this.setState({ end: new Date(date), timeIsChanged: true });
  }

  //  Updates Existing Appointments Title and/or Description
  async updateEvent() {
    const { title, desc, tipo, start, end, clickedEvent, email } = this.state;

    const data = {
      id_solicitud: clickedEvent.id,
      title: title,
      description: desc,
      tipo: tipo,
      start: start,
      end: end,
    };

    try {
      const response = await editSolicitud(data, this.props.auth.accessToken);

      if (response.status === 200) {
        this.envioNotificacionModifica(email);
        this.showSuccess("El evento ha sido actualizado con éxito");
        this.getSolicitudes();
      } else {
        this.showError("Ha ocurrido un error al actualizar el evento");
      }
    } catch (error) {
      this.showError(error.response.data.message);
    }
  }

  envioNotificacionRechazo = async (email) => {
    try {
      const body = {
        sendemail: email,
        emailcontent: `
          <h1>Correo automático del sistema de solicitudes DEI</h1>
          <br/>
          <p>Estimado estudiante, se le notifica que el catedrático ha rechazado su solicitud de espacio para consulta/revisión</p>
          <p>Se recomienda ponerse en contacto con su catedrático para analizar más opciones</p>
        `,
      };

      const response = await EnviaNotificacione(
        body,
        this.props.auth.accessToken
      );
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  envioNotificacionAceptada = async (email) => {
    try {
      const body = {
        sendemail: email,
        emailcontent: `
          <h1>Correo automático del sistema de solicitudes DEI</h1>
          <br/>
          <p>Estimado estudiante, se le notifica que el catedrático ha aceptado su solicitud de espacio para consulta/revisión</p>
        `,
      };

      const response = await EnviaNotificacione(
        body,
        this.props.auth.accessToken
      );
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  envioNotificacionModifica = async (email) => {
    try {
      const body = {
        sendemail: email,
        emailcontent: `
          <h1>Correo automático del sistema de solicitudes DEI</h1>
          <br/>
          <p>Estimado estudiante, se le notifica que el catedrático ha hecho una modificación en su solicitud.</p>
        `,
      };

      const response = await EnviaNotificacione(
        body,
        this.props.auth.accessToken
      );
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  actualizarSolicitudEstado = async (estado) => {
    try {
      const body = {
        id_solicitud: this.state.clickedEvent.id,
        estado: estado,
      };

      const response = await actualizaEstadoSolicitud(
        body,
        this.props.auth.accessToken
      );

      if (response.status === 200) {
        this.showSuccess("La solicitud ha sido respondida");
        this.getSolicitudes();

        const { email } = this.state;

        switch (estado) {
          case SOLICITUDES_ESTADOS.RECHAZADO:
            this.envioNotificacionRechazo(email);
            break;

          default:
            this.envioNotificacionAceptada(email);
            break;
        }
      } else {
        this.showError("Ha ocurrido un error al responder la solicitud");
      }
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  archivarSolicitud = async (id_solicitud) => {
    try {
      const response = await archivarSolicitud(
        id_solicitud,
        this.props.auth.accessToken
      );

      if (response.status === 200) {
        this.showSuccess("La solicitud ha sido archivada");
        this.getSolicitudes();
      } else {
        this.showError("Ha ocurrido un error al responder la solicitud");
      }
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  concurrentEventExists = (slotInfo) => {
    return this.state.events.some(
      (item) =>
        (item.start < slotInfo.start && slotInfo.start < item.end) ||
        (item.start < slotInfo.end && slotInfo.end < item.end)
    );
  };

  fitsOnSchedule = (slotInfo) => {
    return this.state.backgroundEvents.some(
      (item) => item.start <= slotInfo.start && slotInfo.end <= item.end
    );
  };

  renderStatusSquare(estado) {
    switch (estado) {
      case SOLICITUDES_ESTADOS.RECHAZADO:
        return <SquareRoundedIcon sx={{ color: SOLICITUDES_COLORES.ROJO }} />;
      case SOLICITUDES_ESTADOS.AUSENTE:
        return <SquareRoundedIcon sx={{ color: SOLICITUDES_COLORES.ROJO }} />;
      case SOLICITUDES_ESTADOS.ACEPTADO:
        return <SquareRoundedIcon color="success" />;
      case SOLICITUDES_ESTADOS.ATENDIDO:
        return <SquareRoundedIcon color="success" />;
      default:
        return <SquareRoundedIcon color="primary" />;
    }
  }

  showSuccess(message) {
    this.toast.show({
      severity: "success",
      summary: "Éxito",
      detail: message,
      life: 3000, // Tiempo de duración del mensaje en milisegundos
    });
  }

  showError(message) {
    this.toast.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000, // Tiempo de duración del mensaje en milisegundos
    });
  }

  render() {
    const customSlotPropGetter = (date) => {
      const backgroundEvents = this.state.backgroundEvents;
      for (let i = 0; i < backgroundEvents.length; i++) {
        if (
          backgroundEvents[i].start <= date &&
          date < backgroundEvents[i].end
        ) {
          return {
            style: {
              backgroundColor: "#C2F5DA",
            },
          };
        }
      }
      return;
    };

    const customEventPropGetter = (event) => {
      switch (event.estado) {
        case SOLICITUDES_ESTADOS.RECHAZADO:
          return {
            style: {
              backgroundColor: SOLICITUDES_COLORES.ROJO,
              borderColor: SOLICITUDES_COLORES.ROJO,
            },
          };
        case SOLICITUDES_ESTADOS.AUSENTE:
          return {
            style: {
              backgroundColor: SOLICITUDES_COLORES.ROJO,
              borderColor: SOLICITUDES_COLORES.ROJO,
            },
          };
        case SOLICITUDES_ESTADOS.ACEPTADO:
          return {
            style: {
              backgroundColor: SOLICITUDES_COLORES.VERDE,
              borderColor: SOLICITUDES_COLORES.VERDE,
            },
          };
        case SOLICITUDES_ESTADOS.ATENDIDO:
          return {
            style: {
              backgroundColor: SOLICITUDES_COLORES.VERDE,
              borderColor: SOLICITUDES_COLORES.VERDE,
            },
          };
        default:
          return;
      }
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
      <div id="Calendar">
        <Toast ref={(el) => (this.toast = el)} />

        <div>
          <Modal
            open={this.state.showArchiveModal}
            onClose={this.handleCloseArchiveModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                ¿Deseas ocultar la solicitud? (El espacio estará disponible de
                nuevo)
              </Typography>
              <Stack
                direction="row"
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  label="Delete"
                  secondary={"true"}
                  onClick={() => {
                    this.handleCloseArchiveModal();
                  }}
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                >
                  NO
                </Button>
                <Button
                  label="Confirm Edit"
                  secondary={"true"}
                  onClick={() => {
                    this.archivarSolicitud(this.state.clickedEvent.id),
                      this.handleCloseArchiveModal();
                  }}
                  variant="outlined"
                >
                  SI
                </Button>
              </Stack>
            </Box>
          </Modal>
        </div>

        <Box
          sx={{ minWidth: 120, maxWidth: "80%" }}
          className="flex w-full justify-content-end mb-5 lg:mb-0 mx-auto"
        >
          <FormControl fullWidth className="lg:hidden">
            <InputLabel id="demo-simple-select-label"></InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state?.seccionSeleccionada}
              label=""
              onChange={(value) =>
                this.setState({
                  seccionSeleccionada: value.target.value,
                })
              }
            >
              {this.state.secciones.map((seccion) => (
                <MenuItem key={seccion.id_seccion} value={seccion}>
                  {seccion.id_seccion != -1
                    ? `${seccion.nombre} (Sección ${seccion.numero})`
                    : `${seccion.nombre}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{ bgcolor: "background.paper", marginBottom: 5 }}
          className="hidden lg:flex"
        >
          <Tabs
            value={this.state.seccionSeleccionada}
            onChange={(e, element) => {
              this.setState({
                seccionSeleccionada: element,
              });
            }}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
          >
            {this.state.secciones.map((seccion) => (
              <Tab
                value={seccion}
                key={seccion.id_seccion}
                label={
                  <div>
                    <Typography>{seccion.nombre}</Typography>
                    {seccion.id_seccion != -1 && (
                      <Typography sx={{ textTransform: "none" }}>
                        Sección {seccion.numero}
                      </Typography>
                    )}
                  </div>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* react-big-calendar library utilized to render calendar*/}
        <Calendar
          messages={this.messages}
          events={this.state.events}
          views={["month", "week", "day", "agenda"]}
          defaultView="week"
          style={{ height: "80vh" }}
          defaultDate={new Date()}
          timeslots={2}
          localizer={localizer}
          culture="es"
          slotPropGetter={customSlotPropGetter}
          eventPropGetter={customEventPropGetter}
          showAllEvents={false}
          min={new Date(0, 0, 0, 6, 0, 0)}
          onSelectEvent={(event) => {
            this.handleEventSelected(event);
          }}
        />

        {/* Material-ui Modal for booking existing appointment */}
        <Dialog open={this.state.openEvent} onClose={this.handleClose}>
          <DialogTitle>
            {this.state.title ? this.state.title : "(Sin título)"}
          </DialogTitle>
          <DialogContent>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              <ListItem>
                <ListItemText primary="Estado" secondary={this.state.estado} />
                {this.renderStatusSquare(this.state.estado)}
              </ListItem>
              <Divider variant="" component="li" />
              <ListItem>
                <ListItemText
                  primary="Tipo"
                  secondary={
                    this.state.tipo.charAt(0).toUpperCase() +
                    this.state.tipo.slice(1)
                  }
                />
              </ListItem>
              <Divider variant="" component="li" />
              <ListItem>
                <ListItemText
                  primary="Descripción"
                  secondary={
                    this.state.desc ? this.state.desc : "Sin descripción"
                  }
                />
              </ListItem>
              <Divider variant="" component="li" />
              <ListItem>
                <ListItemText
                  primary="Fecha"
                  secondary={`${moment(this.state.start).format(
                    "Do MMMM YYYY"
                  )} de ${moment(this.state.start).format("LT a")} a ${moment(
                    this.state.end
                  ).format("LT a")}`}
                />
              </ListItem>
            </List>
            <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
              Enviada por:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Item>Nombre</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{this.state.nombre}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item>Email</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{this.state.email}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item>Grupo</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {
                    this.state.secciones.find(
                      (item) => item.id_seccion == this.state.id_seccion
                    )?.nombre
                  }
                  {" ("}
                  Sección
                  {
                    this.state.secciones.find(
                      (item) => item.id_seccion == this.state.id_seccion
                    )?.numero
                  }
                  {")"}
                </Item>
              </Grid>
            </Grid>
            <Collapse in={this.state.alertIsOpen} sx={{ marginTop: 1 }}>
              <Alert
                severity="info"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      this.setState({ alertIsOpen: false });
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                Puedes modificar el horario de la reunión a continuación.
              </Alert>
            </Collapse>
            <DemoContainer components={["MobileTimePicker"]}>
              <DemoItem label="Hora de inicio">
                <MobileTimePicker
                  value={moment(this.state.start)}
                  minutesStep={5}
                  onChange={(date) => this.handleStartTime(date)}
                />
              </DemoItem>
              <DemoItem label="Hora de finalización">
                <MobileTimePicker
                  value={moment(this.state.end)}
                  minutesStep={5}
                  onChange={(date) => this.handleEndTime(date)}
                />
              </DemoItem>
            </DemoContainer>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              label="Cancel"
              primary={"false"}
              onClick={this.handleClose}
              variant="outlined"
              sx={{ marginRight: 1 }}
            >
              SALIR
            </Button>
            {this.state.estado == SOLICITUDES_ESTADOS.PENDIENTE && (
              <Stack direction="row">
                <Button
                  label="Delete"
                  secondary={"true"}
                  onClick={() => {
                    this.actualizarSolicitudEstado(
                      SOLICITUDES_ESTADOS.RECHAZADO
                    ),
                      this.setState({ showArchiveModal: true }),
                      this.handleClose();
                  }}
                  variant="outlined"
                  color="error"
                  sx={{ marginRight: 1 }}
                >
                  RECHAZAR SOLICITUD
                </Button>
                {this.state.timeIsChanged && (
                  <Button
                    label="Confirm Edit"
                    secondary={"true"}
                    onClick={() => {
                      this.updateEvent(),
                        this.actualizarSolicitudEstado(
                          SOLICITUDES_ESTADOS.ACEPTADO
                        ),
                        this.handleClose();
                    }}
                    variant="outlined"
                    color="success"
                  >
                    GUARDAR CAMBIOS Y ACEPTAR
                  </Button>
                )}
                {!this.state.timeIsChanged && (
                  <Button
                    label="Confirm Edit"
                    secondary={"true"}
                    onClick={() => {
                      this.actualizarSolicitudEstado(
                        SOLICITUDES_ESTADOS.ACEPTADO
                      );
                      this.handleClose();
                    }}
                    variant="outlined"
                    color="success"
                  >
                    ACEPTAR SOLICITUD
                  </Button>
                )}
              </Stack>
            )}
            {moment().toDate().getTime() >= this.state.start &&
              this.state.estado == SOLICITUDES_ESTADOS.ACEPTADO && (
                <Stack>
                  <Zoom in={this.state.openEvent}>
                    <Stack direction="row">
                      <span className="flex align-items-center">
                        ¿Se presentó el estudiante a la reunión?
                      </span>
                      <Button
                        onClick={() => {
                          this.actualizarSolicitudEstado(
                            SOLICITUDES_ESTADOS.ATENDIDO
                          ),
                            this.updateEvent(),
                            this.handleClose();
                        }}
                      >
                        SI
                      </Button>
                      <p className="flex align-items-center">/</p>
                      <Button
                        onClick={() => {
                          this.actualizarSolicitudEstado(
                            SOLICITUDES_ESTADOS.AUSENTE
                          ),
                            this.updateEvent(),
                            this.handleClose();
                        }}
                      >
                        NO
                      </Button>
                    </Stack>
                  </Zoom>
                </Stack>
              )}
            {this.state.estado == SOLICITUDES_ESTADOS.RECHAZADO && (
              <Stack>
                <Zoom in={this.state.openEvent}>
                  <Stack direction="row">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        this.archivarSolicitud(this.state.clickedEvent.id),
                          this.handleCloseArchiveModal();
                        this.handleClose();
                      }}
                    >
                      OCULTAR SOLICITUD
                    </Button>
                  </Stack>
                </Zoom>
              </Stack>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AuthHookHoc(CalendarAlt);

CalendarAlt.propTypes = {
  auth: PropTypes.object,
};
