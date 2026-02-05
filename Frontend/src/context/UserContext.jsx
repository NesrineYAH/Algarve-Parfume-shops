// UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser,logoutUser } from "../Services/auth";
import { useNavigate } from "react-router-dom";


export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 👉 On ne vérifie PLUS localStorage.token
        const currentUser = await getCurrentUser(); // doit envoyer credentials: "include"

        if (currentUser) {
          console.log("✅ Utilisateur vérifié via cookie:", currentUser.email);
          setUser(currentUser);
        } else {
          console.log("❌ Aucun utilisateur trouvé via cookie");
          setUser(null);
        }
      } catch (err) {
        console.error("❌ Erreur fetchUser:", err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

const handleLogin = async (credentials, navigate) => {
  try {
    const data = await loginUser(credentials);

    if (data.success && data.user) {
      setUser(data.user);
      console.log("✅ Login réussi");

      // Redirection selon le rôle
      if (data.user.role === "admin" || data.user.role === "vendeur") {
        navigate("/admin-dashboard"); 
      } else {
        navigate("/MonCompte"); 
      }
    }

    return data;

  } catch (err) {
    console.error("❌ Erreur login:", err);
    return { success: false, message: "Erreur serveur" };
  }
};

  const handleRegister = async (credentials) => {
    try {
      const data = await registerUser(credentials);

      if (data?.success && data?.user) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("❌ Erreur register:", error);
      return null;
    }
  };
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("❌ Erreur logout API:", error);
    } finally {
      setUser(null);
   
    navigate("/Home");
      localStorage.removeItem("cart");
      console.log("🚪 Déconnexion complète");
    }
  };
   const refreshUser = async () => {
  try {
    const currentUser = await getCurrentUser(); // appelle /auth/me
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  } catch (err) {
    console.error("❌ Erreur refreshUser:", err);
    setUser(null);
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
         refreshUser, // ← AJOUT ICI
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;


/*
const handleLogin = async () => {
  try {
    const response = await axios.post("/api/users/login", credentials);
    const { role } = response.data.user;

    if (role === "admin" || role === "vendeur") {
      navigate("/admin-dashboard"); // redirection spéciale pour admin/vendeur
    } else {
      navigate("/moncompte"); // tous les autres clients
    }
  } catch (err) {
    console.error(err);
    alert("Login échoué !");
  }
};




*/


















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
