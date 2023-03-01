import React, { useEffect, useState } from 'react'

// prime components
import { Divider } from 'primereact/divider'
import QuestionsPanel from './QuestionsPanel'

// custom components


// services
import { getQuestions } from '../services/BlogService';

// json test
import questions from '../../src/utils/Questions.json'

const Blog = () => {
    const [questionsResponse, setQuestionsResponse] = useState(questions);
    console.log("🚀 ~ file: Blog.js:18 ~ Blog ~ questionsResponse", questionsResponse)

    // useEffect(() => {
    //     questionsService();
    // }, [])

    // function to get questions list from API
    const questionsService = async () => {
        try {
            const response = await getQuestions().catch(e => {
                
            })
            console.log("🚀 ~ file: Blog.js:19 ~ response ~ response", response)

            
        } catch (error) {
            throw console.error(error);
        }
    }

    const panelComponentent = (data) => {
        let _component = [];

        if (data && data.length > 0) {
            data.forEach((element, index) => {
                _component.push(<QuestionsPanel key={index} header={element.header} content={element.question} />)
            });
        }

        return _component;
    }

    return (
        <div className='p-1 px-2 border-round w-full' >
            <h4>Consultas generales de la materia</h4>
            <Divider />

            <div className='flex flex-column overflow-x-auto gap-2' style={{ height: "30em" }} >
                {
                    panelComponentent(questionsResponse)
                }
            </div>
        </div>
    )
}

export default Blog