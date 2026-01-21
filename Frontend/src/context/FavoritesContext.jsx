import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

  // 🔄 Charger les favoris quand l'utilisateur est connecté
  useEffect(() => {
    const loadFavorites = async () => {
      const token = localStorage.getItem("token");

      // ❌ Pas connecté → reset
      if (!token || !user?._id) {
        setFavorites([]);
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:5001/api/users/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        // 🔒 sécurité absolue
        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erreur chargement favoris :", err);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user]);

  // ❤️ TOGGLE FAVORI
  const toggleFavorite = async (product) => {
    const token = localStorage.getItem("token");

    // 👤 NON CONNECTÉ → localStorage uniquement
    if (!token || !user?._id) {
      const exists = favorites.some((f) => f._id === product._id);

      const updated = exists
        ? favorites.filter((f) => f._id !== product._id)
        : [...favorites, product];

      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return;
    }

    // 🔐 CONNECTÉ → API
    try {
      const res = await fetch(
        `http://localhost:5001/api/users/favorites/${product._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erreur toggle favoris");
      }

      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Erreur toggle favoris :", err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
export default FavoritesProvider;