import React, { createContext, useState } from "react";

// Création du context
export const CartContext = createContext();

// Provider pour envelopper ton app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
