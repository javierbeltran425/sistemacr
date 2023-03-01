import axios from 'axios';

export const getQuestions = async () => {
    return axios({
        method: "GET",
        url: `localhost:3000/json/Questions.json`,
    })
}