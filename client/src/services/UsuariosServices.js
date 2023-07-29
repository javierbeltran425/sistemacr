import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const getUsuarios = async (authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "GET",
    url: `${serverUrl}/usuarios/getallusuarios`,
  });
};

export const getUsuarioById = async (id_usuario, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "GET",
    url: `${serverUrl}/usuarios/getusuariobyid/${id_usuario}`,
  });
};

export const getInfoUsuario = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "POST",
    url: `${serverUrl}/usuarios/usuarioinfo`,
    data,
  });
};

export const getRolByID = async (id_usuario, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "GET",
    url: `${serverUrl}/usuarios/getrolbyid/${id_usuario}`,
  });
};

export const createUsuario = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "POST",
    url: `${serverUrl}/usuarios/createusuario`,
    data,
  });
};

export const editUsuario = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "PUT",
    url: `${serverUrl}/usuarios/editusuario`,
    data,
  });
};

export const changePassword = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "PUT",
    url: `${serverUrl}/usuarios/changepassword`,
    data,
  });
};

export const activateUser = async (id_usuario, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "PUT",
    url: `${serverUrl}/usuarios/activateuser/${id_usuario}`,
  });
};

export const deleteUsuario = async (id_usuario, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "DELETE",
    url: `${serverUrl}/usuarios/removeusuariobyid/${id_usuario}`,
  });
};
