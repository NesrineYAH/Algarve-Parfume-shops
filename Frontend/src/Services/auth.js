// src/services/authService.js
export async function registerUser(userData) {
  const res = await fetch("http://localhost:5000/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  return data;
}

// src/services/authService.js
export async function loginUser(credentials) {
  const res = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (data.token) localStorage.setItem("token", data.token); // stocke le token JWT
  return data;
}
