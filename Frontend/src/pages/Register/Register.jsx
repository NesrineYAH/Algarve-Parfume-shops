// src/pages/Register.jsx
import React, { useState } from 'react';
 import { registerUser }from "../../Services/auth";

function Register() {
  const [form, setForm] = useState({ nom: '', email: '', mot_de_passe: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser(form);
    setMessage(response.message || 'Erreur');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nom" value={form.nom}
        onChange={(e) => setForm({ ...form, nom: e.target.value })} />
      <input type="email" placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Mot de passe" value={form.mot_de_passe}
        onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })} />
      <button type="submit">S’inscrire</button>
      <p>{message}</p>
    </form>
  );
}

export default Register;
