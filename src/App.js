import "./App.css";
import useRouteElements from './routes/index.js';
import keycloak from './keycloak';
import { useEffect } from "react";
import useUser from "./hook/useUser.js";

function App() {
  const routeElements = useRouteElements();
  const { user, setUser, setAuthenticated } = useUser();

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
          const authenticated = await keycloak.init({ onLoad: 'check-sso' });

          if (authenticated) {
            setAuthenticated(true);
            setUser({
              ...user,
              roles: keycloak.realmAccess?.roles || [],
            });
            console.log({ ...user, roles: keycloak.realmAccess?.roles || [] });
            return; 
          }
        }
        const authenticated = await keycloak.init({ onLoad: 'login-required' });
        
        if (authenticated) {
          setAuthenticated(true);
          localStorage.setItem("accessToken", keycloak.token);
          setUser({
            ...user,
            roles: keycloak.realmAccess?.roles || [],
          });
          console.log({ ...user, roles: keycloak.realmAccess?.roles || [] });
        } else {
          console.warn('User is not authenticated!');
        }

        setInterval(() => {
          console.error('Refresh token');
          keycloak.updateToken(70).then(refreshed => {
            if (refreshed) {
              localStorage.setItem('accessToken', keycloak.token);
            }
          }).catch(() => {
            console.error('Failed to refresh token');
          });
        }, 60000); 

      } catch (error) {
        console.error('Keycloak initialization failed:', error);
      }
    };

    initKeycloak();
  }, [setUser, setAuthenticated, user]);

  return (
    <div className="App">
      {routeElements}
    </div>
  );
}

export default App;
