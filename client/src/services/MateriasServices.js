import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const getMaterias = async () => {
  return axios({
    method: "GET",
    url: `${serverUrl}/materias/getallmaterias`,
  });
};

export const getMateriasByIdUsuario = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${serverUrl}/materias/getmateriasbyidusuario/${id_usuario}`,
  });
};

export const getMateriaById = async (id_materia) => {
  return axios({
    method: "GET",
    url: `${serverUrl}/materias/getMateriaById/${id_materia}`,
  });
};
