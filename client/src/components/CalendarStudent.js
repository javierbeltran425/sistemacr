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

// constantes
import { USUARIO_ROLES } from "../constants/usuario";
import { SOLICITUDES_TIPOS_ARRAY } from "../constants/solicitudes";

// servicios
import { getMateriasByIdUsuario } from "../services/MateriasServices";
import { getHorariosUsuarioMateria } from "../services/HorariosServices";
import {
  getSolicitudesByIdUsuarioIdMateria,
  deleteSolicitud,
  editSolicitud,
} from "../services/SolicitudesServices";
import { SOLICITUDES_TIPOS } from "../constants/solicitudes";

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
      clickedEvent: {},
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.getMateriasByIdUsuario();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.materiaSeleccionada !== this.state.materiaSeleccionada) {
      console.log("oh hello there");
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
        this.setState({ materias: response.data });
        if (this.state.materias)
          this.setState({ materiaSeleccionada: this.state.materias[0] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  getHorariosUsuarioMateria = async () => {
    let id_usuario;
    if (this.context.rol == USUARIO_ROLES.PROFESOR)
      id_usuario = this.context.id_usuario;
    else id_usuario = this.state.materiaSeleccionada.id_profesor;
    try {
      console.log("Materia seleccionada: ", this.state.materiaSeleccionada);
      const response = await getHorariosUsuarioMateria(
        id_usuario,
        this.state.materiaSeleccionada.id_materia
      ).catch((err) => {
        console.error(err);
      });
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
      const response = await getSolicitudesByIdUsuarioIdMateria(
        this.state.materiaSeleccionada.id_profesor,
        this.state.materiaSeleccionada.id_materia
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
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
      tipo: event.tipo,
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
    const { title, desc, tipo, start, end, events, clickedEvent } = this.state;
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
  }

  concurrentEventExists = (slotInfo) => {
    return this.state.events.some(
      (item) =>
        (item.start < slotInfo.start && slotInfo.start < item.end) ||
        (item.start < slotInfo.end && slotInfo.end < item.end)
    );
  };

  render() {
    console.log("render()");

    const customSlotPropGetter = (date) => {
      const backgroundEvents = this.state.backgroundEvents;
      var d = date.getHours() + date.getMinutes() / 60.0;
      for (let i = 0; i < backgroundEvents.length; i++) {
        let t1 =
          backgroundEvents[i].start.getHours() +
          backgroundEvents[i].start.getMinutes() / 60.0;
        let t2 =
          backgroundEvents[i].end.getHours() +
          backgroundEvents[i].end.getMinutes() / 60.0;
        if (
          date.getDay() == backgroundEvents[i].start.getDay() &&
          d >= t1 &&
          d < t2
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
        <div className="flex w-full justify-content-end mb-5">
          <Dropdown
            value={this.state.materiaSeleccionada}
            options={this.state.materias}
            optionLabel="nombre"
            onChange={(e) => this.setState({ materiaSeleccionada: e.value })}
            placeholder="Seleccione una materia"
            emptyMessage="No hay datos"
          />
        </div>
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
          /*min={new Date(0, 0, 0, 6, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}*/
          onSelectEvent={(event) => {
            event.id_usuario == this.context.id_usuario
              ? this.handleEventSelected(event)
              : console.log(event.id_usuario, this.context.id_usuario);
          }}
          onSelectSlot={(slotInfo) => {
            this.concurrentEventExists(slotInfo)
              ? null
              : this.handleSlotSelected(slotInfo);
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
            {`Editando una reunión el ${moment(this.state.start).format(
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
              CANCELAR
            </Button>
            <Button
              label="Delete"
              secondary={"true"}
              onClick={() => {
                this.deleteEvent(), this.handleClose();
              }}
            >
              BORRAR
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
