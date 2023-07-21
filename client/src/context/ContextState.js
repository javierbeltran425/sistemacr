import React, { useState } from 'react'

import ContextUsuario from './ContextUsuario'

const ContextState = (props) => {
    const [id_usuario, setId_usuario] = useState("")
    const [email, setEmail] = useState("")
    const [rol, setRol] = useState("")
    const [activo, setActivo] = useState(false)

    return (
        <ContextUsuario.Provider
            value={{
                id_usuario,
                email,
                rol,
                activo,

                setId_usuario,
                setEmail,
                setRol,
                setActivo
            }}
        >
            {props.children}
        </ContextUsuario.Provider>
    )
}

export default ContextState