//service/auth.js 
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
      return { message: data.message || "Erreur serveur" };
    }

    // Stockage du token
    if (data.token) localStorage.setItem("token", data.token);

    // Stockage des infos utilisateur
    if (data.user) {
      localStorage.setItem("userId", data.user._id);   // 👈 important pour fetch orders
      localStorage.setItem("nom", data.user.nom);
      localStorage.setItem("prenom", data.user.prenom);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", data.user.role);
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
    console.log(credentials);
    //   const text = await res.text();
    //   const data = JSON.parse(text);
    const data = await res.json();
    if (!res.ok) {
      // ⛔ Retourne une erreur si le backend a renvoyé 400 ou autre
      return { success: false, message: data.message };
    }
    //    return data;
    return { success: true, data };

  } catch (err) {
    return { message: "Erreur serveur" };
  }
}
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch("http://localhost:5001/api/users/moncompte", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.user) return null;

    // 🔥 Normalisation du user
    const normalizedUser = {
      _id: data.user._id || data.user.userId,   // ✔ compatible backend
      nom: data.user.nom,
      prenom: data.user.prenom,
      email: data.user.email,
      role: data.user.role,
    };

    // 🔥 synchronisation localStorage
    localStorage.setItem("userId", normalizedUser._id);
    localStorage.setItem("nom", normalizedUser.nom);
    localStorage.setItem("prenom", normalizedUser.prenom);
    localStorage.setItem("email", normalizedUser.email);
    localStorage.setItem("role", normalizedUser.role);

    return normalizedUser;

  } catch (err) {
    console.error("Erreur getCurrentUser:", err);
    return null;
  }
}


export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("nom");
  localStorage.removeItem("prenom");
  localStorage.removeItem("email");
  localStorage.removeItem("role");

  return true;
}

// 05/12 ajout forgotPassword & resetPassword
export async function forgotPassword(email) {
  const res = await fetch("http://localhost:5001/api/users/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPassword(token, password) {
  const res = await fetch(`http://localhost:5001/api/users/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json();
}

/*
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch("http://localhost:5001/api/users/moncompte", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.user) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("nom", data.user.nom);
      localStorage.setItem("prenom", data.user.prenom);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", data.user.role);
    }


    return data.user; // dépend de ce que ton backend renvoie
  } catch (err) {
    console.error("Erreur getCurrentUser:", err);
    return null;
  }
}

*/