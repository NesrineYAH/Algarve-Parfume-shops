import { createContext, useState, useEffect, useContext } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../Services/auth";
import { CartContext } from "./CartContext";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const cartContext = useContext(CartContext); // ✅ SAFE
  const clearCart = cartContext?.clearCart;   // ✅ SAFE

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loadingUser, setLoadingUser] = useState(true);

  // 🔄 Vérifier utilisateur via token
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
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // 🔐 LOGIN
  const handleLogin = async (credentials) => {
    const data = await loginUser(credentials);

    if (data?.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  };

  // 📝 REGISTER
  const handleRegister = async (credentials) => {
    const data = await registerUser(credentials);

    if (data?.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  };

  // 🚪 LOGOUT (PROPRE)
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
