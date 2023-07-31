import React from "react";
import useAuth from "../../hooks/useAuth";

export const AuthHookHoc = (Component) => (props) => {
  const { auth, setAuth } = useAuth();
  return <Component auth={auth} setAuth={setAuth} {...props} />;
};
