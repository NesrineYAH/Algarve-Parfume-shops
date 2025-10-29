// src/pages/Login.jsx
import React, { useState } from 'react';
import { loginUser } from "../../Services/auth";

function Login() {
  const [form, setForm] = useState({ email: '', mot_de_passe: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(form);
    if (response.token) {
      setMessage('Connexion réussie');
      // rediriger vers /dashboard par exemple
    } else {
      setMessage(response.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Mot de passe"
        value={form.mot_de_passe}
        onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })} />
      <button type="submit">Se connecter</button>
      <p>{message}</p>
    </form>
  );
}

export default Login;
