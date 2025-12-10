// src/services/contactService.js


export async function sendContact(formData) {
    const response = await fetch("http://localhost:5001/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error("Erreur serveur");
    }

    return response.json();
}
