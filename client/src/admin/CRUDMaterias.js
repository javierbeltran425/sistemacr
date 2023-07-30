import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import InputBase from "@mui/material/InputBase";
import { useNavigate } from "react-router-dom";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import ModalMaterias from "./ModalMaterias";
import Button from "@mui/material/Button";
import { useCookies } from "react-cookie";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { getMaterias, removeMateria } from "../services/MateriasServices";
import { getCarreras } from "../services/CarrerasServices";

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

  const navigate = useNavigate()
  const [cookies, removeCookie] = useCookies(null);

  const removeMateriaById = async (id_materia) => {
    if (window.confirm("Estás seguro que quieres eliminar esta materia?")) {
      try {
        const response = await removeMateria(id_materia, cookies.authToken);

        if (response.status === 200) {
          getAllMaterias();
        }
      } catch (error) {
        if (error.response && (error.response.status === 400 || error.response.status === 401)) {
          removeCookie("id_usuario");
          removeCookie("email");
          removeCookie("authToken");
          removeCookie("nombre");
          removeCookie("act");
          navigate("/");

        } else {
          alert("Ha ocurrido un error inesperado.");
        }
      }
    }
  };

  const getAllMaterias = async () => {
    try {
      const response = await getMaterias(cookies.authToken);

      if (response.status === 200) {
        setMaterias(response.data);
        setDataSet(response.data);
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        removeCookie("id_usuario");
        removeCookie("email");
        removeCookie("authToken");
        removeCookie("nombre");
        removeCookie("act");
        navigate("/");
        window.location.reload()

      } else {
        alert("Ha ocurrido un error inesperado.");
      }
    }
  };

  const getAllCarreras = async () => {
    try {
      const response = await getCarreras(cookies.authToken);

      if (response.status === 200) {
        const data = response.data;

        if (data.length > 0) {
          data.sort(function (a, b) {
            return a.nombre.localeCompare(b.nombre);
          });
          setCarreras(data);
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        removeCookie("id_usuario");
        removeCookie("email");
        removeCookie("authToken");
        removeCookie("nombre");
        removeCookie("act");
        navigate("/");
        window.location.reload()

      } else {
        alert("Ha ocurrido un error inesperado.");
      }
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
            e.nombre.toUpperCase().includes(searchValue.toUpperCase())
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
              placeholder="Buscar..."
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
                  {dataSet.length > 0 ? (
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
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="ml-5">
                        No hay elementos para mostrar.
                      </TableCell>
                    </TableRow>
                  )}
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
