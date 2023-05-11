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
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import "../constants/usuario";
import "../styles/Calendar.css";
import "moment/locale/es";

// servicios
import {
  deleteHorariosUsuarioMateria,
  registrarHorario,
} from "../services/HorariosServices";
import { getMateriasByIdUsuario } from "../services/MateriasServices";
import { getHorariosUsuarioMateria } from "../services/HorariosServices";
import { USUARIO_ROLES } from "../constants/usuario";

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
      identificador: null,
      materias: [],
      materiaSeleccionada: null,
      openSlot: false,
      openEvent: false,
      clickedEvent: {},
      recurrencia: 1,
      recurrente: false,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.getMateriasByIdUsuario();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.materiaSeleccionada !== this.state.materiaSeleccionada) {
      this.getHorariosUsuarioMateria();
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
        "🚀 ~ file: TeacherView.js:109 ~ response ~ response:",
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
    console.log("event aaa", event);
    this.setState({
      openEvent: true,
      clickedEvent: event,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
      identificador: event.identificador,
    });

    console.log("event after select: ", this.state);
  }

  setTitle(e) {
    this.setState({ title: e });
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

  resetRecurrencia() {
    this.setState({ recurrencia: 1 });
  }

  // Onclick callback function that pushes new appointment into events array.
  async setNewHorario() {
    const { start, end, title, desc } = this.state;
    const id_usuario = this.context.id_usuario;

    let cadena = "";
    const caracteresPermitidos = "0123456789";

    for (let i = 0; i < 8; i++) {
      const indice = Math.floor(Math.random() * caracteresPermitidos.length);
      cadena += caracteresPermitidos.charAt(indice);
    }

    try {
      let startDate = new Date(start);
      let endDate = new Date(end);

      for (let i = 0; i < this.state.recurrencia; i++) {
        if (i > 0) {
          startDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          endDate = new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
        const data = {
          id_usuario: id_usuario,
          id_materia: this.state.materiaSeleccionada.id_materia,
          identificador: parseInt(cadena),
          title: title,
          description: desc,
          start: startDate,
          end: endDate,
        };
        console.log(
          "🚀 ~ file: CalendarAlt.js:229 ~ CalendarAlt ~ setNewHorario ~ data:",
          data
        );

        const response = await registrarHorario(data).catch((err) => {
          console.error(err);
        });
        console.log(
          "🚀 ~ file: CalendarAlt.js:166 ~ CalendarAlt ~ response ~ response:",
          response
        );

        this.getHorariosUsuarioMateria();
      }

      // const response = await fetch(
      //   `${process.env.REACT_APP_SERVER_URL}/solicitudes/createsolicitud`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(data),
      //   }
      // );
      // if (response.status === 200) {
      //   console.log("Ok!");
      // }
    } catch (error) {
      console.error(error);
    }
    console.log(start);
    let appointment = { title, start, end, desc };
    let backgroundEvents = this.state.backgroundEvents.slice();
    backgroundEvents.push(appointment);
    // localStorage.setItem("cachedEvents", JSON.stringify(events));

    this.setState({ backgroundEvents: backgroundEvents });
  }

  //  Updates Existing Appointments Title and/or Description
  updateEvent() {
    const { title, desc, start, end, events, clickedEvent } = this.state;
    const index = events.findIndex((event) => event === clickedEvent);
    const updatedEvent = events.slice();
    updatedEvent[index].title = title;
    updatedEvent[index].desc = desc;
    updatedEvent[index].start = start;
    updatedEvent[index].end = end;
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvent));
    this.setState({
      events: updatedEvent,
    });
  }

  //  filters out specific event that is to be deleted and set that variable to state
  async deleteEvent() {
    let updatedEvents = this.state.events.filter(
      (event) => event["identificador"] !== this.state.identificador
    );

    console.log("indentificador seleccionado", this.state.identificador);
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });

    console.log("Evento a eliminar: ", this.state.events);

    console.log(
      "🚀 ~ file: CalendarAlt.js:334 ~ CalendarAlt ~ deleteEvent ~ this.state.events[0].identificador:",
      this.state.events[0]
    );
    const response = await deleteHorariosUsuarioMateria(
      this.state.identificador
    ).catch((err) => {
      console.error(err);
    });
    console.log(
      "🚀 ~ file: CalendarAlt.js:301 ~ CalendarAlt ~ response ~ response:",
      response
    );

    this.getHorariosUsuarioMateria();
  }

  render() {
    console.log("render()");

    const customSlotPropGetter = () => {
      /*
      const backgroundEvents = this.state.backgroundEvents;
      var d = date.getHours() + date.getMinutes() / 60.0;
      for (let i = 0; i < backgroundEvents.length; i++) {
        let t1 =
          backgroundEvents[i].start.getHours() +
          backgroundEvents[i].start.getMinutes() / 60.0;
        let t2 =
          backgroundEvents[i].end.getHours() +
          backgroundEvents[i].end.getMinutes() / 60.0;
        console.log(`${d} < ${t1} >= ${t2}`);
        if (
          date.getDay() == backgroundEvents[i].start.getDay() &&
          d >= t1 &&
          d < t2
        ) {
          console.log("bruh");
          return {
            style: {
              backgroundColor: "#C2F5DA",
            },
          };
        }
      }
      return;*/
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
          backgroundEvents={this.state.backgroundEvents}
          views={["month", "week", "day", "agenda"]}
          defaultView="week"
          style={{ height: "80vh" }}
          defaultDate={new Date()}
          selectable
          timeslots={2}
          localizer={localizer}
          culture="es"
          slotPropGetter={customSlotPropGetter}
          showAllEvents={true}
          /*min={new Date(0, 0, 0, 6, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}*/
          onSelectEvent={(event) => this.handleEventSelected(event)}
          onSelectSlot={(slotInfo) => this.handleSlotSelected(slotInfo)}
        />

        {/* Material-ui Modal for booking new appointment */}
        <Dialog open={this.state.openSlot} onClose={this.handleClose}>
          <DialogTitle>Registra un nuevo horario</DialogTitle>
          <DialogContent>
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

            <div className="w-full my-3">
              <label className="text-sm">Horario recurrente</label>
            </div>
            <div className="grid">
              <div className="col-3 card flex flex-column justify-content-center align-items-center my-4">
                <InputSwitch
                  checked={this.state.recurrente}
                  onChange={(e) => {
                    this.setState({ recurrente: e.value });

                    if (this.state.recurrente === true) this.resetRecurrencia();
                  }}
                />
              </div>
              <div className="col-9 flex flex-column justify-content-center">
                <label className="text-sm">Cantidad de semanas</label>
                <InputNumber
                  disabled={this.state.recurrente ? false : true}
                  className="w-full"
                  mode="decimal"
                  showButtons
                  min={1}
                  max={100}
                  value={this.state.recurrencia}
                  onChange={(e) => {
                    this.setState({ recurrencia: e.value });
                  }}
                />
              </div>
            </div>
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
                this.setNewHorario(), this.handleClose();
              }}
            >
              GUARDAR
            </Button>
          </DialogActions>
        </Dialog>

        {/* Material-ui Modal for booking existing appointment */}
        <Dialog open={this.state.openEvent} onClose={this.handleClose}>
          <DialogTitle>
            <p>Vista del horario establecido</p>
          </DialogTitle>
          <DialogContent>
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
            <DemoContainer
              components={["MobileTimePicker"]}
              sx={{ marginTop: 13 }}
            >
              <DemoItem label="Start Time">
                <MobileTimePicker
                  value={moment(this.state.start)}
                  minutesStep={5}
                  onChange={(date) => this.handleStartTime(date)}
                />
              </DemoItem>
              <DemoItem label="End Time">
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
              BORRAR
            </Button>
            {/* <Button
              label="Confirm Edit"
              secondary={"true"}
              onClick={() => {
                this.updateEvent(), this.handleClose();
              }}
            >
              CONFIRM EDIT
            </Button> */}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CalendarAlt;
