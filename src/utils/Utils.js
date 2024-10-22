import keycloak from "../keycloak";
import { LOGOUT_REDIRECT_URL } from "./Constant";


export const validateInput = (inputString) => {
    // Define the regular expression to match
    var expression = /^[a-zA-Z\s,]+$/;
  
    // Use the test() method to check if the inputString does not match the expression
    if (!expression.test(inputString)) {
      return false; // Input does not match the expression
    }
  
    return true; // Input matches the expression
  }

export const validateJwtToken = (token) => {
  if(token && token !== ""){
    return true
  }
  return false
}

export const isValidEmail = (email) => {
  // Regular expression for basic email validation
  var emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}



export const logoutUser = () => {
  localStorage.clear();
  keycloak.logout({
    redirectUri: LOGOUT_REDIRECT_URL,
  })
  .then((success) => {
    console.log("logout success", success);
  })
  .catch((error) => {
    console.log("logout error", error);
  });
};
