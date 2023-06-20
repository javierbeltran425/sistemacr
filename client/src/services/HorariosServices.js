import axios from "axios";

export const registrarHorario = async (data) => {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_SERVER_URL}/horarios/creahorario`,
    data,
  });
};

export const getHorariosByIdSeccion = async (id_seccion) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/horarios/gethorariosbyidseccion/${id_seccion}`,
  });
};

export const getHorariosByIdUsuario = async (id_usuario) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/horarios/gethorariosbyidusuario/${id_usuario}`,
  });
};

export const deleteHorariosUsuarioMateria = async (id_evento) => {
  return axios({
    method: "PUT",
    url: `${process.env.REACT_APP_SERVER_URL}/horarios/deletemateriasidusuarioidmateria/${id_evento}`,
  });
};
