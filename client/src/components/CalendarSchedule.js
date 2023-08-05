import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { InputTextarea } from "primereact/inputtextarea";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import { Toast } from "primereact/toast";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "../styles/Calendar.css";
import "../constants/usuario";
import moment from "moment";
import React from "react";
import "moment/locale/es";
import "moment-timezone";
import PropTypes from "prop-types";
import { AuthHookHoc } from "./auth/AuthHookHoc";

// servicios
import {
  deleteHorariosUsuarioMateria,
  registrarHorario,
} from "../services/HorariosServices";
import { getSeccionesByIdUsuario } from "../services/SeccionesServices";
import { getHorariosByIdUsuario } from "../services/HorariosServices";

moment.locale("es");
moment.tz.setDefault("America/El _Salvador");
const localizer = momentLocalizer(moment);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
        this.props.auth.id_usuario,
        this.props.auth.accessToken
      );
      if (response.status === 200) {
        this.setState({ secciones: response.data });
        if (response.data)
          this.setState({
            seccionSeleccionada: response.data[0],
          });
      }
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  getHorariosUsuario = async () => {
    try {
      const response = await getHorariosByIdUsuario(
        this.props.auth.id_usuario,
        this.props.auth.accessToken
      );

      if (response.status === 200) {
        const json = response.data;

        json.forEach((element) => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
        });

        this.setState({ events: json });
      }
    } catch (error) {
      this.showError(error.response.data.message);
    }
  };

  //closes modals
  handleClose() {
    this.setState({ openEvent: false, openSlot: false });
  }

  //  Allows user to click on calendar slot and handles if appointment exists
  handleSlotSelected(slotInfo) {
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
    this.setState({
      openEvent: true,
      clickedEvent: event,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
      identificador: event.identificador,
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

  resetRecurrencia() {
    this.setState({ recurrencia: 1 });
  }

  // Onclick callback function that pushes new appointment into events array.
  async setNewHorario() {
    const { start, end, title, desc } = this.state;
    const id_usuario = this.props.auth.id_usuario;

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

        const response = await registrarHorario(
          data,
          this.props.auth.accessToken
        );

        if (response.status === 200) {
          this.showSuccess("El evento ha sido registrado con éxito");
        } else {
          this.showError("Ha ocurrido un problema al registrar el evento");
        }
      }
    } catch (error) {
      this.showError(error.response.data.message);
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
      this.state.identificador,
      this.props.auth.accessToken
    ).catch((error) => {
      this.showError(error.response.data.message);
    });

    if (response.status == 200) {
      this.getHorariosUsuario();
      this.showSuccess("El evento ha sido eliminado con éxito");
    } else {
      this.showError("Ha ocurrido un problema al eliminar el evento");
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
    const customEventPropGetter = (event) => {
      if (this.state.seccionSeleccionada?.id_seccion !== event?.id_seccion) {
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
        <Toast ref={(el) => (this.toast = el)} />
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
          min={new Date(0, 0, 0, 6, 0, 0)}
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
            <InputTextarea
              placeholder="Descripción"
              onChange={(e) => {
                this.setDescription(e.target.value);
              }}
              keyfilter={/^[a-zA-Z0-9 ]*$/}
              rows={5}
              cols={30}
              className="w-full"
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
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Stack direction={"row"}>
              <Button
                variant="outlined"
                label="Cancel"
                secondary={"true"}
                onClick={this.handleClose}
                sx={{ marginLeft: 2 }}
              >
                SALIR
              </Button>
            </Stack>
            <Stack direction={"row"}>
              <Button
                color="success"
                variant="outlined"
                label="Submit"
                primary={"true"}
                onClick={() => {
                  this.setNewHorario(), this.handleClose();
                }}
                sx={{ marginRight: 2 }}
              >
                GUARDAR
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>

        {/* Material-ui Modal for booking existing appointment */}
        <Dialog open={this.state.openEvent} onClose={this.handleClose}>
          <DialogTitle whiteSpace={"pre-line"}>
            <p>{`Vista del horario establecido para
            ${this.state.title}`}</p>
          </DialogTitle>
          <DialogContent>
            <br />
            <InputTextarea
              className="w-full"
              placeholder="Descripción"
              value={this.state.desc}
              onChange={(e) => {
                this.setDescription(e.target.value);
              }}
              rows={5}
              cols={30}
              keyfilter={/^[a-zA-Z0-9 ]*$/}
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
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Stack direction="row">
              <Button
                variant="outlined"
                label="Cancel"
                primary={"false"}
                onClick={this.handleClose}
                sx={{ marginLeft: 2 }}
              >
                SALIR
              </Button>
            </Stack>
            <Stack direction="row">
              <Button
                sx={{ marginRight: 2 }}
                color="error"
                variant="outlined"
                label="Delete"
                secondary={"true"}
                onClick={() => {
                  this.deleteEvent(), this.handleClose();
                }}
              >
                BORRAR
              </Button>
            </Stack>
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
