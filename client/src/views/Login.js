import React from "react";
import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios, { axiosPrivate } from "../api/axios.js";

//Prime components
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

const titleTemplate = (
  <div>
    <p className="text-center md:text-left text-2xl font-bold">
      Bienvenido al sistema de consultas y revisiones
    </p>
  </div>
);

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expRegex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()\\-+=<>?/\\|{}\\[\\]~]{8,}$"

    const regex = new RegExp(expRegex);

    // if (!regex.test(password)) {
    //   setErrMsg("El texto no es una constraseña válida.");
    //   return;
    // }

    try {
      const response = await axiosPrivate.post(
        "/auth/login",
        JSON.stringify({ email, password })
      );
      const data = response?.data;
      setAuth({
        id_usuario: data.id_usuario,
        email: data.email,
        nombre: data.nombre,
        rol: data.rol,
        activo: data.activo,
        accessToken: data.accessToken,
      });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response.data.message);
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
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
          <form
            className="flex flex-column justify-content-center align-items-center gap-4"
            onSubmit={handleSubmit}
          >
            <InputText
              type="email"
              id="email"
              ref={emailRef}
              autoComplete="off"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              keyfilter={/^[a-zA-Z0-9@._+-]*$/}
              required
            />
            <Password
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              placeholder="Contraseña"
              required
              keyfilter={/^[\w!@#$%^&*()\-+=<>?/\|{}\[\]~]*$/}
            />
            <Button label={"Iniciar sesión"} />
            <div className="persistCheck">
              <input
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist}
              />
              <label htmlFor="persist">Mantener mi sesión activa</label>
            </div>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>

            <div className="m-0 p-0">
              <p className="text-blue-500 cursor-pointer hover:underline m-0 p-0" onClick={() => navigate('/recovery')}>Olvidé mi contraseña</p>
            </div>

          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
