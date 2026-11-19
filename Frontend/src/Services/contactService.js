// src/services/contactService.js
export async function sendContact(formData) {
    const response = await fetch("https://e-commerce.nesrinebekkar.com/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error("Erreur serveur");
    }

    return response.json();
}


//   http://localhost:5001/api/contacts