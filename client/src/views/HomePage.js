import React, { useState, useEffect, useContext } from "react";
import ContextUsuario from "../context/ContextUsuario";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

//custom components
import Layout from "../components/layout/Layout";
import CalendarStudent from "../components/CalendarStudent";
import CalendarTeacher from "../components/CalendarTeacher";

//prime components
import { Dropdown } from "primereact/dropdown";

//constants
import "../constants/usuario";
import { USUARIO_ROLES } from "../constants/usuario";

const HomePage = () => {
  const usuario = useContext(ContextUsuario);
  const navigate = useNavigate();
  const [cookies] = useCookies(null);

  useEffect(() => {
    cookies.id_usuario === "" && navigate('/')
  }, [])

  const switchRoute = () => {
    switch (usuario.rol) {
      case "profesor":
        return <CalendarTeacher />;

      case "estudiante":
        return <CalendarStudent />;

      case "admin":
        navigate("/admin");

      default:
        break;
    }
  };

  return (
    <Layout>
      <div className="w-full lg:px-6 py-3">
        <div className="mt-4">{switchRoute()}</div>
      </div>
    </Layout>
  );
};

export default HomePage;
