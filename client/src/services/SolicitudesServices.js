import axios from "axios";

export const getSolicitudesByIdSeccion = async (id_seccion, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesbyidseccion/${id_seccion}`,
  });
};

export const getSolicitudesUsuariosByIdSeccion = async (data, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "POST",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesusuariosbyidseccion`,
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
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/deletesolicitud/${id_solicitud}`,
  });
};

export const editSolicitud = async (data, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "PUT",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/editsolicitud`,
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
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/actualizaestado`,
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
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/archivarsolicitud/${id_solicitud}`,
  });
};

export const getReporte = async (authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesreporte`,
  });
};
