import React from 'react';

// custom components imports
import Layout from '../components/layout/Layout';
import Blog from '../components/Blog';
import Calendar from '../components/Calendar';

// prime components
import { Divider } from 'primereact/divider';

const TeacherView = () => {
    return (
        <Layout>
            <div className='grid m-0 px-6'>
                <div className='col-7 overflow-hidden' style={{ height: "37em" }} >
                    <Blog />
                </div>

                <div className='col-1' >
                    <Divider layout='vertical' />
                </div>

                <div className='col-4'>
                    <h4>Consultas programadas</h4>
                    <Divider />
                    <Calendar />
                </div>
            </div>
        </Layout>
    )
}

export default TeacherView