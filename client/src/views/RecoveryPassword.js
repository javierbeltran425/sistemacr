import React, { useState, useEffect } from 'react'

import { Button } from 'primereact/button'
import { Password } from 'primereact/password'

import { validateRecoveryToken } from '../services/AuthServices'

const RecoveryPassword = () => {
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        setError("")
    }, [newPass, confirmPass])

    useEffect(() => {
        validateToken()
    }, [])

    const validateToken = async () => {
        try {
            const urlActual = window.location.href
            console.log("🚀 ~ file: RecoveryPassword.js:24 ~ validateToken ~ urlActual:", urlActual)

            const token = urlActual.split("?tat=")[1]
            console.log("🚀 ~ file: RecoveryPassword.js:27 ~ validateToken ~ token:", token)

            if (token) {
                const body = {
                    token: token,
                };

                await validateRecoveryToken(body)

            } else {
                alert("No tienes autorización")
            }

        } catch (error) {
            const currentPath = window.location.pathname;

            const newPath = "#/login";
            const newUrl = currentPath + newPath;

            window.location.href = newUrl;
        }
    }

    const changePassword = () => {
        const expRegex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()\\-+=<>?/\\|{}\\[\\]~]{8,}$"

        const regex = new RegExp(expRegex);

        if (newPass == "" || confirmPass == "") {
            setError("Ningún campo puede estar vacío.");
            return;
        }
        if (newPass != confirmPass) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!regex.test(newPass)) {
            setError("El texto no es una constraseña válida.");
            return;
        }
    }

    return (
        <div className='flex w-full h-screen flex-column justify-content-center align-items-center' >
            <h2 className='text-center'>Ingrese su nueva contraseña</h2>

            <ul className='w-11 md:w-4'>
                <li>La contraseña debe tener al menos 8 caracteres.</li>
                <li>Debe contener al menos una letra (mayúscula o minúscula) y al menos un número.</li>
                <li>Puedes utilizar letras (A-Z, a-z), números (0-9) y los siguientes caracteres especiales: ! @ # $ % ^ & * ( ) - + = &lt; &gt; ? / \ | { } [ ] ~.</li>
            </ul>

            <div className='flex w-full flex-column gap-4 align-items-center '>
                <div className='flex w-11 md:w-4 flex-column'>
                    <label>Nueva contraseña</label>
                    <Password value={newPass} onChange={(e) => setNewPass(e.target.value)} inputStyle={{ width: "100%" }} feedback={false} toggleMask keyfilter={/^[\w!@#$%^&*()\-+=<>?/\|{}\[\]~]*$/} />
                </div>
                <div className='flex w-11 md:w-4 flex-column'>
                    <label>Repita su nueva contraseña</label>
                    <Password value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} inputStyle={{ width: "100%" }} feedback={false} toggleMask keyfilter={/^[\w!@#$%^&*()\-+=<>?/\|{}\[\]~]*$/} />
                </div>

                <Button className='border-green-500 text-green-500' label='Registrar nueva contraseña' onClick={changePassword} outlined />
            </div>

            <p>{error}</p>
        </div>
    )
}

export default RecoveryPassword