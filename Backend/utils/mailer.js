const nodemailer = require("nodemailer"); 
require("dotenv").config();

// Création du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // ex: smtp.tonhebergeur.com
  port: process.env.SMTP_PORT, // 587 ou 465
  secure: false, // true si port 465
  auth: {
    user: process.env.EMAIL_USER, // contact@nesrinebekkar.com
    pass: process.env.EMAIL_PASS, // mot de passe de ta boîte mail
  },
});

// Fonction pour envoyer un mail
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

module.exports = sendEmail;
