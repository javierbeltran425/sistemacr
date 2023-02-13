import React from 'react'

//prime components
import { Divider } from 'primereact/divider';

const History = () => {
  return (
    <div className='flex w-full surface-ground justify-content-around border-round shadow-1'>
        <div className='w-full'>
            <p className='font-bold text-center'>Solicitudes</p>

            <div>
                <ul>
                    <li>Cálculo 1: febrero 13, 2023 / 1:00pm - 1:30pm</li>
                </ul>
            </div>
        </div>

        <Divider layout="vertical" />

        <div className='w-full'>
            <p className='font-bold text-center'>Agendadas</p>

            <div>
                <ul>
                    <li>Física 1: febrero 13, 2023 / 10:00am - 10:30am</li>
                    <li>Fundamentos de programación 1: febrero 13, 2023 / 11:00am - 11:30am</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default History