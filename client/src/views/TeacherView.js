import React, { useState, useEffect } from "react";

// custom components imports
import Layout from "../components/layout/Layout";
import CalendarSchedule from "../components/CalendarSchedule";

// prime components
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const TeacherView = () => {
  const dias = [
    { label: "Lunes", value: "LN" },
    { label: "Martes", value: "MAR" },
    { label: "Miercoles", value: "MIER" },
    { label: "Jueves", value: "JUE" },
    { label: "Viernes", value: "VIE" },
  ];

  // States para almacenamiento de datos
  const [nuevaFechaInicio, setNuevaFechaInicio] = useState(null);
  const [nuevaFechaFin, setNuevaFechaFin] = useState(null);
  const [fechas, setFechas] = useState([]);
  const [dia, setDia] = useState(null);

  // States para Dialog para administración de fechas
  const [visible, setVisible] = useState(false);

  useEffect(() => {}, []);

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

  return (
    <Layout>
      <div className="w-full lg:px-6 pt-5">
        <h4>Horarios programados por el catedrático</h4>

        <CalendarSchedule />
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
    </Layout>
  );
};

export default TeacherView;
