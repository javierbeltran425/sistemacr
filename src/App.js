import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
