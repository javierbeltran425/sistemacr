import React from 'react'

const LeyendaColores = () => {
    return (
        <div className='flex flex-column'>
            <p className='m-0 p-0 text-orange-500 text-right'>Manual de códigos de colores</p>
            <div className='flex gap-2'>
                <div className='flex align-items-center gap-2'>
                    <p>DISPONIBLE</p>
                    <span style={{
                        backgroundColor: '#caf1d8', width: 14
                        , height: 14, display: 'inline-block'
                    }}></span>
                </div>
                <div className='flex align-items-center gap-2'>
                    <p>ACEPTADA</p>
                    <span style={{
                        backgroundColor: '#17594a', width: 14
                        , height: 14, display: 'inline-block'
                    }}></span>
                </div>
                <div className='flex align-items-center gap-2'>
                    <p>RECHAZADA</p>
                    <span style={{
                        backgroundColor: '#7E1717', width: 14
                        , height: 14, display: 'inline-block'
                    }}></span>
                </div>
                <div className='flex align-items-center gap-2'>
                    <p>PENDIENTE</p>
                    <span className='bg-blue-500' style={{
                        width: 14
                        , height: 14, display: 'inline-block'
                    }}></span>
                </div>
            </div>
        </div>

    )
}

export default LeyendaColores