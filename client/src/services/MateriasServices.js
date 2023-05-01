import axios from 'axios';

export const getMaterias = async () => {
    return axios({
        method: "GET",
        url: `${process.env.REACT_APP_SERVER_URL}/materias/getallmaterias`
    })
}