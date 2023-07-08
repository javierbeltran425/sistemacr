import axios from "axios";

export const getUsuarioById = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/usuarios/getusuariobyid/${id_usuario}`,
  });
};

export const getInfoUsuario = async (data) => {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_SERVER_URL}/usuarios/usuarioinfo`,
    data,
  });
};
