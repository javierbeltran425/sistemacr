import React, { useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const NetworkErrorHandler = ({ error }) => {
    const toastBC = useRef(null);

    useEffect(() => {
        error !== "" && confirm()
    }, [error])

    const clear = () => {
        toastBC.current.clear();
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
                        <div className="font-bold text-xl my-3">{error}</div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={(e) => clear(true)} type="button" label="Confirm" className="p-button-success w-6rem" />
                        <Button onClick={(e) => clear(false)} type="button" label="Cancel" className="p-button-warning w-6rem" />
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