import React, { useState } from 'react';

//custom components
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import History from '../components/History';

//prime components
import { Dropdown } from 'primereact/dropdown';

const HomePage = () => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teachers, setTeachers] = useState([
        {
            name: 'Ronaldo Canizales'
        },
        {
            name: 'Mauricio Grande'
        }
    ])
    const tramites = ['Consulta', 'Revision']
    const [selectedTramite, setSelectedTramite] = useState('Consulta');

    return (
        <div>
            <Header />

            <div className='w-full px-6 py-3'>
                <div className='flex w-full flex-row justify-content-between'>
                    <div className='flex'>
                        <p>Seleccione el trámite que desea hacer: </p>
                        {
                            tramites.map((tramite) => {
                                return <div
                                    className={`${selectedTramite === tramite ? "bg-blue-100 " : "surface-ground "} mx-2 px-2 border-round shadow-1 hover:bg-blue-100 cursor-pointer`}
                                    onClick={() => { setSelectedTramite(tramite) }}
                                >
                                    <p>{tramite}</p>
                                </div>
                            })
                        }
                    </div>

                    <Dropdown value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.value)} options={teachers} optionLabel="name"
                        filter placeholder="Seleccione un catedrático" className="w-full md:w-16rem" />
                </div>

                <div className='w-full mt-4'>
                    <History />
                </div>

                <div className='mt-4'>
                    <Calendar />
                </div>

            </div>
        </div>
    )
}

export default HomePage