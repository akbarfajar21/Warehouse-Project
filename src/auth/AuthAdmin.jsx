import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthAdmin = () => {
  const { user, role } = useAuth();
  const location = useLocation();

  const [data, setData] = useState(
    localStorage.getItem("sb-nohdhimjdnmcytzooteh-auth-token")
  );

  return data ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace state={{ path: location.pathname }} />
  );
};

export default AuthAdmin;
