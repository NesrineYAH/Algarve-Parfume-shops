// service/auth.js
export async function loginUser(credentials) {
  try {
    const res = await fetch("http://localhost:5001/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur serveur" };
    }


    return { success: true, user: data.user };

  } catch (err) {
    console.error("Erreur login:", err);
    return { success: false, message: "Erreur serveur" };
  }
}

export async function registerUser(credentials) {
  try {
    const res = await fetch("http://localhost:5001/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return { success: true, user: data.user };

  } catch (err) {
    console.error("Erreur register:", err);
    return { success: false, message: "Erreur serveur" };
  }
}

export async function getCurrentUser() {
  try {
    const res = await fetch("http://localhost:5001/api/users/moncompte", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    const userLang = navigator.language.slice(0, 2);
    const data = await res.json();
    if (!data.user) return null;

    return {
      _id: data.user._id,
      nom: data.user.nom,
      prenom: data.user.prenom,
      email: data.user.email,
      role: data.user.role,
      lang: userLang
    };

  } catch (err) {
    console.error("Erreur getCurrentUser:", err);
    return null;
  }
}


export async function logoutUser() {
  try {
    await fetch("http://localhost:5001/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Erreur logout:", err);
  }
}

export async function forgotPassword(email) {
  const res = await fetch("http://localhost:5001/api/users/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPassword(token, password) {
  const res = await fetch(`http://localhost:5001/api/users/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ password }),
  });
  return res.json();
}
