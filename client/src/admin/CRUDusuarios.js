import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ModalUsuarios from "./ModalUsuarios";

const CRUDusuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({
    email: "",
    name: "",
    role: "",
    major: null,
  });
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const RemoveFunction = (email) => {
    if (window.confirm("Do you want to remove?")) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/removeusuario/${email}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => {
          alert("Removed successfully.");
          getData();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const getData = async () => {
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
  };

  const getCarreras = async () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/carreras/getcarreras`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setCarreras(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getMaterias = async () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/materias/getmaterias`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setMaterias(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getData();
    getCarreras();
    getMaterias();
    console.log(carreras);
  }, []);

  const columns = [
    { id: "email", label: "Email", minWidth: 170, align: "left" },
    { id: "nombre", label: "Nombre", minWidth: 170, align: "left" },
    { id: "rol", label: "Rol", minWidth: 100, align: "left" },
    { id: "carrera", label: "Carrera", minWidth: 100, align: "left" },
    { id: "materias", label: "Materias", minWidth: 100, align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box>
      {showModal && (
        <ModalUsuarios
          mode={mode}
          showModal={showModal}
          setShowModal={setShowModal}
          handleOpen={handleOpen}
          handleClose={handleClose}
          getData={getData}
          usuario={usuario}
          carreras={carreras}
          materias={materias}
        />
      )}
      <Card sx={{ minWidth: 275 }}>
        <CardActions>
          <Button
            onClick={() => {
              setMode("create");
              setShowModal(true);
            }}
          >
            Create
          </Button>
        </CardActions>
        <CardContent>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios &&
                    usuarios
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.email}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ whiteSpace: "pre-line" }}
                                >
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                            <TableCell align="right">
                              <Button
                                variant="contained"
                                onClick={() => {
                                  setUsuario({
                                    ...usuario,
                                    email: row.email,
                                    name: row.nombre,
                                    role: row.rol,
                                    major: row.id_carrera,
                                  });
                                  setMode("edit");
                                  setShowModal(true);
                                }}
                              >
                                Edit
                              </Button>
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                variant="contained"
                                onClick={() => {
                                  RemoveFunction(row.email);
                                }}
                              >
                                DELETE
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={usuarios.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CRUDusuarios;
