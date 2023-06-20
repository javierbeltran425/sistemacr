import axios from "axios";

export const getInfoUsuario = async (data) => {
    return axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/usuarios/usuarioinfo`,
      data
    });
  };