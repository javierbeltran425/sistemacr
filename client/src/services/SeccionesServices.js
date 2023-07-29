import axios from "axios";

export const getSeccionesByIdUsuario = async (id_usuario, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/secciones/getseccionesbyidusuario/${id_usuario}`,
  });
};

export const getSeccionById = async (id_seccion, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/secciones/getseccionbyId/${id_seccion}`,
  });
};
