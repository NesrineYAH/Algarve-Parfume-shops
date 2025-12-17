// utils/sendPromoEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true si port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction générique pour envoyer un email

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("Email envoyé :", info.response);
  } catch (error) {
    console.error("Erreur envoi email :", error);
  }
};

const sendPromoEmail = async ({ to, title, message, imageUrl, discount, newPrice }) => {
  try {
    const htmlContent = `
      <h2>${title}</h2>
      <p>${message}</p>
      ${imageUrl ? `<img src="http://localhost:5001/uploads/image.png" />` : ""}
      ${discount ? `<p>Remise : ${discount}% - Nouveau prix : ${newPrice}</p>` : ""}
      <a href="http://localhost:5173">Voir la promotion</a>`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `🎉 ${title}`,
      text: message,
      html: htmlContent,
    });

    console.log(`Email promotion envoyé à ${to}`);
  } catch (error) {
    console.error("Erreur envoi promotion :", error);
  }
};



module.exports = { sendEmail, sendPromoEmail };


/*
const sendPromoEmail = async ({ to, title, message, imageUrl, discount, newPrice }) => {
  try {
    const fullImageUrl = imageUrl
      ? `${BASE_URL}${imageUrl}`
      : null;

    const htmlContent = `
      <h2>${title}</h2>
      <p>${message}</p>

      ${fullImageUrl
        ? `<img src="${fullImageUrl}" width="300" style="max-width:100%;border-radius:8px;" />`
        : ""
      }

      ${discount ? `<p>Remise : ${discount}%</p>` : ""}
      ${newPrice ? `<p>Nouveau prix : ${newPrice}</p>` : ""}

      <a href="http://localhost:5173">Voir la promotion</a>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `🎉 ${title}`,
      text: message,
      html: htmlContent,
    });

    console.log(`✅ Email promotion envoyé à ${to}`);
  } catch (error) {
    console.error("❌ Erreur envoi promotion :", error);
  }
};
*/