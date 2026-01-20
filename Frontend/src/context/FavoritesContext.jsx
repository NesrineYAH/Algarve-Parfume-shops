import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

useEffect(() => {
  const mergeLocalFavorites = async () => {
    if (!user?._id) return;

    const localFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (localFavs.length === 0) return;

    try {
      await fetch("http://localhost:5001/api/users/favorites/merge", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ favorites: localFavs.map(f => f.productId) })
      });

      localStorage.removeItem("favorites");
    } catch (err) {
      console.error("Erreur fusion favoris :", err);
    }
  };

  mergeLocalFavorites();
}, [user]);

const toggleFavorite = async (product) => {
  try {
    let updatedFavorites;
    const isFavorite = favorites.some((fav) => fav._id === product._id);

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav._id !== product._id);
    } else {
      updatedFavorites = [...favorites, product];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Mettre à jour la collection users via API
    const productId = product._id;
    await fetch(`http://localhost:5001/api/users/favorites/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Ajouter le token si besoin : Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ add: !isFavorite }) // ajouter ou retirer selon l’état
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des favoris :", error);
  }
};

const removeFavorite = async (productId) => {
  const isInLocal = !user?._id;
  if (isInLocal) {
    const updated = favorites.filter(f => f.productId !== productId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    return;
  }

  try {
    const res = await fetch(`http://localhost:5001/api/users/favorites/${productId}`, {
      method: "POST", // ou PUT selon ta route
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json"
      },
    });
    const data = await res.json();
    setFavorites(data);
  } catch (err) {
    console.error("Erreur suppression favori :", err);
  }
};


  return (
<FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite }}>
  {children}
</FavoritesContext.Provider>

  );
};
