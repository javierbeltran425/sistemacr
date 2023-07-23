import * as React from "react";
import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CRUDusuarios from "../admin/CRUDusuarios";
import CRUDCarreras from "../admin/CRUDCarreras";
import CRUDMaterias from "../admin/CRUDMaterias";
import Layout from "../components/layout/Layout";
import ContextUsuario from "../context/ContextUsuario";

import HistoryView from "./HistoryView";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const [rol, setRol] = useState("");

  const [cookies] = useCookies(null)
  const navigate = useNavigate();

  const contextUsuario = React.useContext(ContextUsuario);

  useEffect(() => {
    cookies.id_usuario === "" && navigate('/')
    getRol()
  }, [])

  useEffect(() => {
    if (rol !== "") {
      const checkLogin = () => {
        if (rol !== "admin") {
          navigate('/')
        }
      }

      checkLogin()
    }

  }, [rol])

  const getRol = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/getrolbyid/${cookies.id_usuario}`
      );
      const json = await resp.json();

      setRol(json[0].rol)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AdminView() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="usuarios" {...a11yProps(0)} />
            <Tab label="materias" {...a11yProps(1)} />
            <Tab label="carreras" {...a11yProps(2)} />
            <Tab label="solicitudes" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <CRUDusuarios />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CRUDMaterias />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CRUDCarreras />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <HistoryView />
        </TabPanel>
      </Box>
    </Layout>
  );
}
