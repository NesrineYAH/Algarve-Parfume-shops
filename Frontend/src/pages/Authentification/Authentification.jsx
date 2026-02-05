// Frontend/src/pages/Authentification/Authentification.jsx
import React, { useState, useContext } from "react";
import { registerUser, loginUser } from "../../Services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import "./Authentification.scss";
import { UserContext } from "../../context/UserContext";

export default function Authentification() {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
// 🔑 clé magique
const redirectTo = location.state?.redirectTo || "/MonCompte";

const { handleLogin, handleRegister } = useContext(UserContext);

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    if (activeTab === "login") {
      // 🔵 Connexion via UserContext
      const response = await handleLogin(form);

      if (response.user) {
        setMessage("Connexion réussie !");
         navigate(redirectTo);
      } else {
        setMessage(response.message || "Identifiants invalides");
      }

    } else {
      // 🔵 Inscription via UserContext
      const response = await handleRegister(form);

      if (response.user) {
        setMessage("Inscription réussie !");
        navigate("/MonCompte");
      } else {
        setMessage(response.message || "Erreur lors de l'inscription");
      }
    }

  } catch (err) {
    console.error(err);
    setMessage("Erreur serveur, veuillez réessayer.");
  }
};

  return (
    <div className="Auth-container">
      <div className="tabs">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          Connexion
        </button>
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Inscription
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "register" && (
          <>
            <input
              type="text"
              placeholder="Nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              required
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁‍🗨" : "👀"}
          </span>
        </div>

         {/* 👉 Ajouter ce bloc ICI  05/12*/}
  {activeTab === "login" && (
    <p 
      className="forgot-password"
      onClick={() => navigate("/mot-de-passe-oublie")}
    >
      Mot de passe oublié ?
    </p>
  )}

        <button type="submit">
          {activeTab === "login" ? "Se connecter" : "S'inscrire"}
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
}
