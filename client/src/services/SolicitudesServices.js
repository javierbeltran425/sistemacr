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
