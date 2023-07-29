import axios from "axios";

export const EnviaNotificacione = async (data, authToken) => {

    return axios({
        headers: {
            'Content-Type': 'application/json ',
            'Authorization': authToken
        },
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/notificaciones/envia/`,
        data
    });
};