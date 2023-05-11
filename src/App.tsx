import React from "react";
// import "./App.css" ;
import Profile from "./layouts/Profile";
import ProfileTest from "./layouts/ProfileForTest";
import MainLayout from "./layouts/Main";
import Login from "./layouts/Login";
import Register from "./layouts/Register";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import Application from "./layouts/Application";
import { Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Project from "./layouts/Project";
import UnrequiredAuth from "./components/UnrequiredAuth";
import Apply from "./layouts/Apply";
import ProjectTabs from "./components/projectTabs";
import { useAuthContext } from "./hooks/useAuthContext";
import { ManageDialog } from "./components/dialogue";
import { ManageProject } from "./layouts/ManageProject";
import { AddEmployee } from "./layouts/AddEmployee";
import { SignUpEmployee } from "./layouts/RegisterEmployee";
import { EditProject } from "./layouts/EditProject";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
    getAccessTokenSilently,
  } = useAuth0();

  // React.useEffect(() => {
  //   const fetchProfile = async () => {
  //     const idToken = await getIdTokenClaims();
  //     const accessToken = await getAccessTokenSilently();
  //     console.log("ID token:", idToken);
  //     console.log("Access token:", accessToken);
  //   };

  //   fetchProfile();
  // }, [getIdTokenClaims, getAccessTokenSilently]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<MainLayout />} />

        {isAuthenticated ? (
          <>
            <Route
              path="registerEmployee/:permession/:companyName/:email/:companyNameId/:companyType"
              element={<SignUpEmployee />}
            />

            <Route path="/profile" element={<Profile />} />

            <Route path="/project" element={<ProjectTabs />} />

            <Route path="/activeProjects" element={<ManageProject />} />

            <Route path="/addEmployee" element={<AddEmployee />} />

            <Route
              exact
              path="/activeProjects/edit/:id/"
              element={<EditProject />}
            />

            <Route path="/application" element={<Application />} />
            <Route path="/ProfileTest" element={<ProfileTest />} />
            <Route path="register" element={<Register />} />
          </>
        ) : (
          <>
            <Route path="login" element={<Login />} />
          </>
        )}

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
};
       
       
      
      




          