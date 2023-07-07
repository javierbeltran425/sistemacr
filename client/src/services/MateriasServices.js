import axios from "axios";

export const getMaterias = async () => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/materias/getallmaterias`,
  });
};

export const getMateriasByIdUsuario = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/materias/getmateriasbyidusuario/${id_usuario}`,
  });
};

export const getMateriaById = async (id_materia) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/materias/getMateriaById/${id_materia}`,
  });
};
