import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

//components
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className='flex w-full h-screen justify-content-center align-items-center surface-ground'>
            <Card title="Bienvenido al sistema de consultas y revisiones">
                <div className='flex flex-row w-full'>
                    <div className='flex w-8 justify-content-center align-items-center'>
                        <img src='https://www.uca.edu.sv/realidad.empresarial/wp-content/uploads/2018/09/logo-uca2.png' className='w-8' />
                    </div>
                    <div className='flex flex-column justify-content-center align-items-center gap-4'>
                        <InputText value={username} onChange={(e) => setUsername(e.target.value)} />
                        <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} placeholder="Contraseña" />
                        <Button label="Iniciar sesión" onClick={(e) => {
                            e.preventDefault();
                            navigate('/home')
                        }} />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Login