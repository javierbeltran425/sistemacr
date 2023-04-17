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
import ModalCarreras from "./ModalCarreras";

const CRUDcarreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [carrera, setCarrera] = useState({ id: "", name: "", faculty: "" });
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const RemoveFunction = (id) => {
    if (window.confirm("Do you want to remove?")) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/carreras/removecarrera/${id}`,
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

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { id: "nombre", label: "Nombre", minWidth: 170, align: "left" },
    { id: "facultad", label: "Facultad", minWidth: 100, align: "left" },
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
        <ModalCarreras
          mode={mode}
          showModal={showModal}
          setShowModal={setShowModal}
          handleOpen={handleOpen}
          handleClose={handleClose}
          getData={getData}
          carrera={carrera}
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
                  {carreras &&
                    carreras
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
                            key={row.id_carrera}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
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
                                  setCarrera({
                                    ...carrera,
                                    id: row.id_carrera,
                                    name: row.nombre,
                                    faculty: row.facultad,
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
                                  RemoveFunction(row.id_carrera);
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
              count={carreras.length}
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

export default CRUDcarreras;
