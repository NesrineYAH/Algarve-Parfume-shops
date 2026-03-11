
const emailTexts = {
  fr: {
    subject: "Bienvenue sur notre plateforme Algarve Parfume !",
    text: (prenom) => `Bonjour ${prenom}, merci de vous être inscrit sur notre plateforme !`,
    html: (prenom) => `<p>Bonjour <b>${prenom}</b>,</p><p>Merci de vous être inscrit sur notre plateforme !</p>`
  },
  en: {
    subject: "Welcome to our platform Algarve Parfume!",
    text: (prenom) => `Hello ${prenom}, thank you for signing up on our platform!`,
    html: (prenom) => `<p>Hello <b>${prenom}</b>,</p><p>Thank you for signing up on our platform!</p>`
  },
  es: {
    subject: "¡Bienvenido a nuestra plataforma Algarve Parfume!",
    text: (prenom) => `Hola ${prenom}, ¡gracias por registrarte en nuestra plataforma!`,
    html: (prenom) => `<p>Hola <b>${prenom}</b>,</p><p>¡Gracias por registrarte en nuestra plataforma!</p>`
  },
  pt: {
    subject: "Bem-vindo à nossa plataforma Algarve Parfume!",
    text: (prenom) => `Olá ${prenom}, obrigado por se registrar na nossa plataforma!`,
    html: (prenom) => `<p>Olá <b>${prenom}</b>,</p><p>Obrigado por se registrar na nossa plataforma!</p>`
  }
};

const resetEmailTexts = {
  fr: {
    subject: "Réinitialisation de votre mot de passe",
    line1: "Vous avez demandé la réinitialisation de votre mot de passe.",
    line2: "Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :",
    button: "Réinitialiser mon mot de passe",
    expire: "Ce lien expirera dans 15 minutes."
  },
  en: {
    subject: "Password reset request",
    line1: "You requested to reset your password.",
    line2: "Click the button below to set a new password:",
    button: "Reset my password",
    expire: "This link will expire in 15 minutes."
  },
  es: {
    subject: "Solicitud de restablecimiento de contraseña",
    line1: "Has solicitado restablecer tu contraseña.",
    line2: "Haz clic en el botón de abajo para crear una nueva contraseña:",
    button: "Restablecer mi contraseña",
    expire: "Este enlace expirará en 15 minutos."
  },
  pt: {
    subject: "Solicitação de redefinição de senha",
    line1: "Você solicitou redefinir sua senha.",
    line2: "Clique no botão abaixo para criar uma nova senha:",
    button: "Redefinir minha senha",
    expire: "Este link expirará em 15 minutos."
  }
};

module.exports = {
  emailTexts,
  resetEmailTexts
};
