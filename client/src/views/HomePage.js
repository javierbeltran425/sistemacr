import React from "react";
import { useNavigate } from "react-router-dom";

//custom components
import Layout from "../components/layout/Layout";
import CalendarStudent from "../components/CalendarStudent";
import CalendarTeacher from "../components/CalendarTeacher";

//constants
import "../constants/usuario";
import { USUARIO_ROLES } from "../constants/usuario";

import useAuth from "../hooks/useAuth";

const HomePage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const switchRoute = () => {
    if (!auth.activo) return navigate("/register");
    switch (auth.rol) {
      case USUARIO_ROLES.PROFESOR:
        return <CalendarTeacher />;

      case USUARIO_ROLES.ESTUDIANTE:
        return <CalendarStudent />;

      case USUARIO_ROLES.ADMIN:
        navigate("/admin");
        break;

      default:
        <></>;
        break;
    }
  };

  React.useEffect(() => {
    switchRoute();
  }, [auth.activo]);

  return (
    <Layout>
      <div className="w-full lg:px-6 py-3">
        <div className="mt-4">{switchRoute()}</div>
      </div>
    </Layout>
  );
};

export default HomePage;
