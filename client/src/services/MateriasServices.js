import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const getMaterias = async (authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "GET",
    url: `${serverUrl}/materias/getallmaterias`,
  });
};

export const getMateriasByIdUsuario = async (id_usuario, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "GET",
    url: `${serverUrl}/materias/getmateriasbyidusuario/${id_usuario}`,
  });
};

export const getMateriaById = async (id_materia, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "GET",
    url: `${serverUrl}/materias/getMateriaById/${id_materia}`,
  });
};

export const createMateria = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "POST",
    url: `${serverUrl}/materias/createmateria`,
    data,
  });
};

export const editMateria = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "PUT",
    url: `${serverUrl}/materias/editmateria`,
    data,
  });
};

export const removeMateria = async (id_materia, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "DELETE",
    url: `${serverUrl}/materias/removemateriabyid/${id_materia}`,
  });
};
