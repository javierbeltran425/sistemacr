import React, { useEffect, useState } from "react";

// componentes
import DataHistoryTable from "../components/DataHistoryTable";
import Layout from "../components/layout/Layout";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import { Divider } from "primereact/divider";

// servicios
import { getReporte } from "../services/SolicitudesServices";
import { getInfoUsuario } from "../services/UsuariosServices";
import { getMateriaById } from "../services/MateriasServices";
import { getSeccionById } from "../services/SeccionesServices";

const HistoryView = () => {
  const [historyData, setHistoryData] = useState([]);
  console.log(
    "🚀 ~ file: HistoryView.js:15 ~ HistoryView ~ historyData:",
    historyData
  );

  const [contAusentes, setContAusentes] = useState(0);
  const [contAceptadas, setContAceptadas] = useState(0);
  const [contAtendidas, setContAtendidas] = useState(0);
  const [contPendientes, setContPendientes] = useState(0);
  const [contRechazadas, setcontRechazadas] = useState(0);

  useEffect(() => {
    obtieneDatosReporte();
  }, []);

  useEffect(() => {
    conteoSolicitudes();
  }, [historyData]);

  const conteoSolicitudes = () => {
    if (historyData.length > 0) {
      let atendidas = historyData.filter(
        (solicitud) => solicitud.estado.toUpperCase() === "ATENDIDO"
      );
      let pendientes = historyData.filter(
        (solicitud) => solicitud.estado.toUpperCase() === "PENDIENTE"
      );
      let ausentes = historyData.filter(
        (solicitud) => solicitud.estado.toUpperCase() === "AUSENTE"
      );
      let rechazadas = historyData.filter(
        (solicitud) => solicitud.estado.toUpperCase() === "RECHAZADO"
      );
      let aceptadas = historyData.filter(
        (solicitud) => solicitud.estado.toUpperCase() === "ACEPTADO"
      );

      setContAtendidas(atendidas.length);
      setContPendientes(pendientes.length);
      setContAusentes(ausentes.length);
      setcontRechazadas(rechazadas.length);
      setContAceptadas(aceptadas.length);
    }
  };

  const obtieneDatosReporte = async () => {
    try {
      const response = await getReporte().catch((err) => {
        console.log(err);
      });
      console.log(
        "🚀 ~ file: History.js:20 ~ response ~ obtieneDatosReporte:",
        response
      );

      let history = response.data;
      let usersInfoData = [];

      for (let i = 0; i < history.length; i++) {
        const bodyUsuario = {
          id_usuario: history[i].id_usuario,
        };
        const response2 = await getInfoUsuario(bodyUsuario);
        console.log(
          "🚀 ~ file: HistoryView.js:36 ~ obtieneDatosReporte ~ response2:",
          response2
        );

        if (response2.status === 200) {
          history[i].nombreAlumno = response2.data[0].nombre;
          history[i].correoAlumno = response2.data[0].email;
        }

        const response3 = await getMateriaById(history[i].id_materia);
        console.log("🚀 ~ file: HistoryView.js:89 ~ obtieneDatosReporte ~ response3:", response3)

        if (response3.status === 200) {
          history[i].nombreMateria = response3.data[0].nombre;
        }

        const response4 = await getSeccionById(history[i].id_seccion);
        console.log("🚀 ~ file: HistoryView.js:93 ~ obtieneDatosReporte ~ response4:", response4)

        if (response.status === 200) {
          history[i].seccion = response4.data[0].numero
        }

        console.log("log de history: ", history);
      }

      setHistoryData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="px-1 md:px-6">
        <p className="text-xl font-bold md:text-3sxl">Reportes de solicitudes</p>

        <Divider />

        <div className="grid w-full flex justify-content-center md:justify-content-between gap-1">
          <div className="col-5 md:col-2 bg-green-500 text-center md:p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold md:text-lg pb-2">
              SOLICITUDES ACEPTADAS
            </p>
            <p className="m-0 text-center text-white font-bold text-2xl md:text-6xl">
              {contAceptadas}
            </p>
          </div>
          <div className="col-5 md:col-2 bg-green-800 text-center md:p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold md:text-lg pb-2">
              SOLICITUDES ATENDIDAS
            </p>
            <p className="m-0 text-center text-white font-bold text-2xl md:text-6xl">
              {contAtendidas}
            </p>
          </div>
          <div className="col-5 md:col-2 bg-blue-500 text-center md:p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold md:text-lg pb-2">
              SOLICITUDES PENDIENTES
            </p>
            <p className="m-0 text-center text-white font-bold text-2xl md:text-6xl">
              {contPendientes}
            </p>
          </div>
          <div className="col-5 md:col-2 bg-orange-500 text-center md:p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold md:text-lg pb-2">
              SOLICITUDES AUSENTES
            </p>
            <p className="m-0 text-center text-white font-bold text-2xl md:text-6xl">
              {contAusentes}
            </p>
          </div>
          <div className="col-5 md:col-2 bg-red-500 text-center p-1 md:p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold md:text-lg pb-2">
              SOLICITUDES RECHAZADAS
            </p>
            <p className="m-0 text-center text-white font-bold text-2xl md:text-6xl">
              {contRechazadas}
            </p>
          </div>
        </div>

        <div className="my-6">
          <DataHistoryTable historyData={historyData} />
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
