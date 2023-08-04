import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
    REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export const login = async (data) => {
    return axios({
        headers: {
            "Content-Type": "application/json ",
        },
        method: "POST",
        url: `${serverUrl}/auth/login`,
        data
    });
};

export const validateRecoveryToken = async (data) => {
    return axios({
        headers: {
            "Content-Type": "application/json ",
        },
        method: "POST",
        url: `${serverUrl}/auth/validateRecoveryToken`,
        data
    });
};

export const solicitaRecuperacion = async (data) => {
    return axios({
        headers: {
            "Content-Type": "application/json ",
        },
        method: "POST",
        url: `${serverUrl}/auth/recovery`,
        data
    });
};

export const cambiaContrasenia = async (data) => {
    return axios({
        headers: {
            "Content-Type": "application/json ",
        },
        method: "POST",
        url: `${serverUrl}/auth/changePassword`,
        data
    });
};