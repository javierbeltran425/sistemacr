import React, { useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const NetworkErrorHandler = ({ error, setNetworkErrorMessage }) => {
    const toastBC = useRef(null);

    useEffect(() => {
        error !== "" && confirm()
    }, [error])

    const clear = () => {
        setNetworkErrorMessage("")
        toastBC.current.clear();
    };

    const handleHttpStatus = (status) => {
        if (status >= 300 && status < 400) {
            return "Redirección: La solicitud necesita más acciones para completarse. Intente nuevamente.";
        } else if (status >= 400 && status < 500) {
            return "Error del cliente: La solicitud contiene errores o no se pudo procesar. Intente nuevamente.";
        } else if (status >= 500 && status < 600) {
            return "Error del servidor: Hubo un error en el servidor al procesar la solicitud. Intente nuevamente.";
        } else {
            return "Código de estado desconocido: La solicitud no pudo completarse debido a un código de estado desconocido. Intente nuevamente.";
        }
    };

    const confirm = () => {
        toastBC.current.show({
            severity: 'info',
            sticky: true,
            className: 'border-none',
            content: (
                <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <div className="font-bold text-xl my-3">{handleHttpStatus(error)}</div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={(e) => clear(true)} type="button" label="Ok" className="p-button-success w-6rem" />
                    </div>
                </div>
            )
        });
    };

    return (
        <div>
            <Toast ref={toastBC} position="bottom-center" />
        </div>
    )
}

export default NetworkErrorHandler