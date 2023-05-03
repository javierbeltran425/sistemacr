import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import backgroundEvents from "../data/backgroundEvents";
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
import { datetime, RRule, RRuleSet, rrulestr } from "rrule";

// servicios
import {
  deleteHorariosUsuarioMateria,
  registrarHorario,
} from "../services/HorariosServices";
import { getMateriasByIdUsuario } from "../services/MateriasServices";
import { getHorariosUsuarioMateria } from "../services/HorariosServices";

moment.tz.setDefault("America/El _Salvador");
const localizer = momentLocalizer(moment);

class CalendarAlt extends React.Component {
  static contextType = ContextUsuario;

  constructor() {
    super();
    this.state = {
      events: [],
      backgroundEvents: [],
      title: "",
      start: "",
      end: "",
      desc: "",
      materias: [],
      materiaSeleccionada: null,
      openSlot: false,
      openEvent: false,
      clickedEvent: {},
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.getSolicitudesByIdUsuario();
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
    try {
      console.log("Materia seleccionada: ", this.state.materiaSeleccionada);
      const response = await getHorariosUsuarioMateria(
        this.context.id_usuario,
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

  getSolicitudesByIdUsuario = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesbyidusuario/${this.context.id_usuario}`
      );
      const json = await response.json();

      json.forEach((element) => {
        element.start = new Date(element.start);
        element.end = new Date(element.end);
      });

      this.setState({ events: json });
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
    });
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

  // Onclick callback function that pushes new appointment into events array.
  async setNewAppointment() {
    const { start, end, title, desc } = this.state;
    const id_usuario = this.context.id_usuario;

    const data = {
      id_usuario: id_usuario,
      title: title,
      description: desc,
      type: "",
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
      }
    } catch (error) {
      console.error(error);
    }
    console.log(start);
    let appointment = { title, start, end, desc };
    let events = this.state.events.slice();
    events.push(appointment);
    // localStorage.setItem("cachedEvents", JSON.stringify(events));
    this.setState({ events });
  }

  async setNewHorario() {
    const { start, end, title, desc } = this.state;
    const id_usuario = this.context.id_usuario;

    const data = {
      id_usuario: id_usuario,
      id_materia: this.state.materiaSeleccionada.id_materia,
      title: title,
      description: desc,
      start: start,
      end: end,
    };

    try {
      const response = await registrarHorario(data).catch((err) => {
        console.error(err);
      });
      console.log(
        "🚀 ~ file: CalendarAlt.js:166 ~ CalendarAlt ~ response ~ response:",
        response
      );

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

  // obtener la ruta actual
  getRoute() {
    const route = window.location.hash;
    console.log(
      "🚀 ~ file: CalendarAlt.js:112 ~ CalendarAlt ~ getRoute ~ route:",
      route
    );

    switch (route) {
      case "":
        this.setNewAppointment();
        break;

      case "#/":
        this.setNewAppointment();
        break;

      case "#/teacher":
        this.setNewHorario();
        break;

      default:
        break;
    }
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
      (event) => event["start"] !== this.state.start
    );
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });

    console.log("Evento a eliminar: ", this.state.events);

    const response = await deleteHorariosUsuarioMateria(
      this.state.events[0].id
    ).catch((err) => {
      console.error(err);
    });
    console.log(
      "🚀 ~ file: CalendarAlt.js:301 ~ CalendarAlt ~ response ~ response:",
      response
    );
  }

  render() {
    console.log("render()");

    const customSlotPropGetter = (date) => {
      /*if (date.getDay() === 3 && date.getHours() < 10 && date.getHours() > 4)
        return {
          style: {
            backgroundColor: "#C2F5DA",
          },
        };*/
      /*let thursday = [];
      thursday = this.state.events.filter((item) => {
        return item.start.getDay() == 4;
      });
      if (
        thursday.length > 0 &&
        parseInt(date.getTime()) < parseInt(thursday[0].end.getTime()) &&
        parseInt(date.getTime()) >= parseInt(thursday[0].start.getTime())
      ) {
        if (date.getDay() === 4)
          return {
            style: {
              backgroundColor: "#C2F5DA",
            },
          };
      }*/
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
      return;
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
          events={this.state.events}
          backgroundEvents={this.state.backgroundEvents}
          views={["month", "week", "day", "agenda"]}
          defaultView="week"
          style={{ height: "80vh" }}
          defaultDate={new Date()}
          selectable
          timeslots={2}
          localizer={localizer}
          slotPropGetter={customSlotPropGetter}
          /*min={new Date(0, 0, 0, 6, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}*/
          onSelectEvent={(event) => this.handleEventSelected(event)}
          onSelectSlot={(slotInfo) => this.handleSlotSelected(slotInfo)}
        />

        {/* Material-ui Modal for booking new appointment */}
        <Dialog open={this.state.openSlot} onClose={this.handleClose}>
          <DialogTitle>
            {`Book an appointment on ${moment(this.state.start).format(
              "MMMM Do YYYY"
            )}`}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              margin="dense"
              fullWidth
              onChange={(e) => {
                this.setTitle(e.target.value);
              }}
            />
            <br />
            <TextField
              label="Description"
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
            <Button
              label="Cancel"
              secondary={"true"}
              onClick={this.handleClose}
            >
              CANCEL
            </Button>
            <Button
              label="Submit"
              primary={"true"}
              onClick={() => {
                this.getRoute(), this.handleClose();
              }}
            >
              SUBMIT
            </Button>
          </DialogActions>
        </Dialog>

        {/* Material-ui Modal for booking existing appointment */}
        <Dialog open={this.state.openEvent} onClose={this.handleClose}>
          <DialogTitle>
            {`View/Edit Appointment of ${moment(this.state.start).format(
              "MMMM Do YYYY"
            )}`}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              margin="dense"
              value={this.state.title}
              fullWidth
              onChange={(e) => {
                this.setTitle(e.target.value);
              }}
            />
            <br />
            <TextField
              label="Description"
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
              CANCEL
            </Button>
            <Button
              label="Delete"
              secondary={"true"}
              onClick={() => {
                this.deleteEvent(), this.handleClose();
              }}
            >
              DELETE
            </Button>
            <Button
              label="Confirm Edit"
              secondary={"true"}
              onClick={() => {
                this.updateEvent(), this.handleClose();
              }}
            >
              CONFIRM EDIT
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CalendarAlt;
