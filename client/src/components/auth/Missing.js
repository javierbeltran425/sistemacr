import React from "react";
import { Link } from "react-router-dom";

const Missing = () => {
  return (
    <article style={{ padding: "100px" }}>
      <h1>Oops!</h1>
      <p>La página solicitada no existe.</p>
      <div className="flexGrow">
        <Link to="/">Inicio</Link>
      </div>
    </article>
  );
};

export default Missing;
