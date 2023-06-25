import axios from "axios";

export const getSolicitudesByIdUsuarioIdMateria = async (
  id_profesor,
  id_materia
) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesbyidusuarioidmateria/${id_profesor}/${id_materia}`,
  });
};

export const getSolicitudesUsuariosByIdUsuarioIdMateria = async (
  id_usuario,
  id_materia
) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesusuariosbyidusuarioidmateria/${id_usuario}/${id_materia}`,
  });
};

export const getSolicitudesUsuariosByIdUsuario = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesusuariosbyidusuario/${id_usuario}`,
  });
};

export const deleteSolicitud = async (id_solicitud) => {
  return axios({
    method: "PUT",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/deletesolicitud/${id_solicitud}`,
  });
};

export const editSolicitud = async (data) => {
  return axios({
    method: "PUT",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/editsolicitud`,
    data,
  });
};

export const actualizaEstadoSolicitud = async (data) => {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/actualizaestado`,
    data,
  });
};

export const getReporte = async () => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesreporte`,
  });
};
