import axios from "axios";

export const EnviaNotificacione = async (data) => {
    return axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/notificaciones/envia/`,
        data
    });
};