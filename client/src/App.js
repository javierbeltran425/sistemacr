import { React, useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

//context: id_usuario email rol
import { ContextUsuario } from "./context/usuario";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

//primeflex
import "/node_modules/primeflex/primeflex.css";

//views
import Login from "./views/Login";
import HomePage from "./views/HomePage";
import TeacherView from "./views/TeacherView";
import AdminView from "./views/AdminView";

//constants

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const idUsuario = cookies.id_usuario;
  const emailUsuario = cookies.email;
  const authToken = cookies.authToken;
  const [rolUsuario, setRolUsuario] = useState(null);

  const getRol = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/getrolbyid/${idUsuario}`
      );
      const json = await resp.json();
      setRolUsuario(json[0].rol);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getRol();
    }
  }, []);

  return (
    <Router>
      {authToken ? (
        <ContextUsuario.Provider
          value={{
            id_usuario: idUsuario,
            email: emailUsuario,
            rol: rolUsuario,
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teacher" element={<TeacherView />} />
            <Route path="/admin" element={<AdminView />} />
          </Routes>
        </ContextUsuario.Provider>
      ) : (
        <Login />
      )}
    </Router>
  );
}

export default App;
