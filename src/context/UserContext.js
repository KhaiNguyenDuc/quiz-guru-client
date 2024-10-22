import React, { createContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthenticated, setAuthenticated]  = useState(false);
  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}


export { UserProvider, UserContext};
