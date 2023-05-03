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
