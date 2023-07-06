import React, { useEffect, useState } from "react";

// componentes
import DataHistoryTable from "../components/DataHistoryTable";
import Layout from "../components/layout/Layout";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";

// servicios
import { getReporte } from "../services/SolicitudesServices";
import { getInfoUsuario } from "../services/UsuariosServices";

const HistoryView = () => {
  const [historyData, setHistoryData] = useState([]);
  console.log(
    "🚀 ~ file: HistoryView.js:15 ~ HistoryView ~ historyData:",
    historyData
  );

  const [contAusentes, setContAusentes] = useState(0);
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
        (solicitud) => solicitud.estado === "ATENDIDO"
      );
      let pendientes = historyData.filter(
        (solicitud) => solicitud.estado === "PENDIENTE"
      );
      let ausentes = historyData.filter(
        (solicitud) => solicitud.estado === "AUSENTE"
      );
      let rechazadas = historyData.filter(
        (solicitud) => solicitud.estado === "RECHAZADO"
      );

      setContAtendidas(atendidas.length);
      setContPendientes(pendientes.length);
      setContAusentes(ausentes.length);
      setcontRechazadas(rechazadas.length);
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

        const bodyProfesor = {
          id_usuario: history[i].id_profesor,
        };
        const response3 = await getInfoUsuario(bodyProfesor);
        console.log(
          "🚀 ~ file: HistoryView.js:36 ~ obtieneDatosReporte ~ response3:",
          response3
        );

        if (response3.status === 200) {
          history[i].nombreProfesor = response3.data[0].nombre;
          history[i].correoProfesor = response3.data[0].email;
        }

        console.log("log de history: ", history);
      }

      setHistoryData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="px-6">
        <h1>Reportes de datos</h1>

        <div className="flex flex-row w-full justify-content-between">
          <div className="bg-green-500 p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold text-lg pb-2">
              SOLICITUDES ATENDIDAS
            </p>
            <p className="m-0 text-center text-white font-bold text-6xl">
              {contAtendidas}
            </p>
          </div>
          <div className="bg-yellow-500 p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold text-lg pb-2">
              SOLICITUDES PENDIENTES
            </p>
            <p className="m-0 text-center text-white font-bold text-6xl">
              {contPendientes}
            </p>
          </div>
          <div className="bg-orange-500 p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold text-lg pb-2">
              SOLICITUDES AUSENTES
            </p>
            <p className="m-0 text-center text-white font-bold text-6xl">
              {contAusentes}
            </p>
          </div>
          <div className="bg-red-500 p-4 border-round-xl shadow-3">
            <p className="m-0 text-white font-bold text-lg pb-2">
              SOLICITUDES RECHAZADASS
            </p>
            <p className="m-0 text-center text-white font-bold text-6xl">
              {contRechazadas}
            </p>
          </div>
        </div>

        <div className="my-6">
          <DataHistoryTable historyData={historyData} />
        </div>
      </div>
    </Layout>
  );
};

export default HistoryView;
