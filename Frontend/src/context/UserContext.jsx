// src/context/UserContext.js
import { createContext, useState, useEffect } from "react";
import {loginUser,registerUser, getCurrentUser, logoutUser,
} from "../Services/auth";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogin = async (credentials) => {
    const data = await loginUser(credentials);
    if (data.user) setUser(data.user);
    return data;
  };

  const handleRegister = async (credentials) => {
    const data = await registerUser(credentials);
    if (data.user) setUser(data.user);
    return data;
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, handleLogin, handleRegister, handleLogout, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

/*
auth.js : c’est ton service qui fait les appels API (login, logout, register, getUser, etc.).
UserContext : c’est ton “state manager” React qui garde en mémoire l’utilisateur courant et expose des fonctions pour mettre à jour ce state.
*/
