import React, { useState } from "react";
import { Search } from "lucide-react"; 
import "./searchBar.scss";


const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // transmet la valeur au parent
  };

  return (
    <div className="searchBar">
      <Search className="bar" size={20} />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Rechercher un produit..."
        className="searchInput"
      />
    </div>
  );
};

export default SearchBar;