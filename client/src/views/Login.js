import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

//components
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();

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
      setCookie("id_usuario", data.id_usuario);
      setCookie("email", data.email);
      setCookie("authToken", data.token);
      window.location.reload();
    }
  };

  return (
    <div className="flex w-full h-screen justify-content-center align-items-center surface-ground">
      <Card title="Bienvenido al sistema de consultas y revisiones">
        <div className="flex flex-row w-full">
          <div className="flex w-8 justify-content-center align-items-center">
            <img
              src="https://www.uca.edu.sv/realidad.empresarial/wp-content/uploads/2018/09/logo-uca2.png"
              className="w-8"
            />
          </div>
          <div className="flex flex-column justify-content-center align-items-center gap-4">
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              placeholder="Contraseña"
            />
            <Button
              label={isLogin ? "Iniciar sesión" : "Registrarse"}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e, isLogin ? "auth/login" : "auth/signup");
              }}
            />

            {error && <p>{error}</p>}
            <div className="auth-options">
              <button
                onClick={() => viewLogin(false)}
                style={{
                  backgroundColor: !isLogin
                    ? "rgb(255, 255, 255)"
                    : "rgb(188, 188, 188)",
                  marginRight: "1rem",
                }}
              >
                Sign Up
              </button>
              <button
                onClick={() => viewLogin(true)}
                style={{
                  backgroundColor: isLogin
                    ? "rgb(255, 255, 255)"
                    : "rgb(188, 188, 188)",
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
