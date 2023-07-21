import { React, useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

//context: id_usuario email rol
import ContextState from "./context/ContextState";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

//primeflex
import "/node_modules/primeflex/primeflex.css";

//views
import Login from "./views/Login";
import HomePage from "./views/HomePage";
import TeacherView from "./views/TeacherView";
import AdminView from "./views/AdminView";
import UploadView from "./views/UploadView";
import RegisterView from "./views/RegisterView";

//constants

function App() {
  const [cookies] = useCookies(null);
  const authToken = cookies.authToken;

  return (
    <ContextState>
      <Router>
        {authToken ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teacher" element={<TeacherView />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/upload" element={<UploadView />} />
            <Route path="/register" element={<RegisterView />} />
          </Routes>
        ) : (
          <Login />
        )}
      </Router>
    </ContextState>
  );
}

export default App;
