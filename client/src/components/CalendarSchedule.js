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
import { ContextUsuario } from "../context/usuario";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import "../constants/usuario";
import "../styles/Calendar.css";
import "moment/locale/es";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// servicios
import {
  deleteHorariosUsuarioMateria,
  registrarHorario,
} from "../services/HorariosServices";
import { getSeccionesByIdUsuario } from "../services/Secciones";
import { getHorariosByIdUsuario } from "../services/HorariosServices";

moment.locale("es");
moment.tz.setDefault("America/El _Salvador");
const localizer = momentLocalizer(moment);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
      title: "",
      start: "",
      end: "",
      desc: "",
      identificador: null,
      secciones: [],
      seccionSeleccionada: null,
      openSlot: false,
      openEvent: false,
      clickedEvent: {},
      recurrencia: 1,
      recurrente: false,
      showErrorAlert: false,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.getSeccionesByIdUsuario();
    this.getHorariosUsuario();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.seccionSeleccionada !== this.state.seccionSeleccionada) {
      null;
    }
  }

  // función para recuperar las materias
  getSeccionesByIdUsuario = async () => {
    try {
      const response = await getSeccionesByIdUsuario(
        this.context.id_usuario
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

  getHorariosUsuario = async () => {
    try {
      console.log("Materia seleccionada: ", this.state.seccionSeleccionada);
      const response = await getHorariosByIdUsuario(
        this.context.id_usuario
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
      title:
        this.state.seccionSeleccionada.nombre +
        " (Sección " +
        this.state.seccionSeleccionada.numero +
        ")",
      desc: "",
      start: slotInfo.start,
      end: slotInfo.end,
      openSlot: true,
    });
  }

  handleEventSelected(event) {
    console.log("event ", event);
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
          id_materia: this.state.seccionSeleccionada.id_materia,
          id_seccion: this.state.seccionSeleccionada.id_seccion,
          identificador: parseInt(cadena),
          title: title,
          description: desc,
          start: startDate,
          end: endDate,
        };

        const response = await registrarHorario(data).catch((err) => {
          console.error(err);
        });
        console.log(
          "🚀 ~ file: CalendarAlt.js:166 ~ CalendarAlt ~ response ~ response:",
          response
        );
      }
    } catch (error) {
      console.error(error);
    }
    this.getHorariosUsuario();
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
    const response = await deleteHorariosUsuarioMateria(
      this.state.identificador
    ).catch((err) => {
      console.error(err);
    });
    console.log(
      "🚀 ~ file: CalendarAlt.js:301 ~ CalendarAlt ~ response ~ response:",
      response
    );
    if (response.status == 200) {
      this.getHorariosUsuario();
    }
  }

  infoHorario() {
    let horarios = this.state.events.filter(
      (item) => item.identificador == this.state.identificador
    );
    let max = moment(
      Math.max(
        ...horarios.map((item) => {
          return item.start;
        })
      )
    );
    if (horarios.length > 1) {
      return `Todo ${moment(this.state.start).format(
        "dddd"
      )} hasta el ${max.format("LL")}`;
    } else {
      return "Este horario no se repite";
    }
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

    const customEventPropGetter = (event) => {
      if (this.state.seccionSeleccionada?.id_materia !== event?.id_materia) {
        return {
          style: { backgroundColor: "#adb5bd", borderColor: "#adb5bd" },
        };
      } else {
        return {
          style: { backgroundColor: "#95d5b2", borderColor: "#52b788" },
        };
      }
    };

    const handleCloseErrorAlert = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }

      this.setState({ showErrorAlert: false });
    };

    return (
      <div id="Calendar">
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={this.state.showErrorAlert}
            autoHideDuration={3000}
            onClose={handleCloseErrorAlert}
          >
            <Alert
              onClose={handleCloseErrorAlert}
              severity="error"
              sx={{ width: "100%" }}
            >
              Ya existe un horario en la franja seleccionada
            </Alert>
          </Snackbar>
        </Stack>

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
                    <Typography sx={{ textTransform: "none" }}>
                      Sección {seccion.numero}
                    </Typography>
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
          backgroundEvents={this.state.backgroundEvents}
          views={["month", "week", "day", "agenda"]}
          defaultView="week"
          style={{ height: "80vh" }}
          defaultDate={new Date()}
          selectable
          timeslots={2}
          localizer={localizer}
          culture="es"
          eventPropGetter={customEventPropGetter}
          showAllEvents={false}
          /*min={new Date(0, 0, 0, 6, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}*/
          onSelectEvent={(event) => this.handleEventSelected(event)}
          onSelectSlot={(slotInfo) => this.handleSlotSelected(slotInfo)}
        />

        {/* Material-ui Modal for booking new appointment */}
        <Dialog open={this.state.openSlot} onClose={this.handleClose}>
          <DialogTitle style={{ whiteSpace: "pre-line" }}>
            {`Registra un nuevo horario para
            ${this.state.title}`}
          </DialogTitle>
          <DialogContent>
            {/*<TextField
              label="Título"
              margin="dense"
              fullWidth
              onChange={(e) => {
                this.setTitle(e.target.value);
              }}
            />
            <br />*/}
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
          <DialogTitle whiteSpace={"pre-line"}>
            <p>{`Vista del horario establecido para
            ${this.state.title}`}</p>
          </DialogTitle>
          <DialogContent>
            {/*<TextField
              label="Título"
              margin="dense"
              value={this.state.title}
              fullWidth
              onChange={(e) => {
                this.setTitle(e.target.value);
              }}
            />*/}
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
            <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
              {this.infoHorario()}
            </Typography>
            <DemoContainer
              components={["MobileTimePicker"]}
              sx={{ marginTop: 4 }}
            >
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
