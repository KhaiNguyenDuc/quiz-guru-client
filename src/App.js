import "./App.css";
import useRouteElements from './routes/index.js';
import keycloak from './keycloak';
import { useEffect, useState } from "react";
import useUser from "./hook/useUser.js";
import { logoutUser } from "./utils/Utils.js";

function App() {
  const routeElements = useRouteElements();
  const { user, setUser, setAuthenticated } = useUser();
  const [isInitialized, setIsInitialized] = useState(false); // Step 1: Add loading state

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({ onLoad: 'login-required' });
       
        if (authenticated) {
          console.log("Required login");
          setAuthenticated(true);
          localStorage.setItem("accessToken", keycloak.token);
          setUser({
            ...user,
            roles: keycloak.realmAccess?.roles || [],
          });
        } else {
          console.warn('User is not authenticated!');
          logoutUser()
        }

        setInterval(() => {
          keycloak.updateToken(70).then(refreshed => {
            if (refreshed) {
              console.log('Refresh token');
              localStorage.setItem('accessToken', keycloak.token);
            }
          }).catch(() => {
            console.error('Failed to refresh token');
          });
        }, 60000);

        setIsInitialized(true); // Step 3: Set loading to false after initialization

      } catch (error) {
        console.error('Keycloak initialization failed:', error);
      }
    };

    initKeycloak();
  }, [setUser, setAuthenticated, user]);

  if (!isInitialized) {
    return <div>Loading...</div>; // Step 2: Show loading message until initialization
  }

  return (
    <div className="App">
      {routeElements}
    </div>
  );
}

export default App;
