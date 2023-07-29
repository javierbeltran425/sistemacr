import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import DialogActions from "@mui/material/DialogActions";
import ContextUsuario from "../context/ContextUsuario";
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
import Stack from "@mui/material/Stack";
import { Toast } from "primereact/toast";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SquareIcon from "@mui/icons-material/Square";
import Divider from "@mui/material/Divider";
import LeyendaColores from "./LeyendaColores";
import Cookies from "universal-cookie";

// constantes
import {
  SOLICITUDES_ESTADOS,
  SOLICITUDES_TIPOS_ARRAY,
} from "../constants/solicitudes";

// servicios
import { getSeccionesByIdUsuario } from "../services/SeccionesServices";
import { getHorariosByIdSeccion } from "../services/HorariosServices";
import {
  getSolicitudesByIdSeccion,
  deleteSolicitud,
  editSolicitud,
} from "../services/SolicitudesServices";
import { SOLICITUDES_TIPOS } from "../constants/solicitudes";
import { EnviaNotificacione } from "../services/NotificacionesServices";
import { getInfoUsuario } from "../services/UsuariosServices";
import { Square } from "@mui/icons-material";

moment.locale("es");
moment.tz.setDefault("America/El _Salvador");
const localizer = momentLocalizer(moment);
const cookies = new Cookies();

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

  constructor() {
    super();
    this.state = {
      events: [],
      backgroundEvents: [],
      title: "",
      start: "",
      end: "",
      desc: "",
      tipo: "",
      estado: "",
      secciones: [],
      seccionSeleccionada: null,
      openSlot: false,
      openEvent: false,
      clickedEvent: {},
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.getSeccionesByIdUsuario(cookies.get("id_usuario"));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.seccionSeleccionada !== this.state.seccionSeleccionada) {
      this.getHorariosByIdSeccion();
      this.getSolicitudesByIdSeccion();
    }
  }

  // función para recuperar las materias
  getSeccionesByIdUsuario = async () => {
    try {
      const response = await getSeccionesByIdUsuario(
        cookies.get("id_usuario")
      ).catch((err) => {
        console.error(err);
      });
      console.log(
        "🚀 ~ file: TeacherView.js:109 ~ response ~ response:",
        response
      );
      if (response.status === 200) {
        this.setState({ secciones: response.data });
        if (response.data)
          this.setState({
            seccionSeleccionada: response.data[0],
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  getInfUs = async (id_usuario) => {
    try {
      const body = {
        id_usuario: id_usuario,
      };

      const response = await getInfoUsuario(body).catch((err) => {
        console.error(err);
      });
      console.log(
        "🚀 ~ file: CalendarTeacher.js:214 ~ CalendarAlt ~ response ~ getInfUs:",
        response
      );
    } catch (error) {
      console.error(error);
    }
  };

  getHorariosByIdSeccion = async () => {
    try {
      const response = await getHorariosByIdSeccion(
        this.state.seccionSeleccionada.id_seccion
      ).catch((err) => {
        console.error(err);
      });

      if (response.status === 200) {
        const json = response.data;
        console.log(
          "🚀 ~ file: CalendarAlt.js:84 ~ CalendarAlt ~ getHorariosUsuarioMateria= ~ json:",
          json
        );

        json.forEach((element) => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
        });
        this.setState({ backgroundEvents: json });
      }
    } catch (error) {
      console.error(error);
    }
  };

  getSolicitudesByIdSeccion = async () => {
    try {
      const response = await getSolicitudesByIdSeccion(
        this.state.seccionSeleccionada.id_seccion
      );
      if (response.status === 200) {
        const json = response.data;
        console.log(
          "🚀 ~ file: CalendarAlt.js:84 ~ CalendarAlt ~ getSolicitudesByIdUsuarioIdMateria= ~ json:",
          json
        );

        json.forEach((element) => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
        });

        this.setState({
          events: json,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  //closes modals
  handleClose() {
    this.setState({ openEvent: false, openSlot: false });
  }

  //  Allows user to click on calendar slot and handles if appointment exists
  handleSlotSelected(slotInfo) {
    console.log("Real slotInfo", slotInfo);
    this.setState({
      title: "",
      desc: "",
      start: slotInfo.start,
      end: slotInfo.end,
      openSlot: true,
      tipo: SOLICITUDES_TIPOS.CONSULTA,
    });
  }

  handleEventSelected(event) {
    console.log("event", event);
    this.setState({
      openEvent: true,
      clickedEvent: event,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
      tipo: event.tipo,
      estado: event.estado,
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
    this.setState({ start: new Date(date) });
  }

  handleEndTime(date) {
    this.setState({ end: new Date(date) });
  }

  // Onclick callback function that pushes new appointment into events array.
  async setNewAppointment() {
    const { start, end, title, desc, tipo, email } = this.state;
    const id_usuario = cookies.get("id_usuario");
    const id_materia = this.state.seccionSeleccionada.id_materia;
    const id_seccion = this.state.seccionSeleccionada.id_seccion;
    const estado = "PENDIENTE";

    const data = {
      id_usuario: id_usuario,
      id_materia: id_materia,
      id_seccion: id_seccion,
      title: title,
      description: desc,
      tipo: tipo,
      start: start,
      end: end,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/solicitudes/createsolicitud`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        console.log("Ok!");
        const json = await response.json();
        let appointment = {
          id: json[0].id_solicitud,
          id_usuario,
          id_materia,
          id_seccion,
          title,
          start,
          end,
          desc,
          tipo,
          estado,
        };
        let events = this.state.events.slice();
        events.push(appointment);
        // localStorage.setItem("cachedEvents", JSON.stringify(events));
        this.setState({ events });

        const response2 = await getInfoUsuario({
          id_usuario: this.state.seccionSeleccionada.id_profesor,
        }).catch((err) => {
          console.error(err);
        });
        console.log(
          "🚀 ~ file: CalendarStudent.js:288 ~ CalendarAlt ~ response ~ response:",
          response2
        );

        const response3 = await getInfoUsuario({
          id_usuario: cookies.get("id_usuario"),
        }).catch((err) => {
          console.error(err);
        });
        console.log(
          "🚀 ~ file: CalendarStudent.js:294 ~ CalendarAlt ~ response3 ~ response3:",
          response3
        );

        this.envioNotificacionCrea(
          response2.data[0].email,
          response3.data[0].nombre
        );

        this.showSuccess("Su solicitud ha sido registrada con éxito");
      } else {
        this.showError("Ha ocurrido un error al registrar su solicitud");
      }
    } catch (error) {
      console.error(error);
    }
  }

  //  filters out specific event that is to be deleted and set that variable to state
  async deleteEvent() {
    const { email } = this.state;

    let eventToDelete = this.state.clickedEvent;
    let updatedEvents = this.state.events.filter(
      (event) => event !== eventToDelete
    );
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });

    console.log("Evento a eliminar: ", this.state.events);

    const response = await deleteSolicitud(eventToDelete.id).catch((err) => {
      console.error(err);
    });
    console.log(
      "🚀 ~ file: CalendarAlt.js:301 ~ CalendarAlt ~ response ~ response:",
      response
    );

    if (response.status === 200) {
      const response2 = await getInfoUsuario({
        id_usuario: this.state.seccionSeleccionada.id_profesor,
      }).catch((err) => {
        console.error(err);
      });

      const response3 = await getInfoUsuario({
        id_usuario: cookies.get("id_usuario"),
      }).catch((err) => {
        console.error(err);
      });
      console.log(
        "🚀 ~ file: CalendarStudent.js:294 ~ CalendarAlt ~ response3 ~ response3:",
        response3
      );

      this.envioNotificacionElimina(
        response2.data[0].email,
        response3.data[0].nombre
      );
      this.showSuccess("Su solicitud ha sido eliminada con éxito");
    } else {
      this.showError("Ha ocurrido un problema para eliminar su solicitud");
    }
  }

  envioNotificacionCrea = async (email, nombre) => {
    try {
      const body = {
        sendemail: email,
        emailcontent: `
          <h1>Correo automático del sistema de solicitudes DEI</h1>
          <br/>
          <p>Estimado docente, se le notifica que el estudiante  ${nombre}  ha registrado una solicitud en sus horarios disponibles.</p>
        `,
      };

      const response = await EnviaNotificacione(body).catch((err) => {
        console.error(err);
      });
      console.log(
        "🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:",
        response
      );
    } catch (error) {
      console.error(error);
    }
  };

  envioNotificacionEdita = async (email, nombre) => {
    try {
      const body = {
        sendemail: email,
        emailcontent: `
          <h1>Correo automático del sistema de solicitudes DEI</h1>
          <br/>
          <p>Estimado docente, se le notifica que el estudiante  ${nombre}  ha modificado una solicitud en sus horarios disponibles.</p>
        `,
      };

      const response = await EnviaNotificacione(body).catch((err) => {
        console.error(err);
      });
      console.log(
        "🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:",
        response
      );
    } catch (error) {
      console.error(error);
    }
  };

  envioNotificacionElimina = async (email, nombre) => {
    try {
      const body = {
        sendemail: email,
        emailcontent: `
          <h1>Correo automático del sistema de solicitudes DEI</h1>
          <br/>
          <p>Estimado docente, se le notifica que el estudiante  ${nombre}  ha eliminado una solicitud en sus horarios disponibles.</p>
        `,
      };

      const response = await EnviaNotificacione(body).catch((err) => {
        console.error(err);
      });
      console.log(
        "🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:",
        response
      );
    } catch (error) {
      console.error(error);
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
        return <Square sx={{ color: "#7E1717" }} />;
      case SOLICITUDES_ESTADOS.ACEPTADO:
        return <Square color="success" />;
      default:
        return <Square color="primary" />;
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
    console.log("render()");

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
      if (event.id_usuario != cookies.get("id_usuario")) {
        return {
          style: { backgroundColor: "#adb5bd", borderColor: "#adb5bd" },
        };
      } else {
        switch (event.estado) {
          case SOLICITUDES_ESTADOS.RECHAZADO:
            return {
              style: { backgroundColor: "#7E1717", borderColor: "#7E1717" },
            };
          case SOLICITUDES_ESTADOS.ACEPTADO:
            return {
              style: { backgroundColor: "#17594a", borderColor: "#17594a" },
            };
          case SOLICITUDES_ESTADOS.AUSENTE:
            return {
              style: { backgroundColor: "#7E1717", borderColor: "#7E1717" },
            };
          case SOLICITUDES_ESTADOS.ATENDIDO:
            return {
              style: { backgroundColor: "#17594a", borderColor: "#17594a" },
            };
          default:
            return;
        }
      }
    };

    return (
      <div id="Calendar">
        <Toast ref={(el) => (this.toast = el)} />
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
                  {`${seccion.nombre} (Sección ${seccion.numero})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{ bgcolor: "background.paper", marginBottom: 5 }}
          className="hidden md:flex w-full justify-content-between"
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
                    <Typography sx={{ textTransform: "none" }}>
                      Sección {seccion.numero}
                    </Typography>
                  </div>
                }
              />
            ))}
          </Tabs>

          <LeyendaColores />
        </Box>

        {/* react-big-calendar library utilized to render calendar*/}
        <Calendar
          messages={this.messages}
          events={this.state.events}
          views={["month", "week", "day", "agenda"]}
          defaultView="week"
          style={{ height: "80vh" }}
          defaultDate={new Date()}
          selectable
          timeslots={2}
          localizer={localizer}
          culture="es"
          slotPropGetter={customSlotPropGetter}
          eventPropGetter={customEventPropGetter}
          showAllEvents={true}
          min={new Date(0, 0, 0, 6, 0, 0)}
          //max={new Date(0, 0, 0, 23, 0, 0)}
          onSelectEvent={(event) => {
            event.id_usuario == cookies.get("id_usuario")
              ? this.handleEventSelected(event)
              : console.log(event.id_usuario, cookies.get("id_usuario"));
          }}
          onSelectSlot={(slotInfo) => {
            !this.concurrentEventExists(slotInfo) &&
            this.fitsOnSchedule(slotInfo)
              ? this.handleSlotSelected(slotInfo)
              : this.showError("El horario seleccionado no está disponible.");
          }}
        />

        {/* Material-ui Modal for booking new appointment */}
        <Dialog open={this.state.openSlot} onClose={this.handleClose}>
          <DialogTitle>
            {`Solicita una reunión el ${moment(this.state.start).format(
              "Do MMMM YYYY"
            )}`}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ marginBottom: 0.5, marginTop: 1 }}>
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                value={this.state.tipo}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Tipo"
                onChange={(e) => {
                  this.setTipo(e.target.value);
                }}
              >
                {SOLICITUDES_TIPOS_ARRAY.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Título"
              margin="dense"
              fullWidth
              onChange={(e) => {
                this.setTitle(e.target.value);
              }}
            />
            <br />
            <TextField
              label="Descripción"
              multiline
              minRows={2}
              maxRows={4}
              margin="dense"
              fullWidth
              onChange={(e) => {
                this.setDescription(e.target.value);
              }}
            />
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
              secondary={"true"}
              onClick={this.handleClose}
              variant="outlined"
            >
              SALIR
            </Button>
            <Button
              label="Submit"
              primary={"true"}
              onClick={() => {
                this.setNewAppointment(), this.handleClose();
              }}
              color="success"
              variant="outlined"
            >
              ENVIAR SOLICITUD
            </Button>
          </DialogActions>
        </Dialog>

        {/* Material-ui Modal for editing existing appointment */}
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
                  secondary={this.state.desc}
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
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Stack direction="row">
              <Button
                label="Cancel"
                primary={"false"}
                onClick={this.handleClose}
                variant="outlined"
              >
                SALIR
              </Button>
            </Stack>
            <Stack direction="row">
              {this.state.estado == SOLICITUDES_ESTADOS.PENDIENTE && (
                <Button
                  label="Delete"
                  secondary={"true"}
                  onClick={() => {
                    this.deleteEvent(), this.handleClose();
                  }}
                  color="error"
                  variant="outlined"
                >
                  ELIMINAR SOLICITUD
                </Button>
              )}
            </Stack>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CalendarAlt;
