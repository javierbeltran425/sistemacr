import axios from 'axios';

export const registrarHorario = async (data) => {
    return axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/horarios/creahorario`,
        data
    })
}