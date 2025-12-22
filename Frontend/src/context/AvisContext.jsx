import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext"; // si tu stockes le token dans UserContext

export const AvisContext = createContext();

export function AvisProvider({ children }) {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupération du token depuis UserContext ou localStorage
  const { user } = useContext(UserContext); 
  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5001/api/avis")
      .then((res) => res.json())
      .then((data) => {
        setAvis(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du fetch des avis :", err);
        setLoading(false);
      });
  }, []);

  // ➕ Ajouter un avis
  const addAvis = async (newAvis) => {
    try {
      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }

      const res = await fetch("http://localhost:5001/api/avis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔑 indispensable pour éviter le 401
        },
        body: JSON.stringify(newAvis),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avis");

      const savedAvis = await res.json();

      // 🔥 mise à jour instantanée
      setAvis((prev) => [savedAvis, ...prev]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis :", error);
    }
  };

  return (
    <AvisContext.Provider value={{ avis, loading, addAvis }}>
      {children}
    </AvisContext.Provider>
  );
}
