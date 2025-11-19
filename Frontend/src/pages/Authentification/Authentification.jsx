import React, { useState } from "react";
import { registerUser, loginUser } from "../../Services/auth";
import { useNavigate } from "react-router-dom";
import './Authentification.scss';

export default function Authentification() {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === "login") {
        const response = await loginUser(form);
        if (response.token) {
          localStorage.setItem("token", response.token);
          if (response.user && response.user.role) {
            localStorage.setItem("role", response.user.role);
          }
          setMessage("Connexion réussie !");
          navigate("/profil");
        } else {
          setMessage(response.message || "Identifiants invalides");
        }
      } else {
        // REGISTER
        const response = await registerUser(form);
        setMessage(response.message);

        // Si backend renvoie token, tu peux stocker ici aussi
        if (response.token) {
          localStorage.setItem("token", response.token);
          navigate("/profil");
        } else {
          navigate("/login"); // redirige vers login après inscription
        }
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
          <input
            type="text"
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
