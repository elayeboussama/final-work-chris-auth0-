import { useLocation, Navigate, Outlet ,useOutletContext} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAuth0 } from "@auth0/auth0-react";

const RequireAuth = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;