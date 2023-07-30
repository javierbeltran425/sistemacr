import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

//custom components
import Layout from "../components/layout/Layout";
import CalendarStudent from "../components/CalendarStudent";
import CalendarTeacher from "../components/CalendarTeacher";

//constants
import "../constants/usuario";
import { USUARIO_ROLES } from "../constants/usuario";

import { getRolByID } from "../services/UsuariosServices";

const HomePage = () => {
  const [rol, setRol] = useState("")

  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(null);

  useEffect(() => {

    getRol()
  }, [])

  const getRol = async () => {
    try {
      const response = await getRolByID(cookies.id_usuario, cookies.authToken)

      if (response.status === 200) setRol(response.data[0].rol)

    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        removeCookie("id_usuario");
        removeCookie("email");
        removeCookie("authToken");
        removeCookie("nombre");
        removeCookie("act");
        navigate("/");
        window.location.reload()

      } else {
        alert("Ha ocurrido un error inesperado.");
      }
    }
  };

  const switchRoute = () => {

    switch (rol) {
      case USUARIO_ROLES.PROFESOR:
        return <CalendarTeacher />;

      case USUARIO_ROLES.ESTUDIANTE:
        return <CalendarStudent />;

      case USUARIO_ROLES.ADMIN:
        navigate("/admin");

      default:
        <></>
        break;
    }
  };

  return (
    <Layout>
      <div className="w-full lg:px-6 py-3">
        <div className="mt-4">
          {switchRoute()}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
