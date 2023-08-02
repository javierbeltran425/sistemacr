import { React } from "react";
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
import TeacherView from "./views/TeacherView";
import AdminView from "./views/AdminView";
import UploadView from "./views/UploadView";
import RegisterView from "./views/RegisterView";
import RequireAuth from "./components/auth/RequireAuth";
import Unauthorized from "./components/auth/Unauthorized";
import Missing from "./components/auth/Missing";
import PersistLogin from "./components/auth/PersistLogin";
import RecoveryPassword from "./views/RecoveryPassword";

import { USUARIO_ROLES } from "./constants/usuario";

//constants

function App() {
  return (
    <Router>
      <Routes>
        {/* public */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404" element={<Missing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recovery" element={<RecoveryPassword />} />

        {/* protected */}
        {
          <Route element={<PersistLogin />}>
            {/* admin */}
            <Route
              element={<RequireAuth allowedRoles={[USUARIO_ROLES.ADMIN]} />}
            >
              <Route path="/admin" element={<AdminView />}></Route>
              <Route path="/upload" element={<UploadView />} />
            </Route>
            {/* profesor */}
            <Route
              element={<RequireAuth allowedRoles={[USUARIO_ROLES.PROFESOR]} />}
            >
              <Route path="/teacher" element={<TeacherView />} />
            </Route>
            {/* todos los usuarios */}
            <Route
              element={
                <RequireAuth allowedRoles={Object.values(USUARIO_ROLES)} />
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterView />} />
            </Route>
          </Route>
        }

        {/* No existe */}
        <Route path="*" element={<Missing />} />
      </Routes>
    </Router>
  );
}

export default App;
