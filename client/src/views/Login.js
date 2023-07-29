import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

//components
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

import { getRolByID } from "../services/UsuariosServices";

import ContextUsuario from "../context/ContextUsuario";

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(null);

  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  const contextUsuario = useContext(ContextUsuario)

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    setLoading(true)

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else if (data.token) {
      console.log("🚀 ~ file: Login.js:44 ~ handleSubmit ~ data:", data)
      setCookie("id_usuario", data.id_usuario);
      setCookie("email", data.email);
      setCookie("authToken", data.token);
      setCookie("nombre", data.nombre);
      setCookie("act", data.activo)

      contextUsuario.setId_usuario(data.id_usuario)
      contextUsuario.setEmail(data.email)
      contextUsuario.setActivo(data.activo)
      getRol(data.id_usuario)

      if (!data.activo)
        navigate('/register')
    }

    setLoading(false)
  };

  const getRol = async (idUsuario) => {
    try {

      const response = await getRolByID(idUsuario, cookies.authToken)

      if (response.status === 200) contextUsuario.setRol(response.data[0].rol)

    } catch (error) {
      console.error(error);
    }
  };

  const titleTemplate = (
    <div>
      <p className="text-center md:text-left text-2xl font-bold">
        Bienvenido al sistema de consultas y revisiones
      </p>
    </div>
  );

  return (
    <div className="flex w-full h-screen justify-content-center align-items-center surface-ground px-3">
      <Card title={titleTemplate}>
        <div className="flex flex-column justify-content-center align-items-center md:flex-row w-full">
          <div className="flex w-8 justify-content-center align-items-center">
            <img
              src="https://www.uca.edu.sv/realidad.empresarial/wp-content/uploads/2018/09/logo-uca2.png"
              className="w-8 mb-3 md:mb-0"
            />
          </div>
          <div className="flex flex-column justify-content-center align-items-center gap-4">
            <InputText
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              keyfilter={/^[a-zA-Z0-9@._+-]*$/}
            />
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              placeholder="Contraseña"
              keyfilter={/^[\w!@#$%^&*()\-+=<>?/\|{}\[\]~]*$/}
            />
            <Button
              loading={loading}
              label={"Iniciar sesión"}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e, "auth/login");
              }}
            />

            {error && <p>{error}</p>}

          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
