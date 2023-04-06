import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ModalUsuarios from "./Modal";
import Card from "@mui/material/Card";

const CRUDusuarios = () => {
  const [usuarios, setUsuarios] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);

  const LoadDetail = (id) => {
    navigate("/employee/detail/" + id);
  };
  const LoadEdit = (id) => {
    navigate("/employee/edit/" + id);
  };
  const Removefunction = (id) => {
    if (window.confirm("Do you want to remove?")) {
      fetch("http://localhost:8000/employee/" + id, {
        method: "DELETE",
      })
        .then((res) => {
          alert("Removed successfully.");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/usuarios/getusuarios`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setUsuarios(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <h2>Employee Listing</h2>
        </div>
        <div className="card-body">
          <div className="divbtn">
            <Button onClick={() => setShowModal(true) && setMode("create")}>
              Create
            </Button>
          </div>
          <table className="table table-bordered">
            <thead className="bg-dark text-white">
              <tr>
                <td>Email</td>
                <td>Rol</td>
                <td>Acción</td>
              </tr>
            </thead>
            <tbody>
              {usuarios &&
                usuarios.map((item) => (
                  <tr key={item.email}>
                    <td>{item.email}</td>
                    <td>{item.rol}</td>
                    <td>
                      <Button
                        onClick={() => {
                          LoadEdit(item.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          Removefunction(item.id);
                        }}
                      >
                        Remove
                      </Button>
                      <Button
                        onClick={() => {
                          LoadDetail(item.id);
                        }}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <Modal mode={mode} setShowModal={setShowModal} getData={null} />
      )}
    </div>
  );
};

export default CRUDusuarios;
