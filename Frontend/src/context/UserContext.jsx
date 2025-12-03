// src/context/UserContext.js
import { createContext, useState, useEffect } from "react";
import { loginUser  } from "../Services/auth"

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

/*
auth.js : c’est ton service qui fait les appels API (login, logout, register, getUser, etc.).
UserContext : c’est ton “state manager” React qui garde en mémoire l’utilisateur courant et expose des fonctions pour mettre à jour ce state.
*/
