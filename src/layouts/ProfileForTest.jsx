import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const ProfileTest = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
    getAccessTokenSilently,
  } = useAuth0();

  React.useEffect(() => {
    const fetchProfile = async () => {
      const idToken = await getIdTokenClaims();
      const accessToken = await getAccessTokenSilently();
      console.log("ID token:", idToken);
      console.log("Access token:", accessToken);
    };

    fetchProfile();
  }, [getIdTokenClaims, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  console.log(user);

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default ProfileTest;
