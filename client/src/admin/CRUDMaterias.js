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
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#e9ecef",
  "&:hover": {
    backgroundColor: "#dee2e6",
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const CRUDmaterias = () => {
  const [materias, setMaterias] = useState([]);
  const [materiaToEdit, setMateriaToEdit] = useState({
    id_materia: "",
    nombre: "",
    uv: "",
    numsecciones: null,
  });
  const [dataSet, setDataSet] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = useState("");

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
      setDataSet(json);
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
      if (json.length > 0) {
        json.sort(function (a, b) {
          return a.nombre.localeCompare(b.nombre);
        });
        setCarreras(json);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { id: "id_materia", label: "ID", minWidth: 10, align: "left" },
    { id: "nombre", label: "Nombre", minWidth: 170, align: "left" },
    { id: "uv", label: "UVs", minWidth: 10, align: "left" },
    { id: "carreras", label: "Carreras", minWidth: 170, align: "left" },
    {
      id: "numsecciones",
      label: "Cantidad de secciones",
      minWidth: 170,
      align: "left",
    },
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

  useEffect(() => {
    searchValue == ""
      ? setDataSet(materias)
      : setDataSet(
          materias.filter(
            (e) =>
              e.id_materia.includes(searchValue) ||
              e.nombre.includes(searchValue)
          )
        );
  }, [searchValue]);

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
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              setMode("create");
              setShowModal(true);
            }}
            variant="outlined"
          >
            Agregar Materia
          </Button>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar.."
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Search>
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
                  {dataSet &&
                    dataSet
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
                                    numsecciones: row.numsecciones,
                                  });
                                  setMode("edit");
                                  handleOpen();
                                }}
                                sx={{ mr: 2 }}
                              >
                                EDITAR
                              </Button>

                              <Button
                                variant="contained"
                                onClick={() => {
                                  removeMateriaById(row.id_materia);
                                }}
                              >
                                ELIMINAR
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
              count={dataSet.length}
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
