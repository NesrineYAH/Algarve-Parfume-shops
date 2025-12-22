import { createContext, useEffect, useState } from "react";

export const AvisContext = createContext();

export function AvisProvider({ children }) {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ URL cohérente avec ton backend
    fetch("http://localhost:5001/api/avis")
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Pas de filtre isApproved/type car ton modèle Avis n'a pas ces champs
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
      const res = await fetch("http://localhost:5001/api/avis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 🔹 si auth, ajouter Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAvis),
      });

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
