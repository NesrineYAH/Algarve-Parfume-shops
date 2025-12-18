// src/context/UserContext.js
import { createContext, useState, useEffect } from "react";
import {loginUser,registerUser, getCurrentUser, logoutUser,
} from "../Services/auth";

export const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    // 🟢 1️⃣ Charger l'utilisateur depuis localStorage au démarrage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loadingUser, setLoadingUser] = useState(true);

  // 🟢 2️⃣ Vérifier le token côté serveur + mettre à jour le user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }

      } catch (err) {
        console.error("Erreur fetchUser:", err);
        setUser(null);
        localStorage.removeItem("user");
      }

      setLoadingUser(false);
    };

    fetchUser();
  }, []);

  // stocker user + token
  const handleLogin = async (credentials) => {
    const data = await loginUser(credentials);

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  };

  // même logique que login
  const handleRegister = async (credentials) => {
    const data = await registerUser(credentials);

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  };

  // supprimer user + token
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser,
        handleLogin,
        handleRegister,
        handleLogout,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;


/*
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      
   //   setUser(currentUser);
   
// if (currentUser) {
//      setUser({
//        _id: currentUser._id,
//        nom: currentUser.nom,
//        prenom: currentUser.prenom,
//        email: currentUser.email,
//        role: currentUser.role,
//      });
//    } else {
//      setUser(null);
//    }

   if (currentUser) {
      setUser(currentUser);
    }
    setLoadingUser(false);
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
*/




/*
auth.js : c’est ton service qui fait les appels API (login, logout, register, getUser, etc.).
UserContext : c’est ton “state manager” React qui garde en mémoire l’utilisateur courant et expose des fonctions pour mettre à jour ce state.
*/
