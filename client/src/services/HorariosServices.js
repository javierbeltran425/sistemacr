import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const registrarHorario = async (data) => {
  return axios({
    method: "POST",
    url: `${serverUrl}/horarios/creahorario`,
    data,
  });
};

export const getHorariosByIdSeccion = async (id_seccion) => {
  return axios({
    method: "GET",
    url: `${serverUrl}/horarios/gethorariosbyidseccion/${id_seccion}`,
  });
};

export const getHorariosByIdUsuario = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${serverUrl}/horarios/gethorariosbyidusuario/${id_usuario}`,
  });
};

export const deleteHorariosUsuarioMateria = async (id_evento) => {
  return axios({
    method: "PUT",
    url: `${serverUrl}/horarios/deletemateriasidusuarioidmateria/${id_evento}`,
  });
};
