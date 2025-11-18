const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // ex: tonemail@gmail.com
    pass: process.env.MAIL_PASS, // mot de passe d'application Gmail
  },
});

module.exports = transporter;
