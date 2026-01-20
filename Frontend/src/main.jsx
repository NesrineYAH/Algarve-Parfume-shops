// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import CartProvider from "./context/CartContext";
import UserProvider from "./context/UserContext";
import { AvisProvider } from "./context/AvisContext";
import { FavoritesProvider } from "./context/FavoritesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <UserProvider>
        <AvisProvider>
          <FavoritesProvider>
          <CartProvider>
            <App />
          </CartProvider>
          </FavoritesProvider>
        </AvisProvider>
      </UserProvider>
    </BrowserRouter>
  </>
);
