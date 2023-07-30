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
  const [cookies] = useCookies(null);

  useEffect(() => {
    cookies.id_usuario === "" && navigate('/')
    getRol()
  }, [])

  const getRol = async () => {
    try {
      const response = await getRolByID(cookies.id_usuario, cookies.authToken)

      if (response.status === 200) setRol(response.data[0].rol)

    } catch (error) {
      console.error(error);
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
