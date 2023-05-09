import axios from "axios";

export const getSolicitudesByIdUsuarioIdMateria = async (
  id_usuario,
  id_materia
) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/getsolicitudesbyidusuarioidmateria/${id_usuario}/${id_materia}`,
  });
};

export const deleteSolicitud = async (id_solicitud) => {
  return axios({
    method: "PUT",
    url: `${process.env.REACT_APP_SERVER_URL}/solicitudes/deletesolicitud/${id_solicitud}`,
  });
};
