import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

  // 🔄 Charger les favoris depuis MongoDB quand user connecté
useEffect(() => {
  const loadFavorites = async () => {
    const token = localStorage.getItem("token");

  /*  // 👤 NON CONNECTÉ → localStorage
    if (!token) {
      const localFavs =
        JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(localFavs);
      return;
    }
*/
    // 🔐 CONNECTÉ → API
    try {
      const res = await fetch(
        "http://localhost:5001/api/users/favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error("Erreur chargement favoris :", err);
      setFavorites([]); // 🔥 IMPORTANT
    }
  };
  loadFavorites();
}, []);


  // ❤️ TOGGLE FAVORI
  const toggleFavorite = async (product) => {
    // 👤 NON CONNECTÉ → localStorage
    if (!user?._id) {
      const exists = favorites.some(f => f.productId === product._id);

      const updated = exists
        ? favorites.filter(f => f.productId !== product._id)
        : [...favorites, { productId: product._id, ...product }];

      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return;
    }

    // 🔐 CONNECTÉ → MongoDB
    try {
      const res = await fetch(
        `http://localhost:5001/api/users/favorites/${product._id}`,
        {
          method: "POST", // toggle backend
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error("Erreur toggle favoris :", err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

