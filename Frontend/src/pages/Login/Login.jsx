import React, { useState } from "react";
import { loginUser } from "../../Services/auth";
import { useNavigate } from "react-router-dom";
import './Login.scss';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 état pour l'œil
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(form);

      if (response.token) {
        setMessage("Connexion réussie !"); 
        localStorage.setItem("token", response.token);
    //     localStorage.setItem("role", response.user.role); 18//11

      if (response.user && response.user.role) {
        localStorage.setItem("role", response.user.role);
      }
        
        navigate("/dashboard");

      } else {
         console.error("Erreur attrapée :", err);
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
    {/* <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        /> */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"} // 👈 bascule le type
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

        <button type="submit">S'inscrire</button>
        <p>{message}</p>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;
