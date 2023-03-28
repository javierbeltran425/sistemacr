import { React, useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

//context: user email
import { UserContext } from "./context/usuario";

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

//constants

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [userRole, setUserRole] = useState(null);

  const getRol = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/getrol/${userEmail}`
      );
      const json = await response.json();
      setUserRole(json[0].rol);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authToken) {
      getRol();
    }
  }, []);

  return (
    <Router>
      {!authToken && <Login />}
      {authToken && (
        <UserContext.Provider value={{ email: userEmail, role: userRole }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teacher" element={<TeacherView />} />
          </Routes>
        </UserContext.Provider>
      )}
    </Router>
  );
}

export default App;
