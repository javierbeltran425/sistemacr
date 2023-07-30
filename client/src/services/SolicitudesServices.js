import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const createSolicitud = async (data, authToken) => {
  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "POST",
    url: `${serverUrl}/solicitudes/createsolicitud`,
    data,
  });
};

export const getSolicitudesByIdSeccion = async (id_seccion, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${serverUrl}/solicitudes/getsolicitudesbyidseccion/${id_seccion}`,
  });
};

export const getSolicitudesUsuariosByIdSeccion = async (data, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "POST",
    url: `${serverUrl}/solicitudes/getsolicitudesusuariosbyidseccion`,
    data,
  });
};

export const deleteSolicitud = async (id_solicitud, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "PUT",
    url: `${serverUrl}/solicitudes/deletesolicitud/${id_solicitud}`,
  });
};

export const editSolicitud = async (data, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "PUT",
    url: `${serverUrl}/solicitudes/editsolicitud`,
    data,
  });
};

export const actualizaEstadoSolicitud = async (data, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "POST",
    url: `${serverUrl}/solicitudes/actualizaestado`,
    data,
  });
};

export const archivarSolicitud = async (id_solicitud, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "PUT",
    url: `${serverUrl}/solicitudes/archivarsolicitud/${id_solicitud}`,
  });
};

export const getReporte = async (authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${serverUrl}/solicitudes/getsolicitudesreporte`,
  });
};
