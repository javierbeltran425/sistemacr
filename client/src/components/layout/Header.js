import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//components
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";

//auth
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");

  const logout = useLogout();
  const { auth } = useAuth();

  useEffect(() => {
    tituloHeader();
  }, [auth.rol]);

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const tituloHeader = () => {
    switch (auth.rol) {
      case "estudiante":
        setTitulo("Panel de estudiantes");
        break;

      case "profesor":
        setTitulo("Panel de catedraticos");
        break;

      default:
        break;
    }
  };

  const headerTemplate = () => {
    switch (auth.rol) {
      case "estudiante":
        return <></>;

      case "profesor":
        return (
          <div className="flex flex-column md:flex-row md:gap-6">
            <p
              className="cursor-pointer hover:text-blue-500"
              onClick={() => {
                navigate("/");
              }}
            >
              Solicitudes
            </p>
            <p
              className="cursor-pointer hover:text-blue-500"
              onClick={() => {
                navigate("/teacher");
              }}
            >
              Definición de horarios
            </p>
          </div>
        );

      case "admin":
        return (
          <div className="flex flex-column md:flex-row md:gap-6">
            <p
              className="cursor-pointer hover:text-blue-500"
              onClick={() => {
                navigate("/");
              }}
            >
              Inicio
            </p>
            <p
              className="cursor-pointer hover:text-blue-500"
              onClick={() => {
                navigate("/upload");
              }}
            >
              Importar Estudiantes
            </p>
          </div>
        );

      default:
        <></>;
        break;
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex md:flex-row w-full h-2 px-1 md:px-6 justify-content-between align-items-center bg-gray-100 shadow-1">
        {auth.activo ? (
          <div className="hidden md:inline">{headerTemplate()}</div>
        ) : (
          <div />
        )}

        <div className="hidden md:flex gap-2 p-2 align-items-center">
          <div>
            <h5 className="p-0 m-0 text-right">{auth.nombre}</h5>
            <p
              onClick={signOut}
              className="p-0 m-0 text-right text-blue-500 cursor-pointer"
            >
              Cerrar sesión
            </p>
          </div>

          <Avatar
            icon="pi pi-user"
            size="large"
            className="logo cursor-pointer"
            onClick={() => navigate("/register")}
          />
        </div>

        <div className="py-2 px-1 flex w-full md:hidden">
          {auth.rol !== "estudiante" ? (
            <i
              className="pi pi-bars font-bold text-lg"
              onClick={() => setVisible(true)}
            ></i>
          ) : (
            <div className="flex w-full flex-row justify-content-end">
              <div
                className="flex flex-row align-items-center gap-1"
                onClick={signOut}
              >
                <p className="m-0 p-0 hover:text-blue-500">Cerrar sesión</p>
                <i
                  className="pi pi-sign-out font-bold text-lg text-blue-500"
                  onClick={() => setVisible(true)}
                ></i>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card flex md:hidden justify-content-center">
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          <div className="flex w-full justify-content-start">
            <div className="flex gap-2 align-items-end">
              <Avatar
                icon="pi pi-user"
                size="large"
                className="logo cursor-pointer"
                onClick={() => navigate("/register")}
              />
              <div className="text-start">
                <h5 className="p-0 m-0">{auth.nombre}</h5>
                <p
                  onClick={signOut}
                  className="p-0 m-0 text-left text-blue-500 cursor-pointer"
                >
                  Cerrar sesión
                </p>
              </div>
            </div>
          </div>

          <Divider />

          {headerTemplate()}
        </Sidebar>
      </div>
    </>
  );
};

export default Header;
