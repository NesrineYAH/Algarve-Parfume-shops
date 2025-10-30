import react , { useState } from "react";
import { registerUser } from "../../Services/auth";


function Register() {
  const [form, setForm] = useState({ name:"", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser(form);
    setMessage(response.message);
  };

  return (
    <form onSubmit={handleSubmit}>
          <input
        type="name"
        placeholder="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
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
      <button type="submit">S'inscrire</button>
      <p>{message}</p>
    </form>
  );
}

export default Register;