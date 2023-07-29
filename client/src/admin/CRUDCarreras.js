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
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import { useCookies } from "react-cookie";

import { getCarreras, removeCarreraID } from "../services/CarrerasServices";

import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

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

const CRUDcarreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [carreraToEdit, setCarreraToEdit] = useState({
    id_carrera: "",
    nombre: "",
    facultad: "",
  });
  const [dataSet, setDataSet] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchValue, setSearchValue] = useState("");

  const [cookies] = useCookies(null);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const removeCarreraById = async (id_carrera) => {
    if (window.confirm("Estás seguro que quieres eliminar esta carrera?")) {
      try {
        const response = await removeCarreraID(id_carrera, cookies.authToken)

        if (response.status === 200) {
          getAllCarreras();
        }

      } catch (error) {
        console.log(error);
      }
    }
  };

  const getAllCarreras = async () => {
    try {

      const response = await getCarreras(cookies.authToken)

      if (response.status === 200) {
        setCarreras(response.data);
        setDataSet(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCarreras();
  }, []);

  const columns = [
    { id: "id_carrera", label: "ID", minWidth: 10, align: "left" },
    { id: "nombre", label: "Nombre", minWidth: 170, align: "left" },
    { id: "facultad", label: "Facultad", minWidth: 170, align: "left" },
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
      ? setDataSet(carreras)
      : setDataSet(
        carreras.filter(
          (e) =>
            e.id_carrera.includes(searchValue) ||
            e.nombre.includes(searchValue)
        )
      );
  }, [searchValue]);

  return (
    <Box>
      {showModal && (
        <ModalCarreras
          mode={mode}
          showModal={showModal}
          handleOpen={handleOpen}
          handleClose={handleClose}
          getAllCarreras={getAllCarreras}
          carreraToEdit={carreraToEdit}
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
            Agregar carrera
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
                        style={{ minWidth: column.minWidth }}
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
                                  setCarreraToEdit({
                                    ...carreraToEdit,
                                    id_carrera: row.id_carrera,
                                    nombre: row.nombre,
                                    facultad: row.facultad,
                                  });
                                  setMode("edit");
                                  setShowModal(true);
                                }}
                                sx={{ mr: 2 }}
                              >
                                EDITAR
                              </Button>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  removeCarreraById(row.id_carrera);
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

export default CRUDcarreras;
