import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section>
      <h1>No autorizado</h1>
      <br />
      <p>No tienes acceso a la página solicitada.</p>
      <div className="flexGrow">
        <button onClick={goBack}>Regresar</button>
      </div>
    </section>
  );
};

export default Unauthorized;
