import React, { useState, useEffect } from 'react';
import keycloak from '../keycloak';
import useUser from "../hook/useUser";
const ProtectedRoute = ({ children }) => {
  const [hasRequiredRoles, setHasRequiredRoles] = useState(false);
  const { isAuthenticated } = useUser();
  useEffect(() => {
    const checkKeycloakAuth = async () => {
      console.log(isAuthenticated)
      if (isAuthenticated) {
        const userRoles = keycloak.realmAccess?.roles || [];
        if (userRoles.includes("ADMIN") || userRoles.includes("USER")) {
          setHasRequiredRoles(true);
        }
      } 
    };

    checkKeycloakAuth();
  }, []);


  return children


};

export default ProtectedRoute;
