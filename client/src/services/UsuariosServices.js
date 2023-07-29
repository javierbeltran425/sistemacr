import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const getUsuarioById = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${serverUrl}/usuarios/getusuariobyid/${id_usuario}`,
  });
};

export const getInfoUsuario = async (data) => {
  return axios({
    method: "POST",
    url: `${serverUrl}/usuarios/usuarioinfo`,
    data,
  });
};

export const changePassword = async (data) => {
  return axios({
    method: "PUT",
    url: `${serverUrl}/usuarios/changepassword`,
    data,
  });
};

export const activateUser = async (id_usuario) => {
  return axios({
    method: "PUT",
    url: `${serverUrl}/usuarios/activateuser/${id_usuario}`,
  });
};
