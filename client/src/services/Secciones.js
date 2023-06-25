import axios from "axios";

export const getSeccionesByIdUsuario = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/secciones/getseccionesbyidusuario/${id_usuario}`,
  });
};
