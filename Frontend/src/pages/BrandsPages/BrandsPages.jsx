import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function BrandsPages() {
    const { t } = useTranslation();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Liste de marques de parfumerie (tu peux en ajouter autant que tu veux)
  const allBrands = [
    "Sephora",
    "Zara",
    "Chanel",
    "Dior",
    "Guerlain",
    "Yves Saint Laurent",
    "Lancôme",
    "Givenchy",
    "Hermès",
    "Mugler",
    "Armani",
    "Paco Rabanne",
    "Kenzo",
    "Azzaro",
    "Bvlgari",
    "Calvin Klein",
    "Dolce & Gabbana",
    "Hugo Boss",
    "Jean Paul Gaultier",
    "Tom Ford",
    "Versace",
    "Valentino",
    "Nina Ricci",
    "Rochas",
    "Burberry",
    "Carolina Herrera",
    "Montblanc",
    "Prada",
    "Zadig & Voltaire",
  ];

  const [selectedLetter, setSelectedLetter] = useState("A");

  const filteredBrands = allBrands.filter((brand) =>
    brand.toUpperCase().startsWith(selectedLetter)
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{t("header.titleVI")} </h1>

      {/* Alphabet */}
      <div style={styles.alphabet}>
        {alphabet.map((letter) => (
          <span
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            style={{
              ...styles.letter,
              textDecoration: selectedLetter === letter ? "underline" : "none",
              fontWeight: selectedLetter === letter ? "bold" : "normal",
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Liste filtrée */}
      <div style={styles.list}>
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <div key={brand} style={styles.brandItem}>
              {brand}
            </div>
          ))
        ) : (
          <p>Aucune marque trouvée pour la lettre {selectedLetter}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  alphabet: {
    display: "flex",
    justifyContent: "center",
  alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "30px",
    fontSize: "20px",
    cursor: "pointer",
  },
  letter: {
    cursor: "pointer",
  },
  list: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    border: ".4rem, solid #fefefe",
  },
  brandItem: {
    padding: "12px",
    background: "#f7f7f7",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "600",
  },
};

