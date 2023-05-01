import axios from 'axios';

export const registrarHorario = async (data) => {
    return axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/horarios/creahorario`,
        data
    })
}

export const getHorariosUsuarioMateria = async (id_usuario, id_materia) => {
    return axios({
        method: "GET",
        url: `${process.env.REACT_APP_SERVER_URL}/horarios/getmateriasidusuarioidmateria/${id_usuario}/${id_materia}`,
    })
}