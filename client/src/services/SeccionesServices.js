import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const getSeccionesByIdUsuario = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${serverUrl}/secciones/getseccionesbyidusuario/${id_usuario}`,
  });
};

export const getSeccionById = async (id_seccion) => {
  return axios({
    method: "GET",
    url: `${serverUrl}/secciones/getseccionbyId/${id_seccion}`,
  });
};
