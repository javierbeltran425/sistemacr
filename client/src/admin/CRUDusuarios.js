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
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import ModalUsuarios from "./ModalUsuarios";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import "../constants/usuario";
import NetworkErrorHandler from "../components/NetworkErrorHandler";

import { getUsuarios, deleteUsuario } from "../services/UsuariosServices";
import { getMaterias } from "../services/MateriasServices";
import { getCarreras } from "../services/CarrerasServices";

import useAuth from "../hooks/useAuth";

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

const CRUDusuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioToEdit, setUsuarioToEdit] = useState({
    id_usuario: null,
    id_carrera: null,
    email: "",
    nombre: "",
    rol: "",
  });
  const [dataSet, setDataSet] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [networkErrorMessage, setNetworkErrorMessage] = useState("");

  const { auth } = useAuth();

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const removeUsuarioById = async (id_usuario) => {
    if (window.confirm("Estás seguro que quieres eliminar este usuario?")) {
      try {
        const response = await deleteUsuario(id_usuario, auth.accessToken);
        if (response.status === 200) {
          getAllUsuarios();
        }
      } catch (error) {
        if (error.response && error.response.status) {
          setNetworkErrorMessage(error.response.status);
        } else {
          setNetworkErrorMessage('Error desconocido');
        }
      }
    }
  };

  const getAllUsuarios = async () => {
    try {
      const response = await getUsuarios(auth.accessToken);

      if (response.status === 200) {
        setUsuarios(response.data);
        setDataSet(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setNetworkErrorMessage(error.response.status);
      } else {
        setNetworkErrorMessage('Error desconocido');
      }
    }
  };

  const getAllCarreras = async () => {
    try {
      const response = await getCarreras(auth.accessToken);

      if (response.status === 200) {
        setCarreras(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setNetworkErrorMessage(error.response.status);
      } else {
        setNetworkErrorMessage('Error desconocido');
      }
    }
  };

  const getAllMaterias = async () => {
    try {
      const response = await getMaterias(auth.accessToken);

      if (response.status === 200) {
        setMaterias(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setNetworkErrorMessage(error.response.status);
      } else {
        setNetworkErrorMessage('Error desconocido');
      }
    }
  };

  useEffect(() => {
    getAllUsuarios();
    getAllCarreras();
    getAllMaterias();
  }, []);

  const columns = [
    { id: "id_usuario", label: "ID", minWidth: 10, align: "left" },
    { id: "email", label: "Email", minWidth: 170, align: "left" },
    { id: "nombre", label: "Nombre", minWidth: 170, align: "left" },
    { id: "rol", label: "Rol", minWidth: 100, align: "left" },
    { id: "carrera", label: "Carrera", minWidth: 170, align: "left" },
    { id: "materias", label: "Materias", minWidth: 250, align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    searchValue == ""
      ? setDataSet(usuarios)
      : setDataSet(
        usuarios.filter(
          (e) =>
            e.email.toUpperCase().includes(searchValue.toUpperCase()) ||
            e.nombre.toUpperCase().includes(searchValue.toUpperCase())
        )
      );
  }, [searchValue]);

  return (
    <>
      <NetworkErrorHandler error={networkErrorMessage} setNetworkErrorMessage={setNetworkErrorMessage} />
      <Box>
        {showModal && (
          <ModalUsuarios
            mode={mode}
            showModal={showModal}
            handleOpen={handleOpen}
            handleClose={handleClose}
            getAllUsuarios={getAllUsuarios}
            usuarioToEdit={usuarioToEdit}
            carreras={carreras}
            materias={materias}
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
              Agregar usuario
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
                          style={{ minWidth: column.minWidth }}
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
                                    setUsuarioToEdit({
                                      ...usuarioToEdit,
                                      id_usuario: row.id_usuario,
                                      id_carrera: row.id_carrera,
                                      email: row.email,
                                      nombre: row.nombre,
                                      rol: row.rol,
                                    });
                                    setMode("edit");
                                    setShowModal(true);
                                  }}
                                  sx={{ mr: 2 }}
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    removeUsuarioById(row.id_usuario);
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="ml-5">
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
    </>
  );
};

export default CRUDusuarios;
