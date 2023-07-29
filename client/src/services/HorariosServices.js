import axios from "axios";

export const registrarHorario = async (data, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "POST",
    url: `${process.env.REACT_APP_SERVER_URL}/horarios/creahorario`,
    data,
  });
};

export const getHorariosByIdSeccion = async (id_seccion, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/horarios/gethorariosbyidseccion/${id_seccion}`,
  });
};

export const getHorariosByIdUsuario = async (id_usuario, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "GET",
    url: `${process.env.REACT_APP_SERVER_URL}/horarios/gethorariosbyidusuario/${id_usuario}`,
  });
};

export const deleteHorariosUsuarioMateria = async (id_evento, authToken) => {

  return axios({
    headers: {
      'Content-Type': 'application/json ',
      'Authorization': authToken
    },
    method: "PUT",
    url: `${process.env.REACT_APP_SERVER_URL}/horarios/deletemateriasidusuarioidmateria/${id_evento}`,
  });
};
