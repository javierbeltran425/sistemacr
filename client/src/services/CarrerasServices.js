import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
    REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const getCarreras = async (authToken) => {

    return axios({
        headers: {
            'Content-Type': 'application/json ',
            'Authorization': authToken
        },
        method: "GET",
        url: `${serverUrl}/carreras/getallcarreras`,
    });
};