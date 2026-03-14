import Keycloak from 'keycloak-js';
import { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID } from './utils/Constant.js';

const keycloak = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID
});

let keycloakInitPromise = null;

export const initKeycloakOnce = (options) => {
    if (!keycloakInitPromise) {
        keycloakInitPromise = keycloak.init(options);
    }
    return keycloakInitPromise;
};

export default keycloak;
