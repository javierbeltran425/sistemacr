import React, { useState } from 'react';

// custom components imports
import CustomCalendar from '../components/Calendar';
import Layout from '../components/layout/Layout';
import Blog from '../components/Blog';

// prime components
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const TeacherView = () => {
    const [time, setTime] = useState(null);

    // States para Dialog para administración de fechas
    const [visible, setVisible] = useState(false);
    const [visibleMinus, setVisibleMinus] = useState(false);

    // Función para activar la modal para registrar nuevos horarios
    const onChangeModalState = () => {
        setVisible(e => !e)
    }

    // Función para activar la modal para eliminar horarios
    const onChangeModalMinusState = () => {
        setVisibleMinus(e => !e)
    }

    return (
        <Layout>
            <div className='w-full px-6 pt-5'>
                <div className='w-full px-6 pt-2 surface-100 border-round-md' style={{ height: "27em" }}>
                    <div className='flex justify-content-between align-items-center'>
                        <h4>Consultas generales</h4>

                        <div className='flex gap-3'>
                            <Button icon="pi pi-minus" rounded text raised severity="warning" aria-label="Agregar" onClick={onChangeModalMinusState} />
                            <Button icon="pi pi-plus" rounded text raised severity="success" aria-label="Agregar" onClick={onChangeModalState} />
                        </div>
                    </div>
                    <Divider />

                    <div className='grid gap-2 justify-content-between'>
                        <div className='flex flex-column col-2'>
                            <h5 className="surface-200 text-center">Lunes</h5>
                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" disabled />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-column col-2'>
                            <h5 className="surface-200 text-center">Martes</h5>
                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-column col-2'>
                            <h5 className="surface-200 text-center">Miercoles</h5>
                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-column col-2'>
                            <h5 className="surface-200 text-center">Jueves</h5>
                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-column col-2'>
                            <h5 className="surface-200 text-center">Viernes</h5>
                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>

                            <div className='flex align-items-center gap-2 my-1'>
                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Desde</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>

                                <div className='flex flex-column'>
                                    <label className='font-semibold'>Hasta</label>
                                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly selectionMode="range" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
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
                    <CustomCalendar />
                </div>
            </div>

            {/* Zona de modales */}

            {/* Modal para registro de nuevos horarios */}
            <Dialog header="Definición de horarios" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Dialog>
            
            {/* Modal para eliminación de horarios existentes */}
            <Dialog header="Eliminación de horarios" visible={visibleMinus} style={{ width: '50vw' }} onHide={() => setVisibleMinus(false)}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Dialog>
        </Layout>
    )
}

export default TeacherView