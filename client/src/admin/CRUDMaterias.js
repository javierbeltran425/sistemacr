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
import ModalMaterias from "./ModalMaterias";

const CRUDmaterias = () => {
  const [materias, setMaterias] = useState([]);
  const [materiaToEdit, setMateriaToEdit] = useState({
    id_materia: "",
    nombre: "",
    uv: "",
  });
  const [carreras, setCarreras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const removeMateriaById = async (id_materia) => {
    if (window.confirm("Estás seguro que quieres eliminar esta materia?")) {
      try {
        const resp = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/materias/removemateriabyid/${id_materia}`,
          {
            method: "DELETE",
          }
        );
        const json = await resp.json();
        if (resp.status == 200) {
          console.log("Ok!");
          getAllMaterias();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getAllMaterias = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/materias/getallmaterias`
      );
      const json = await resp.json();
      setMaterias(json);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCarreras = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/carreras/getallcarreras`
      );
      const json = await resp.json();
      setCarreras(json);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { id: "id_materia", label: "ID", minWidth: 10, align: "left" },
    { id: "nombre", label: "Nombre", minWidth: 170, align: "left" },
    { id: "uv", label: "UVs", minWidth: 170, align: "left" },
    { id: "carreras", label: "Carreras", minWidth: 170, align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getAllMaterias();
    getAllCarreras();
  }, []);

  return (
    <Box>
      {showModal && (
        <ModalMaterias
          mode={mode}
          showModal={showModal}
          handleOpen={handleOpen}
          handleClose={handleClose}
          getAllMaterias={getAllMaterias}
          materiaToEdit={materiaToEdit}
          carreras={carreras}
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
            Agregar Materia
          </Button>
        </CardActions>
        <CardContent>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 650 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materias &&
                    materias
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
                            key={row.id_materia}
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
                                  setMateriaToEdit({
                                    ...materiaToEdit,
                                    id_materia: row.id_materia,
                                    nombre: row.nombre,
                                    uv: row.uv,
                                  });
                                  setMode("edit");
                                  handleOpen();
                                }}
                                sx={{ mr: 2 }}
                              >
                                Edit
                              </Button>

                              <Button
                                variant="contained"
                                onClick={() => {
                                  removeMateriaById(row.id_materia);
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
              count={materias.length}
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

export default CRUDmaterias;
