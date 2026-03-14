import "./App.css";
import useRouteElements from './routes/index.js';
import keycloak, { initKeycloakOnce } from './keycloak';
import { useEffect, useState } from "react";
import useUser from "./hook/useUser.js";
import { logoutUser } from "./utils/Utils.js";

function App() {
  const routeElements = useRouteElements();
  const { user, setUser, setAuthenticated } = useUser();
  const [isInitialized, setIsInitialized] = useState(false); // Step 1: Add loading state

  useEffect(() => {
    let refreshIntervalId;

    const initKeycloak = async () => {
      try {
        //https://stackoverflow.com/questions/72019588/how-to-avoid-timeout-when-waiting-for-3rd-party-check-iframe-message-with-keyc
        const authenticated = await initKeycloakOnce({ onLoad: 'login-required', checkLoginIframe: false });

        if (authenticated) {
          console.log("Required login");
          setAuthenticated(true);
          localStorage.setItem("accessToken", keycloak.token);
          setUser((prevUser) => ({
            ...prevUser,
            roles: keycloak.realmAccess?.roles || [],
          }));
        } else {
          console.warn('User is not authenticated!');
          logoutUser()
        }

        refreshIntervalId = setInterval(() => {
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

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
  }, [setUser, setAuthenticated]);

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
