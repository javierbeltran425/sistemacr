import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

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

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email

  return (
    <Router>
      {!authToken && <Login />}
      {authToken && 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teacher" element={<TeacherView />} />
        </Routes>
      } 
    </Router>
  );
}

export default App;
