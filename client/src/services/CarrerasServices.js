import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const getCarreras = async (authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "GET",
    url: `${serverUrl}/carreras/getallcarreras`,
  });
};

export const createCarrera = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "POST",
    url: `${serverUrl}/carreras/createcarrera`,
    data,
  });
};

export const editCarrera = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "PUT",
    url: `${serverUrl}/carreras/editcarrera`,
    data,
  });
};

export const removeCarreraID = async (id_carrera, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "DELETE",
    url: `${serverUrl}/carreras/removecarrerabyid/${id_carrera}`,
  });
};

export const getCarrerasByIdMateria = async (id_materia, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "GET",
    url: `${serverUrl}/carreras/getcarrerasbyidmateria/${id_materia}`,
  });
};
