import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ContextUsuario } from "../../context/usuario";

//components
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [materias, setMaterias] = useState([]);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const usuario = useContext(ContextUsuario);

  const signOut = () => {
    removeCookie("id_usuario");
    removeCookie("email");
    removeCookie("authToken");
    window.location.reload();
  };

  const getMateriasByIdUsuario = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/materias/getmateriasbyidusuario/${usuario.id_usuario}`
      );
      const json = await resp.json();
      setMaterias(json);
    } catch (error) {
      console.error(error);
    }
  };

  const materiasRender = () => {
    return materias.map((materia) => {
      return (
        <li className="list-none pl-1 py-2 hover:bg-gray-200 cursor-pointer border-round">
          {materia.nombre}
        </li>
      );
    });
  };

  useEffect(() => {
    getMateriasByIdUsuario();
  }, []);

  return (
    <div className="flex md:flex-row w-full h-2 px-6 justify-content-between align-items-center bg-gray-100 shadow-1">
      <div>
        <Button
          icon="pi pi-bars"
          onClick={() => setVisible(true)}
          className="p-button-secondary p-button-outlined shadow-1"
        />

        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          <div className="flex flex-column md:flex-row">
            <Avatar label="P" size="xlarge" />
            <div className="flex flex-column justify-content-end">
              <h4 className="p-0 pl-1 m-0">{usuario.email}</h4>
              <p className="p-0 pl-1 m-0">{usuario.rol}</p>
              <p
                className="p-0 pl-1 m-0 text-blue-300 hover:text-blue-500 cursor-pointer"
                onClick={signOut}
              >
                Cerrar sesión
              </p>
            </div>
          </div>

          <Divider />

          <h2>Tus materias inscritas</h2>
          {materias.length === 0 ? (
            <p>Tus materias apareceran aquí cuando tengas materias inscritas</p>
          ) : (
            <ul>{materiasRender()}</ul>
          )}
        </Sidebar>
      </div>
      <div className="flex gap-2 p-2 align-items-center">
        <h5>{usuario.email}</h5>
        <Avatar label="N" size="large" />
      </div>
    </div>
  );
};

export default Header;
