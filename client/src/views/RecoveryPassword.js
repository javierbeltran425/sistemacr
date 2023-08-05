import React, { useState, useEffect } from 'react'

import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import NetworkErrorHandler from '../components/NetworkErrorHandler'

import { cambiaContrasenia, validateRecoveryToken } from '../services/AuthServices'

const RecoveryPassword = () => {
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [error, setError] = useState("")
    const [loadingChangingPass, setLoadingChangingPass] = useState(false)
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [networkErrorMessage, setNetworkErrorMessage] = useState("");

    useEffect(() => {
        setError("")
    }, [newPass, confirmPass])

    useEffect(() => {
        validateToken()
    }, [])

    const validateToken = async () => {
        try {
            const urlActual = window.location.href

            const token = urlActual.split("?tat=")[1]

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

    const changePassword = async () => {
        try {
            setLoadingChangingPass(true)

            const expRegex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()\\-+=<>?/\\|{}\\[\\]~]{8,}$"

            const regex = new RegExp(expRegex);

            if (newPass == "" || confirmPass == "") {
                setError("Ningún campo puede estar vacío.");
                setLoadingChangingPass(false)
                return;
            }
            if (newPass != confirmPass) {
                setError("Las contraseñas no coinciden.");
                setLoadingChangingPass(false)
                return;
            }

            if (!regex.test(newPass)) {
                setError("El texto no es una constraseña válida.");
                setLoadingChangingPass(false)
                return;
            }

            const urlActual = window.location.href

            const token = urlActual.split("?tat=")[1]

            if (token) {
                const body = {
                    password: newPass,
                    accessToken: token
                }

                const response = await cambiaContrasenia(body)

                if (response.status === 200) {
                    setPasswordChanged(true)

                    const currentPath = window.location.pathname

                    setTimeout(() => {
                        window.location.href = currentPath
                    }, 3000)
                }
            }

            setLoadingChangingPass(false)
        } catch (error) {
            if (error.response && error.response.status) {
                setNetworkErrorMessage(error.response.status);
            } else {
                setNetworkErrorMessage('Error desconocido');
            }
        }
    }

    return (
        <>
            <NetworkErrorHandler error={networkErrorMessage} setNetworkErrorMessage={setNetworkErrorMessage} />
            <div className='flex w-full h-screen flex-column justify-content-center align-items-center' >
                {passwordChanged ? (
                    <>
                        <i className="pi pi-check-circle text-green-500" style={{ fontSize: '10rem' }}></i>
                        <h3>Contraseña actualizada con éxito, será redireccionado al inicio de sesión</h3>
                    </>
                ) : (
                    <>
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

                            <Button loading={loadingChangingPass} className='border-green-500 text-green-500' label='Registrar nueva contraseña' onClick={changePassword} outlined />
                        </div>

                        <p>{error}</p>
                    </>
                )}
            </div>
        </>
    )
}

export default RecoveryPassword