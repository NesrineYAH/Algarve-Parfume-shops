// UserContext.jsx
import { createContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../Services/auth";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔄 Vérifier l'utilisateur au chargement
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1. Vérifier si un token existe dans localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.log("🔍 Aucun token trouvé, user = null");
          setUser(null);
          setLoadingUser(false);
          return;
        }

        // 2. Appeler l'API pour vérifier le token
        const currentUser = await getCurrentUser();

        if (currentUser) {
          console.log("✅ Utilisateur vérifié:", currentUser.email);
          setUser(currentUser);
        } else {
          // Token invalide ou expiré
          console.log("❌ Token invalide, nettoyage...");
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("❌ Erreur fetchUser:", err);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // 🔐 LOGIN
  const handleLogin = async (credentials) => {
    try {
      const data = await loginUser(credentials);

      // 🔥 IMPORTANT: Vérifier que data contient user ET token
      if (data?.user && data?.token) {
        setUser(data.user);
        // 🔥 STOCKER LES DEUX
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        console.log("✅ Login réussi, token enregistré");
      }

      return data;
    } catch (error) {
      console.error("❌ Erreur login:", error);
      return null;
    }
  };

  // 📝 REGISTER
  const handleRegister = async (credentials) => {
    try {
      const data = await registerUser(credentials);

      if (data?.user && data?.token) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      console.error("❌ Erreur register:", error);
      return null;
    }
  };

  // 🚪 LOGOUT
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("❌ Erreur logout API:", error);
    } finally {
      setUser(null);
      // Supprimer TOUT
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("cart"); // Optionnel
      console.log("🚪 Déconnexion complète");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser,
        handleLogin,
        handleRegister,
        handleLogout,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;



















  /* 
  const handleLogout = async () => {
    try {
      if (clearCart) {
        await clearCart(); // 🔥 vider panier MongoDB + context
      }
    } catch (e) {
      console.warn("Panier déjà vide");
    }

    logoutUser();
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("cart"); // panier invité
  };
*/


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
