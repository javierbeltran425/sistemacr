import axios from "axios";

export const getMaterias = async (authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/materias/getallmaterias`,
  });
};

export const getMateriasByIdUsuario = async (id_usuario, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/materias/getmateriasbyidusuario/${id_usuario}`,
  });
};

export const getMateriaById = async (id_materia, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/materias/getMateriaById/${id_materia}`,
  });
};
