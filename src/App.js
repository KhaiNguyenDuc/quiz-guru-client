import "./App.css";
import useRouteElements from './routes/index.js'
import keycloak from './keycloak';
import { useEffect } from "react";
import useUser from "./hook/useUser.js";


function App() {
  const routeElements = useRouteElements()
  const { user, setUser, setAuthenticated } = useUser();
  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
      if (authenticated) {
        setAuthenticated(true)
        const keycloakToken = keycloak.token;
        localStorage.setItem("accessToken", keycloakToken);
        
        const userRoles = keycloak.realmAccess?.roles || [];
        setUser({
          ...user,
          roles: userRoles,
        });
        console.log({   ...user,
          roles: userRoles,})
        setInterval(() => {
          keycloak.updateToken(70).then(refreshed => {
            if (refreshed) {
              localStorage.setItem('accessToken', keycloak.token);
              setToken(keycloak.token);
            }
          }).catch(() => {
            console.error('Failed to refresh token');
          });
        }, 60000);  // 1 minute before expiry
      } else {
        console.warn('User is not authenticated!');
      }
    }).catch(error => {
      console.error('Keycloak initialization failed:', error);
    });
  }, []);
  return (
    <div className="App">
     {routeElements}
    </div>
  );
}

export default App;
