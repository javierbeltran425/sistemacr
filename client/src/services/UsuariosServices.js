import axios from "axios";

export const getUsuarioById = async (id_usuario, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/usuarios/getusuariobyid/${id_usuario}`,
  });
};

export const getInfoUsuario = async (data, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "POST",
    url: `${process.env.REACT_APP_SERVER_URL}/usuarios/usuarioinfo`,
    data,
  });
};

export const getRolByID = async (id_usuario, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/usuarios/getrolbyid/${id_usuario}`,
  });
};

export const changePassword = async (data, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "PUT",
    url: `${process.env.REACT_APP_SERVER_URL}/usuarios/changepassword`,
    data,
  });
};

export const activateUser = async (id_usuario, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "PUT",
    url: `${process.env.REACT_APP_SERVER_URL}/usuarios/activateuser/${id_usuario}`,
  });
};
