import React, { useState } from "react";
import { registerUser, loginUser } from "../../Services/auth";
import { useNavigate } from "react-router-dom";
import "./Authentification.scss";

export default function Authentification() {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === "login") {
        const response = await loginUser(form);

        if (response.token) {
          // Stockage
          localStorage.setItem("token", response.token);
          localStorage.setItem("userId", response.user._id);
          localStorage.setItem("nom", response.user.nom);
          localStorage.setItem("prenom", response.user.prenom);
          localStorage.setItem("email", response.user.email);
          localStorage.setItem("role", response.user.role);

          setMessage("Connexion réussie !");
          navigate("/MonCompte");
        } else {
          setMessage(response.message || "Identifiants invalides");
        }
      } else {
        // REGISTER
        const response = await registerUser(form);

        // ❌ Erreur d'inscription
        if (!response.success) {
          setMessage(response.message);
          return;
        }

        // ✔ Succès inscription
        const user = response.data.user;

        localStorage.setItem("token", response.data.token || "");
        localStorage.setItem("userId", user._id);
        localStorage.setItem("nom", user.nom);
        localStorage.setItem("prenom", user.prenom);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);

        setMessage("Inscription réussie !");
        navigate("/login"); // tu peux changer ici selon ton choix
      }
    } catch (err) {
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

        <button type="submit">
          {activeTab === "login" ? "Se connecter" : "S'inscrire"}
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
}


/*
 const response = await registerUser(form);
        setMessage(response.message);
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("userId", response.user._id); // 👈 idem
          localStorage.setItem("nom", response.user.nom);
          localStorage.setItem("prenom", response.user.prenom);
          localStorage.setItem("email", response.user.email);
          localStorage.setItem("role", response.user.role);

          navigate("/MonCompte");
          
        } else {
          navigate("/login"); // redirige vers login après inscription
        }
*/