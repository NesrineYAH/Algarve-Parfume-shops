export async function loginUser(credentials) {
  try {
    const res = await fetch("http://localhost:5001/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    console.log(credentials);

    const data = await res.json();
    if (!res.ok) {
      // Le backend a renvoyé une erreur (ex: 401 ou 400)
      return { message: data.message || "Erreur serveur" };
    }

    // Stockage du token
    if (data.token) localStorage.setItem("token", data.token);

    // Stockage du rôle
    if (data.user && data.user.role) {
      localStorage.setItem("role", data.user.role); // 👈 IMPORTANT
    }

    return data;
  } catch (err) {
    console.error("Erreur attrapée :", err);
    return { message: "Erreur serveur !!" };
  }
}

export async function registerUser(credentials) {
  try {
    const res = await fetch("http://localhost:5001/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const text = await res.text();
    const data = JSON.parse(text);
    return data;
  } catch (err) {
    return { message: "Erreur serveur" };
  }
}
