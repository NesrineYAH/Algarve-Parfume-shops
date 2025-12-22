// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import CartProvider from "./context/CartContext";
import UserProvider from "./context/UserContext";
import { AvisProvider } from "./context/AvisContext"; // ✅ Contexte Avis

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AvisProvider>
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </AvisProvider>
    </BrowserRouter>
  </React.StrictMode>
);
