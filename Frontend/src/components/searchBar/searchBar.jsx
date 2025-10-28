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
    <div className="flex items-center w-full max-w-md p-2 bg-white border shadow-sm rounded-2xl searchBar">
      <Search className="bar" size={20} />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Rechercher un produit..."
        className="flex-1 ml-2 text-gray-700 outline-none searchInput"
      />
    </div>
  );
};

export default SearchBar;