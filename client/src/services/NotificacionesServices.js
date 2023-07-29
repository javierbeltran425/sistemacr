import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const EnviaNotificacione = async (data, authToken) => {
  return axios({
    headers: {
      "Content-Type": "application/json ",
      Authorization: authToken,
    },
    method: "POST",
    url: `${serverUrl}/notificaciones/envia/`,
    data,
  });
};
