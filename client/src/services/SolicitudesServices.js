import axios from "axios";

export const getSolicitudesByIdUsuarioIdSeccion = async (
  id_usuario,
  id_seccion
) => {
  return axios({
    method: "GET",

    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesbyidusuarioidseccion/${id_usuario}/${id_seccion}`,
  });
};

export const getSolicitudesUsuariosByIdSeccion = async (data) => {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesusuariosbyidseccion`,
    data,
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
