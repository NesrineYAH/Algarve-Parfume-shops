import react, { useState } from "react";
import { registerUser } from "../../Services/auth";
import './Register.scss';
import { useNavigate } from "react-router-dom";



function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 état pour l'œil
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser(form);
    setMessage(response.message);

    navigate("/dashboard");
  };

  return (
    <div className="Register-container">
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
    </div>
  );
}

export default Register;

//            {showPassword ? "🙈" : "👁️"}