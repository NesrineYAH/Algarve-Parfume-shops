// index.jsx ou main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import CartProvider from "./context/CartContext";
import UserProvider from "./context/UserContext";
// import CommentsProvider  from "./context/CommentsContext";
import { CommentsProvider } from "./context/CommentsContext"; // ✅ ICI

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CommentsProvider>
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </CommentsProvider>
    </BrowserRouter>
  </React.StrictMode>
);

