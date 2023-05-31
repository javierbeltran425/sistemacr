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
import { Dropdown } from "primereact/dropdown";
import { ContextUsuario } from "../context/usuario";
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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// constantes
import { USUARIO_ROLES } from "../constants/usuario";
import { SOLICITUDES_TIPOS_ARRAY } from "../constants/solicitudes";

// servicios
import { getMateriasByIdUsuario } from "../services/MateriasServices";
import {
  getHorariosUsuarioMateria,
  getHorariosUsuario,
} from "../services/HorariosServices";
import {
  getSolicitudesUsuariosByIdUsuarioIdMateria,
  getSolicitudesUsuariosByIdUsuario,
  deleteSolicitud,
  editSolicitud,
} from "../services/SolicitudesServices";
import { SOLICITUDES_TIPOS } from "../constants/solicitudes";
import { EnviaNotificacione } from "../services/NotificacionesServices";

moment.locale("es");
moment.tz.setDefault("America/El _Salvador");
const localizer = momentLocalizer(moment);

class CalendarAlt extends React.Component {
  static contextType = ContextUsuario;
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
      materias: [],
      materiaSeleccionada: null,
      openSlot: false,
      openEvent: false,
      nombre: "",
      email: "",
      id_materia: null,
      clickedEvent: {},
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.getMateriasByIdUsuario();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.materiaSeleccionada !== this.state.materiaSeleccionada) {
      this.getHorariosUsuarioMateria();
      this.getSolicitudesByIdUsuarioIdMateria();
    }
  }

  // función para recuperar las materias
  getMateriasByIdUsuario = async () => {
    try {
      const response = await getMateriasByIdUsuario(
        this.context.id_usuario
      ).catch((err) => {
        console.error(err);
      });
      console.log(
        "🚀 ~ file: CalendarStudent.js:109 ~ response ~ response:",
        response
      );
      if (response.status === 200) {
        if (response.data) {
          this.setState({
            materias: [
              {
                id_materia: -1,
                id_profesor: -1,
                nombre: "Todas mis materias",
                uv: "",
              },
              ...response.data,
            ],
            materiaSeleccionada: response.data[0],
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  getHorariosUsuarioMateria = async () => {
    try {
      console.log("Materia seleccionada: ", this.state.materiaSeleccionada);
      let response;
      if (this.state.materiaSeleccionada.id_materia === -1) {
        response = await getHorariosUsuario(
          this.context.id_usuario,
          this.state.materiaSeleccionada.id_materia
        );
      } else {
        response = await getHorariosUsuarioMateria(
          this.context.id_usuario,
          this.state.materiaSeleccionada.id_materia
        );
      }
      // console.log("🚀 ~ file: CalendarAlt.js:80 ~ CalendarAlt ~ response ~ response:", response)

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

  getSolicitudesByIdUsuarioIdMateria = async () => {
    try {
      let response;
      if (this.state.materiaSeleccionada.id_materia === -1) {
        response = await getSolicitudesUsuariosByIdUsuario(
          this.context.id_usuario,
          this.state.materiaSeleccionada.id_materia
        );
      } else {
        response = await getSolicitudesUsuariosByIdUsuarioIdMateria(
          this.context.id_usuario,
          this.state.materiaSeleccionada.id_materia
        );
      }
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

        this.setState({ events: json });
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
    });
  }

  handleEventSelected(event) {
    console.log("event", event);
    this.setState({
      openEvent: true,
      clickedEvent: event,
      id_materia: event.id_materia,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
      tipo: event.tipo,
      nombre: event.nombre,
      email: event.email,
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
    const { start, end, title, desc, tipo } = this.state;
    const id_usuario = this.context.id_usuario;
    const id_profesor = this.state.materiaSeleccionada.id_profesor;
    const id_materia = this.state.materiaSeleccionada.id_materia;

    const data = {
      id_usuario: id_usuario,
      id_profesor: id_profesor,
      id_materia: id_materia,
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
          id_profesor,
          id_materia,
          title,
          start,
          end,
          desc,
          tipo,
        };
        let events = this.state.events.slice();
        events.push(appointment);
        // localStorage.setItem("cachedEvents", JSON.stringify(events));
        this.setState({ events });
      }
    } catch (error) {
      console.error(error);
    }
  }

  //  Updates Existing Appointments Title and/or Description
  async updateEvent() {
    const { title, desc, tipo, start, end, events, clickedEvent, email } = this.state;
    const index = events.findIndex((event) => event === clickedEvent);
    const updatedEvent = events.slice();
    updatedEvent[index].title = title;
    updatedEvent[index].desc = desc;
    updatedEvent[index].start = start;
    updatedEvent[index].end = end;
    updatedEvent[index].tipo = tipo;
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvent));
    this.setState({
      events: updatedEvent,
    });

    const data = {
      id_solicitud: updatedEvent[index].id,
      title: title,
      description: desc,
      tipo: tipo,
      start: start,
      end: end,
    };
    const response = await editSolicitud(data).catch((err) => {
      console.error(err);
    });
    console.log(
      "🚀 ~ file: CalendarAlt.js:301 ~ CalendarAlt ~ response ~ response:",
      response
    );

    this.envioNotificacionModifica(email)
  }

  //  filters out specific event that is to be deleted and set that variable to state
  async deleteEvent() {
    let eventToDelete = this.state.events.find(
      (event) => event["start"] === this.state.start
    );
    let updatedEvents = this.state.events.filter(
      (event) => event["start"] !== this.state.start
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

    this.envioNotificacionRechazo()
  }

  envioNotificacionRechazo = async () => {
    try {
      const body = {
        sendemail: "htjavier621@gmail.com",
        emailcontent: `
          <h1>Correo automatico del sistema de solicitudes DEI</h1>
          <br/>
          <p>Estimado estudiante, se le notifica que el catedrático ha rechazado su solicitud de espacio para consulta/rebición</p>
          <p>Se recomienta ponerse en contacto con su catedrático para analizar más opciones</p>
        `
      }

      const response = await EnviaNotificacione(body).catch(err => {
        console.error(err);
      })
      console.log("🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:", response)

    } catch (error) {
      console.error(error);
    }
  }
  
  envioNotificacionModifica = async (email) => {
    try {
      const body = {
        sendemail: email,
        emailcontent: `
          <h1>Correo automatico del sistema de solicitudes DEI</h1>
          <br/>
          <p>Estimado estudiante, se le notifica que el catedrático ha hecho una modificación en su solicitud.</p>
        `
      }

      const response = await EnviaNotificacione(body).catch(err => {
        console.error(err);
      })
      console.log("🚀 ~ file: CalendarTeacher.js:377 ~ CalendarAlt ~ response ~ response:", response)

    } catch (error) {
      console.error(error);
    }
  }

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

  /*
  minuteConverter(time) {
    const [h, m] = time.split(':');
    const value = +h + m / 60;
    return value.toFixed(2);
 }
 */

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
      if (event.id_usuario != this.context.id_usuario)
        return {
          style: { backgroundColor: "#adb5bd", borderColor: "#adb5bd" },
        };
    };

    return (
      <div id="Calendar">
        <div className="flex w-full justify-content-end mb-5 lg:mb-0">
          <Dropdown
            value={this.state.materiaSeleccionada}
            options={this.state.materias}
            optionLabel="nombre"
            onChange={(e) => this.setState({ materiaSeleccionada: e.value })}
            placeholder="Seleccione una materia"
            emptyMessage="No hay datos"
            className="lg:hidden"
          />
        </div>
        <Box
          sx={{ bgcolor: "background.paper", marginBottom: 5 }}
          className="hidden lg:flex"
        >
          <Tabs
            value={this.state.materiaSeleccionada}
            onChange={(e, element) => {
              this.setState({ materiaSeleccionada: element });
            }}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
          >
            {this.state.materias.map((materia) => (
              <Tab
                value={materia}
                key={materia.id_materia}
                label={materia.nombre}
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
          //selectable
          timeslots={2}
          localizer={localizer}
          culture="es"
          slotPropGetter={customSlotPropGetter}
          eventPropGetter={null}
          showAllEvents={false}
          /*min={new Date(0, 0, 0, 6, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}*/
          onSelectEvent={(event) => {
            this.handleEventSelected(event);
          }}
        /*onSelectSlot={(slotInfo) => {
          !this.concurrentEventExists(slotInfo) &&
          this.fitsOnSchedule(slotInfo)
            ? this.handleSlotSelected(slotInfo)
            : null;
        }}*/
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
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Tipo"
                defaultValue={SOLICITUDES_TIPOS.CONSULTA}
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
          <DialogActions>
            <Button
              label="Cancel"
              secondary={"true"}
              onClick={this.handleClose}
            >
              CANCELAR
            </Button>
            <Button
              label="Submit"
              primary={"true"}
              onClick={() => {
                this.setNewAppointment(), this.handleClose();
              }}
            >
              ENVIAR
            </Button>
          </DialogActions>
        </Dialog>

        {/* Material-ui Modal for booking existing appointment */}
        <Dialog open={this.state.openEvent} onClose={this.handleClose}>
          <DialogTitle>
            {`Solicitud del ${moment(this.state.start).format("Do MMMM YYYY")}`}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ marginBottom: 0.5, marginTop: 1 }}>
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Tipo"
                value={this.state.tipo}
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
              value={this.state.title}
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
              value={this.state.desc}
              fullWidth
              onChange={(e) => {
                this.setDescription(e.target.value);
              }}
            />
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 16 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Enviada por:
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant="body2">
                  {`Nombre: ${this.state.nombre}`}
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant="body2">
                  {`Email: ${this.state.email}`}
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant="body2">
                  {`Grupo: ${this.state.materias.find(
                    (item) => item.id_materia == this.state.id_materia
                  )?.nombre
                    }`}
                </Typography>
              </CardContent>
            </Card>
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
          <DialogActions>
            <Button label="Cancel" primary={"false"} onClick={this.handleClose}>
              SALIR
            </Button>
            <Button
              label="Delete"
              secondary={"true"}
              onClick={() => {
                this.deleteEvent(), this.handleClose();
              }}
            >
              rechazar
            </Button>
            <Button
              label="Confirm Edit"
              secondary={"true"}
              onClick={() => {
                this.updateEvent(), this.handleClose();
              }}
            >
              GUARDAR CAMBIOS
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CalendarAlt;
