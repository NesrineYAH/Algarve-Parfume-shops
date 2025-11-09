import React, { useState } from "react";
import { loginUser } from "../../Services/auth";
import { useNavigate } from "react-router-dom";
import './Login.scss';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(form);

      if (response.token) {
        setMessage("Connexion réussie !");
        // Redirige vers le dashboard ou la page d'accueil
        navigate("/dashboard");
      } else {
        setMessage(response.message || "Identifiants invalides");
      }
    } catch (err) {
      setMessage("Erreur serveur, veuillez réessayer.");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;
