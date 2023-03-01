import React, { useState, useEffect } from "react";

//prime components
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";

export default function InlineDemo() {
    const [date, setDate] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (date !== null) setVisible(true);
    }, [date])
    
    useEffect(() => {
      if (!visible) setDate(null);
    }, [visible])

    const horarios = [
        {
            inicio: "9:00am",
            fin: "10:00am"
        },
        {
            inicio: "10:00am",
            fin: "10:30am"
        },
        {
            inicio: "11:00am",
            fin: "12:00md"
        }
    ]

    const footerContent = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Guardar" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        </div>
    );
    
    return (
        <div className="card flex justify-content-center">
            <Calendar className="w-full" value={date} onChange={(e) => setDate(e.value)} inline showWeek />

            <Dialog header='Horarios disponibles' visible={visible} style={{ width: '25vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <div className="flex">
                    <p className="pr-2 font-medium">
                        Fecha:
                    </p>
                    {
                        date !== null ?
                            <p className="font-medium">
                                {date.getDate()}-{date.getMonth()+1}-{date.getFullYear()}
                            </p>
                        : ""
                    }
                </div>
                {
                    horarios.map(horario => {
                        return <div className="mx-2 px-2 border-round shadow-1 surface-ground hover:bg-blue-100 cursor-pointer">
                            <p>{horario.inicio} - {horario.fin}</p>
                        </div>
                    })
                }
            </Dialog>
        </div>

    )
}