import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";
import BasicTabs from "../components/Tab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAuth0 } from "@auth0/auth0-react";

const MainLayout = () => {
  const {
    user,
    loginWithRedirect,
    isAuthenticated,
    logout,
    isLoading,
    // getIdTokenClaims,
    getAccessTokenSilently,
  } = useAuth0();

  React.useEffect(() => {
    const fetchProfile = async () => {
      // const idToken = await getIdTokenClaims();
      const accessToken = await getAccessTokenSilently();
      // console.log("ID token:", idToken);
      console.log("Access token:", accessToken);
    };

    fetchProfile();
  }, [getAccessTokenSilently]);

  const [typeAuth, setTypeAuth] = useState(localStorage.getItem("typeAuth"));
  const navigate = useNavigate();
  // if used in more components, this should be in context
  // axios to /logout endpoint
  useEffect(() => {
    isAuthenticated && navigate("/profile");
    setTypeAuth(localStorage.getItem("typeAuth"));
  }, []);

  const logoutHandler = () => {
    localStorage.setItem("typeAuth", "na");
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  useEffect(() => {
    if (localStorage.getItem("typeAuth") === "signup") {
      navigate("/register");
    }
  }, []);

  const signUp = async () => {
    setTypeAuth("signup");
    localStorage.setItem("typeAuth", "signup");
    await loginWithRedirect();
  };
  return (
    <div className="main">
      {isAuthenticated ? (
        <>
          <Button variant="contained">
            <Link to="/Profile">Profile</Link>
          </Button>
          <Button onClick={() => logoutHandler()} variant="contained">
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => loginWithRedirect()} variant="contained">
            login
          </Button>
          <Button onClick={() => signUp()} variant="contained">
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};

export default MainLayout;

/* <div className="nav" ref={main}>
      <div className="menu-links">
        <ul>
          <Link to="/"><li>Home</li></Link>  
          <Link to="courses"><li>courses</li></Link>  
          <Link to="/courses"><li>blogs</li></Link> 
          <Link to="/courses"><li>forum</li></Link> 
          <Link to="/courses"><li>resources</li></Link> 
          {auth.user && <li id="logout" onClick={logout} >Logout</li>}
        </ul>
      </div>
    </div> */
