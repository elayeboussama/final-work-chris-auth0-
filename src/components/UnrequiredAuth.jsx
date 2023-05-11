import { useLocation, Navigate, Outlet ,useOutletContext} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAuth0 } from "@auth0/auth0-react";

const UnrequiredAuth = () => {
    const {
      user,
      isAuthenticated,
      isLoading,
      getIdTokenClaims,
      getAccessTokenSilently,
    } = useAuth0();
 
 
    const location = useLocation();
     
    return isAuthenticated ? (
      <Navigate to="/" state={{ from: location }} replace />
    ) : (
      <Outlet />
    );
}

export default UnrequiredAuth;