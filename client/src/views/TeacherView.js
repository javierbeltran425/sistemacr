import React, { useState, useEffect } from "react";

// custom components imports
import CalendarOld from "../components/Calendar(old)";
import Layout from "../components/layout/Layout";
import CalendarTeacher from "../components/CalendarTeacher";

// prime components
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const TeacherView = () => {
  const [time, setTime] = useState(null);
  const [flag, setFlag] = useState(false);

  const dias = [
    { label: "Lunes", value: "LN" },
    { label: "Martes", value: "MAR" },
    { label: "Miercoles", value: "MIER" },
    { label: "Jueves", value: "JV" },
    { label: "Viernes", value: "VN" },
  ];
  const [materias, setMaterias] = useState([]);

  // States para almacenamiento de datos
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [nuevaFechaInicio, setNuevaFechaInicio] = useState(null);
  const [nuevaFechaFin, setNuevaFechaFin] = useState(null);
  const [fechas, setFechas] = useState([]);
  const [dia, setDia] = useState(null);

  // States para Dialog para administración de fechas
  const [visible, setVisible] = useState(false);
  const [visibleMinus, setVisibleMinus] = useState(false);

  // Función para activar la modal para registrar nuevos horarios
  const onChangeModalState = () => {
    setVisible((e) => !e);
  };

  // Función para activar la modal para eliminar horarios
  const onChangeModalMinusState = () => {
    setVisibleMinus((e) => !e);
  };

  // función para agregar horarios nuevos a la lista
  const agregarFechas = () => {
    let _axuFechas = fechas;

    let eventoModel = {
      id: Math.random(),
      dia: dia,
      inicio: nuevaFechaInicio,
      fin: nuevaFechaFin,
    };

    _axuFechas.push(eventoModel);

    setFechas(_axuFechas);

    setVisible(false);
  };

  // footer de la modal de definición de horarios
  const footer = (
    <div className="flex w-full justify-content-end">
      <Button label="Guardar" onClick={(e) => agregarFechas()} />
    </div>
  );

  // función para renderizar automaticamente las fechas
  const fechasRender = (dia) => {
    let _aux = fechas.filter((fecha) => fecha.dia === dia);

    for (let i = 0; i < _aux.length; i++) {}

    let _fechasElementList = [];

    for (let i = 0; i < _aux.length; i++) {
      _fechasElementList.push(
        <div
          key={Math.random() + i}
          className="flex w-full justify-content-between align-items-center"
        >
          <p className="p-0 m-0 py-1">{_aux[i].inicio.toString()}</p>
          <p className="p-0 m-0 py-1"> --- </p>
          <p className="p-0 m-0 py-1">{_aux[i].fin.toString()}</p>
          <Button
            icon="pi pi-trash"
            style={{ height: "1rem" }}
            onClick={() => deleteHorarios(_aux[i])}
          ></Button>
        </div>
      );
    }

    return _fechasElementList;
  };

  // función para eliminar horarios de la lista
  const deleteHorarios = (fecha) => {
    let _aux = fechas;

    let _filtro = _aux.filter((dato) => dato.id !== fecha.id);

    setFechas(_filtro);
  };

  return (
    <Layout>
      <div className="w-full lg:px-6 pt-5">
        <h4>Horarios fijos de consultas para todo el ciclo</h4>

        <CalendarTeacher />

        <div
          className="w-full px-6 pt-2 surface-100 border-round-md shadow-1"
          style={{ height: "27em" }}
        >
          <div className="flex justify-content-between align-items-center">
            <h4>Consultas generales</h4>

            <div className="flex gap-3">
              <Button
                icon="pi pi-save"
                rounded
                text
                raised
                severity="info"
                aria-label="Agregar"
                className="mr-2"
              />
              <Button
                icon="pi pi-minus"
                rounded
                text
                raised
                severity="warning"
                aria-label="Agregar"
                onClick={onChangeModalMinusState}
              />
              <Button
                icon="pi pi-plus"
                rounded
                text
                raised
                severity="success"
                aria-label="Agregar"
                onClick={onChangeModalState}
              />
            </div>
          </div>
          <Divider />

          <div className="grid gap-2 justify-content-between">
            <div className="flex flex-column col-2">
              <h5 className="surface-200 text-center">Lunes</h5>
              <div className="flex flex-column align-items-center gap-1">
                {fechasRender("LN")}
              </div>
            </div>

            <div className="flex flex-column col-2">
              <h5 className="surface-200 text-center">Martes</h5>
              <div className="flex flex-column align-items-center gap-1">
                {fechasRender("MAR")}
              </div>
            </div>

            <div className="flex flex-column col-2">
              <h5 className="surface-200 text-center">Miercoles</h5>
              <div className="flex flex-column align-items-center gap-1">
                {fechasRender("MIER")}
              </div>
            </div>

            <div className="flex flex-column col-2">
              <h5 className="surface-200 text-center">Jueves</h5>
              <div className="flex flex-column align-items-center gap-1">
                {fechasRender("JV")}
              </div>
            </div>

            <div className="flex flex-column col-2">
              <h5 className="surface-200 text-center">Viernes</h5>
              <div className="flex flex-column align-items-center gap-1">
                {fechasRender("VN")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-0 px-6 pb-4">
        <h4>Consultas programadas</h4>
        <Divider />
        <CalendarOld />
      </div>

      {/* Zona de modales */}

      {/* Modal para registro de nuevos horarios */}
      <Dialog
        header="Definición de horarios"
        footer={footer}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="flex flex-column gap-4">
          <p className="text-lg">Ingrese la hora en formato de 24 horas</p>
          <div className="flex flex-column">
            <label className="font-bold gap-1">Hora de inicio</label>
            <InputMask
              mask="99:99"
              value={nuevaFechaInicio}
              onChange={(e) => setNuevaFechaInicio(e.value)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label className="font-bold">Hora de finalización</label>
            <InputMask
              mask="99:99"
              value={nuevaFechaFin}
              onChange={(e) => setNuevaFechaFin(e.value)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label className="font-bold">Hora de finalización</label>
            <Dropdown
              value={dia}
              options={dias}
              optionLabel="label"
              onChange={(e) => setDia(e.value)}
            />
          </div>
        </div>
      </Dialog>

      {/* Modal para eliminación de horarios existentes */}
      <Dialog
        header="Eliminación de horarios"
        visible={visibleMinus}
        style={{ width: "50vw" }}
        onHide={() => setVisibleMinus(false)}
      >
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Dialog>
    </Layout>
  );
};

export default TeacherView;
