import axios from "axios";
import keycloak from "../keycloak";
import { logoutUser } from "../utils/Utils"

const axiosPrivate = axios.create({
  baseURL: "http://localhost:8080",
});

axiosPrivate.interceptors.request.use(
  async (request) => {
    try {
      await keycloak.updateToken(30); // Refresh token if it's going to expire in the next 30 seconds
    } catch (error) {
      console.error("Failed to refresh token", error);
      logoutUser();  // Call the logout utility
      return Promise.reject(error);
    }

    const accessToken = keycloak.token;
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error.response?.status === 401 && !prevRequest?.sent) {
      try {
        await keycloak.updateToken(30);
        prevRequest.sent = true;
        prevRequest.headers["Authorization"] = `Bearer ${keycloak.token}`;
        return axiosPrivate(prevRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token after 401 error:", refreshError);
        logoutUser(); 
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 403) {
      logoutUser();
    } else if (error.response?.status === 500) {
      window.location.href = "/internal-error";
    }
    return Promise.reject(error);
  }
);

export { axiosPrivate };
